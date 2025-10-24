import React, { useMemo } from 'react';
import { Post, Person, MovieDetails, HypeLogEntry } from '../types';
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

interface MoviePageProps {
  movieId: string;
  posts: Post[];
  onClose: () => void;
  onReaction: (postId: string, reactionId: string) => void;
  onFanzSay: (postId: string, fanzSayId: string) => void;
  onRatePost: (postId: string, rating: number) => void;
  currentUserAvatar: string;
  onViewMoviePage: (movieId: string) => void;
  onViewCelebrityPage: (celebrityId: string) => void;
  onViewFullPost: (post: Post) => void;
  userHypeState: { count: number; lastReset: string };
  onHype: (movieId: string) => void;
  hypeLog: HypeLogEntry[];
}

const MoviePage: React.FC<MoviePageProps> = ({ movieId, posts, onClose, onReaction, onFanzSay, onRatePost, currentUserAvatar, onViewMoviePage, onViewCelebrityPage, onViewFullPost, userHypeState, onHype, hypeLog }) => {
  const movieData = useMemo(() => {
    const moviePost = posts.find(p => p.type === PostType.MovieDetails && p.movieDetails?.id === movieId);
    if (!moviePost || !moviePost.movieDetails) return null;

    const trailerPost = posts.find(p => p.type === PostType.Trailer && p.linkedMovieIds?.includes(movieId));
    const heroImagePost = posts.find(p => p.type === PostType.Image && p.linkedMovieIds?.includes(movieId));
    const galleryImagePosts = posts.filter(p => p.type === PostType.Image && p.linkedMovieIds?.includes(movieId));
    
    const relatedMovies: MovieDetails[] = posts
      .filter(p => 
        p.type === PostType.MovieDetails &&
        p.movieDetails &&
        p.movieDetails.id !== movieId &&
        p.movieDetails.genres.some(g => moviePost!.movieDetails!.genres.includes(g))
      )
      .slice(0, 10) // Limit to 10 related titles
      .map(p => p.movieDetails!);
      
    const episodes = posts.find(p => p.id === moviePost.id)?.episodes;
    
    const fullCast: Person[] = moviePost.movieDetails.fullCast || [];
    const crew: Person[] = moviePost.movieDetails.crew || [];
    
    const relatedPosts = posts.filter(p => 
        p.id !== moviePost.id && p.linkedMovieIds?.includes(movieId) && p.type !== PostType.Trailer && !p.videoUrl
    );

    const relatedVideos = posts.filter(p =>
      (p.type === PostType.Trailer || p.videoUrl) && p.linkedMovieIds?.includes(movieId)
    );

    return {
      moviePost,
      trailerUrl: trailerPost?.videoUrl,
      heroImageUrl: heroImagePost?.imageUrl || moviePost.movieDetails.posterUrl, // Fallback to poster
      galleryImageUrls: galleryImagePosts.map(p => p.imageUrl!),
      relatedMovies,
      episodes,
      fullCast,
      crew,
      relatedPosts,
      relatedVideos,
    };
  }, [movieId, posts]);

  const totalHypesForMovie = useMemo(() => {
    return hypeLog.filter(h => h.movieId === movieId).length;
  }, [hypeLog, movieId]);

  if (!movieData || !movieData.moviePost) {
    return (
      <div className="fixed inset-0 bg-slate-900 z-40 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Movie Not Found</h1>
          <p className="text-slate-400 mt-2">The requested movie could not be found.</p>
          <button onClick={onClose} className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full">
            Back to Feed
          </button>
        </div>
      </div>
    );
  }

  const { moviePost, heroImageUrl, trailerUrl, galleryImageUrls, relatedMovies, episodes, fullCast, crew, relatedPosts, relatedVideos } = movieData;
  const { movieDetails } = moviePost;

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
          title={movieDetails.title}
          posterUrl={movieDetails.posterUrl}
          heroImageUrl={heroImageUrl}
          rating={movieDetails.rating}
          genres={movieDetails.genres}
          trailerUrl={trailerUrl}
          movieId={movieId}
          hypeCount={userHypeState.count}
          totalHypes={totalHypesForMovie}
          onHype={() => onHype(movieId)}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
          
          <section className="animate-fade-in-up">
            <p className="text-slate-300 leading-relaxed max-w-4xl">{movieDetails.synopsis}</p>
          </section>

          <section className="animate-fade-in-up" style={{animationDelay: '100ms'}}>
            <h2 className="text-3xl font-bold text-white mb-6 border-b-2 border-purple-500/30 pb-2">Details</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-10">
                <CastCrew title="Cast" people={fullCast} onViewCelebrityPage={onViewCelebrityPage} />
                <CastCrew title="Crew" people={crew} onViewCelebrityPage={onViewCelebrityPage} />
              </div>
              <div className="space-y-6">
                <MovieDetailsBox details={movieDetails} />
                <HypeStarBadge
                  movieId={movieId}
                  movieTitle={movieDetails.title}
                  hypeLog={hypeLog}
                  currentUserAvatar={currentUserAvatar}
                />
                <SocialShare />
              </div>
            </div>
          </section>
          
          {galleryImageUrls.length > 0 && (
            <PhotoGallery imageUrls={galleryImageUrls} />
          )}

          {movieDetails.type === 'TV Series' && episodes && episodes.length > 0 && (
            <Episodes episodes={episodes} />
          )}

          {movieDetails.type === 'Movie' && relatedVideos.length > 0 && (
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
                onRatePost={onRatePost}
                currentUserAvatar={currentUserAvatar}
                onViewFullPost={onViewFullPost}
                onViewMoviePage={onViewMoviePage}
                onViewCelebrityPage={onViewCelebrityPage}
            />
          )}

        </div>
      </div>
    </div>
  );
};

export default MoviePage;
