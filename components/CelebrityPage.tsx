import React, { useMemo } from 'react';
import { Post, Suggestion, FilmographyItem } from '../types';
import { PostType } from '../PostType';
import RelatedBuzz from './movie_page/RelatedBuzz';
import CelebrityHero from './celebrity_page/CelebrityHero';
import CelebrityDetailsBox from './celebrity_page/CelebrityDetailsBox';
import CelebrityFilmography from './celebrity_page/CelebrityFilmography';

interface CelebrityPageProps {
  celebrityId: string;
  posts: Post[];
  suggestions: Suggestion[];
  onClose: () => void;
  onReaction: (postId: string, reactionId: string) => void;
  onFanzSay: (postId: string, fanzSayId: string) => void;
  onRatePost: (postId: string, rating: number) => void;
  currentUserAvatar: string;
  onViewMoviePage: (movieId: string) => void;
  onViewFullPost: (post: Post) => void;
  onToggleFan: (suggestionId: string) => void;
}

const CelebrityPage: React.FC<CelebrityPageProps> = ({ celebrityId, posts, suggestions, onClose, onToggleFan, ...buzzProps }) => {

  const celebrityData = useMemo(() => {
    const celebPost = posts.find(p => p.type === PostType.Celebrity && p.celebrityDetails?.id === celebrityId);
    if (!celebPost || !celebPost.celebrityDetails) return null;

    const suggestion = suggestions.find(s => s.linkedId === celebrityId);

    const filmography: FilmographyItem[] = posts
      .filter(p => p.type === PostType.Filmography && p.linkedCelebrityIds?.includes(celebrityId))
      .flatMap(p => p.filmographyDetails || []);
      
    // Also find filmography items from movie posts where this celeb is in the cast
    posts.forEach(p => {
        if(p.type === PostType.MovieDetails && p.movieDetails?.fullCast?.some(c => c.linkedCelebrityId === celebrityId)) {
            // Avoid duplicates
            if(!filmography.some(f => f.linkedMovieId === p.movieDetails!.id)) {
                 filmography.push({
                    id: `film-${p.movieDetails.id}`,
                    title: p.movieDetails.title,
                    year: new Date(p.movieDetails.releaseDate).getFullYear(),
                    posterUrl: p.movieDetails.posterUrl,
                    linkedMovieId: p.movieDetails.id
                });
            }
        }
    });


    const relatedPosts = posts.filter(p => 
        p.id !== celebPost.id && p.linkedCelebrityIds?.includes(celebrityId)
    );

    return {
      details: celebPost.celebrityDetails,
      bio: celebPost.celebrityDetails.bio,
      filmography: filmography.sort((a,b) => b.year - a.year),
      relatedPosts,
      suggestion,
      isFanned: suggestion?.isFanned || false
    };
  }, [celebrityId, posts, suggestions]);

  if (!celebrityData) {
    return (
      <div className="fixed inset-0 bg-slate-900 z-40 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Celebrity Not Found</h1>
          <p className="text-slate-400 mt-2">The requested celebrity could not be found.</p>
          <button onClick={onClose} className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full">
            Back to Feed
          </button>
        </div>
      </div>
    );
  }

  const { details, bio, filmography, relatedPosts, suggestion, isFanned } = celebrityData;
  
  const handleFanClick = () => {
    if (suggestion) {
      onToggleFan(suggestion.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900 z-40 animate-page-enter">
      <div className="absolute top-4 left-4 z-50">
        <button onClick={onClose} className="flex items-center gap-2 text-white font-semibold text-sm p-2 rounded-lg bg-black/40 hover:bg-black/60 transition-colors backdrop-blur-sm">
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Feed
        </button>
      </div>

      <div className="h-full w-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
        <CelebrityHero
          name={details.name}
          imageUrl={details.imageUrl}
          knownFor={details.knownFor}
          isFanned={isFanned}
          onFanClick={handleFanClick}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
              <div className="lg:col-span-2 space-y-10">
                 <section className="animate-fade-in-up">
                    <h2 className="text-3xl font-bold text-white mb-4 border-b-2 border-purple-500/30 pb-2">Biography</h2>
                    <p className="text-slate-300 leading-relaxed max-w-4xl">{bio}</p>
                </section>
              </div>
              <div className="space-y-6">
                <CelebrityDetailsBox details={details} />
              </div>
            </div>

            <CelebrityFilmography filmography={filmography} onViewMoviePage={buzzProps.onViewMoviePage} />

            {relatedPosts.length > 0 && (
                <RelatedBuzz posts={relatedPosts} {...buzzProps} />
            )}
        </div>
      </div>
    </div>
  );
};

export default CelebrityPage;