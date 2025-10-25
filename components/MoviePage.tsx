import React, { useMemo, useCallback } from 'react';
import { Post, Person, MovieDetails, HypeLogEntry, CelebrityDetails } from '../types';
import { PostType } from '../PostType';
import MovieHero from './movie_page/MovieHero';
import CastCrew from './movie_page/CastCrew';
import Episodes from './movie_page/Episodes';
import RelatedTitles from './movie_page/RelatedTitles';
import PhotoGallery from './movie_page/PhotoGallery';
import MovieDetailsBox from './movie_page/MovieDetailsBox';
import SocialShare from './movie_page/SocialShare';
import RelatedBuzz from './movie_page/RelatedBuzz';
import RelatedVideos from './movie_page/RelatedVideos';
import HypeStarBadge from './movie_page/HypeStarBadge';
import CharacterIntroductions from './movie_page/CharacterIntroductions';

interface MoviePageProps {
  movieId: string;
  posts: Post[];
  onClose: () => void;
  onReaction: (postId: string, reactionId: string) => void;
  onFanzSay: (postId: string, fanzSayId: string) => void;
  currentUserAvatar: string;
  onViewMoviePage: (movieId: string) => void;
  onViewCelebrityPage: (celebrityId: string) => void;
  onViewFullPost: (post: Post) => void;
  userHypeState: { count: number; lastReset: string };
  onHype: (movieId: string) => void;
  hypeLog: HypeLogEntry[];
  moviesMap: Map<string, MovieDetails>;
  celebritiesMap: Map<string, CelebrityDetails>;
  onToggleFavoriteMovie: (movieTitle: string) => void;
  favoriteMovies: string[];
}

const MoviePage: React.FC<MoviePageProps> = ({ movieId, posts, onClose, onReaction, onFanzSay, currentUserAvatar, onViewMoviePage, onViewCelebrityPage, onViewFullPost, userHypeState, onHype, hypeLog, moviesMap, celebritiesMap, onToggleFavoriteMovie, favoriteMovies }) => {
  const movieData = useMemo(() => {
    const primaryPost = posts.find(p => 
        (p.type === PostType.MovieDetails && p.movieDetails?.id === movieId) ||
        (p.type === PostType.ProjectAnnouncement && p.linkedMovieIds?.includes(movieId))
    );

    if (!primaryPost) return null;

    let details: MovieDetails;
    const isProject = primaryPost.type === PostType.ProjectAnnouncement;

    if (isProject && primaryPost.projectAnnouncementDetails) {
        const pa = primaryPost.projectAnnouncementDetails;
        details = {
            id: movieId,
            title: pa.title,
            type: 'Movie', // Defaulting to movie, could be 'TV Series'
            posterUrl: pa.posterUrl,
            rating: 0, // No rating for projects
            releaseDate: pa.expectedRelease,
            director: pa.crew.find(p => p.role.toLowerCase() === 'director')?.name || 'TBA',
            cast: pa.cast.map(p => p.name),
            genres: [pa.status],
            synopsis: pa.logline,
            country: 'TBA',
            language: 'TBA',
            productionCompanies: [],
            fullCast: pa.cast,
            crew: pa.crew,
        };
    } else if (primaryPost.type === PostType.MovieDetails && primaryPost.movieDetails) {
        details = primaryPost.movieDetails;
    } else {
        return null; // Invalid state
    }

    const trailerPost = posts.find(p => p.type === PostType.Trailer && p.linkedMovieIds?.includes(movieId));
    const heroImagePost = posts.find(p => p.type === PostType.Image && p.linkedMovieIds?.includes(movieId));
    const galleryImagePosts = posts.filter(p => p.type === PostType.Image && p.linkedMovieIds?.includes(movieId));
    
    const relatedMovies: MovieDetails[] = posts
      .filter(p => 
        p.type === PostType.MovieDetails &&
        p.movieDetails &&
        p.movieDetails.id !== movieId &&
        details.genres.some(g => p.movieDetails!.genres.includes(g))
      )
      .slice(0, 10)
      .map(p => p.movieDetails!);
      
    const episodes = primaryPost.episodes;
    
    const relatedPosts = posts.filter(p => 
        p.id !== primaryPost.id && p.linkedMovieIds?.includes(movieId) && p.type !== PostType.Trailer && !p.videoUrl
    );

    const relatedVideos = posts.filter(p =>
      (p.type === PostType.Trailer || p.videoUrl) && p.linkedMovieIds?.includes(movieId)
    );
    
    const characterIntroPosts = posts.filter(p => 
        p.type === PostType.CharacterIntroduction && p.linkedMovieIds?.includes(movieId)
    );

    return {
      moviePost: primaryPost,
      details,
      isProject,
      trailerUrl: trailerPost?.videoUrl,
      heroImageUrl: heroImagePost?.imageUrl || details.posterUrl,
      galleryImageUrls: galleryImagePosts.map(p => p.imageUrl!),
      relatedMovies,
      episodes,
      fullCast: details.fullCast,
      crew: details.crew,
      relatedPosts,
      relatedVideos,
      characterIntroPosts,
    };
  }, [movieId, posts]);

  const totalHypesForMovie = useMemo(() => {
    return hypeLog.filter(h => h.movieId === movieId).length;
  }, [hypeLog, movieId]);
  
  const isFavorite = useMemo(() => {
    if (!movieData) return false;
    return favoriteMovies.includes(movieData.details.title);
  }, [favoriteMovies, movieData]);

  const handleToggleFavorite = useCallback(() => {
    if (movieData) {
      onToggleFavoriteMovie(movieData.details.title);
    }
  }, [onToggleFavoriteMovie, movieData]);

  if (!movieData) {
    return (
      <div className="fixed inset-0 bg-slate-900 z-40 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Movie Not Found</h1>
          <p className="text-slate-400 mt-2">The requested movie or project could not be found.</p>
          <button onClick={onClose} className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full">
            Back to Feed
          </button>
        </div>
      </div>
    );
  }

  const { details, heroImageUrl, trailerUrl, galleryImageUrls, relatedMovies, episodes, fullCast, crew, relatedPosts, relatedVideos, characterIntroPosts } = movieData;

  return (
    <div className="fixed inset-0 bg-slate-900 z-40 animate-page-enter">
      <div className="absolute top-4 left-4 z-50">
        <button onClick={onClose} className="flex items-center gap-2 text-white font-semibold text-sm p-2 rounded-lg bg-black/40 hover:bg-black/60 transition-colors backdrop-blur-sm">
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Feed
        </button>
      </div>

      <div className="h-full w-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
        <MovieHero
          title={details.title}
          posterUrl={details.posterUrl}
          heroImageUrl={heroImageUrl}
          rating={details.rating}
          genres={details.genres}
          trailerUrl={trailerUrl}
          movieId={movieId}
          hypeCount={userHypeState.count}
          totalHypes={totalHypesForMovie}
          onHype={() => onHype(movieId)}
          isFavorite={isFavorite}
          onToggleFavorite={handleToggleFavorite}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
          
          <section className="animate-fade-in-up">
            <p className="text-slate-300 leading-relaxed max-w-4xl">{details.synopsis}</p>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-10">
              <CastCrew title="Cast" people={fullCast} onViewCelebrityPage={onViewCelebrityPage} />
              
              {characterIntroPosts.length > 0 && (
                <CharacterIntroductions 
                  posts={characterIntroPosts}
                  movieDetails={details}
                  onViewCelebrityPage={onViewCelebrityPage}
                  onViewFullPost={onViewFullPost}
                />
              )}

              <CastCrew title="Crew" people={crew} onViewCelebrityPage={onViewCelebrityPage} />
            </div>
            <div className="space-y-6">
              <MovieDetailsBox details={details} />
              <HypeStarBadge
                movieId={movieId}
                movieTitle={details.title}
                hypeLog={hypeLog}
                currentUserAvatar={currentUserAvatar}
              />
              <SocialShare />
            </div>
          </div>
          
          {galleryImageUrls.length > 0 && (
            <PhotoGallery imageUrls={galleryImageUrls} />
          )}

          {details.type === 'TV Series' && episodes && episodes.length > 0 && (
            <Episodes episodes={episodes} />
          )}

          {details.type === 'Movie' && relatedVideos.length > 0 && (
             <RelatedVideos videos={relatedVideos} />
          )}

          {relatedMovies.length > 0 && (
            <RelatedTitles movies={relatedMovies} onViewMoviePage={onViewMoviePage} />
          )}

          {relatedPosts.length > 0 && (
            <RelatedBuzz
                posts={relatedPosts}
                onReaction={onReaction}
                onFanzSay={onFanzSay}
                currentUserAvatar={currentUserAvatar}
                onViewFullPost={onViewFullPost}
                onViewMoviePage={onViewMoviePage}
                onViewCelebrityPage={onViewCelebrityPage}
                moviesMap={moviesMap}
                celebritiesMap={celebritiesMap}
            />
          )}

        </div>
      </div>
    </div>
  );
};

export default MoviePage;