import React from 'react';
import { Post, MovieDetails } from '../../types';

interface CharacterIntroductionsProps {
  posts: Post[];
  movieDetails: MovieDetails;
  onViewCelebrityPage: (celebrityId: string) => void;
  onViewFullPost: (post: Post) => void;
}

const CharacterIntroductions: React.FC<CharacterIntroductionsProps> = ({ posts, movieDetails, onViewCelebrityPage, onViewFullPost }) => {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="animate-fade-in-up" style={{ animationDelay: '120ms' }}>
      <h2 className="text-3xl font-bold text-white mb-6 border-b-2 border-purple-500/30 pb-2">Character Spotlight</h2>
      <div className="space-y-8">
        {posts.map(post => {
          if (!post.characterDetails) return null;
          
          const { name, imageUrl, bio, keyTraits } = post.characterDetails;
          // Find the actor who plays this character from the movie's full cast list
          const actor = movieDetails.fullCast.find(p => p.role === name);

          return (
            <div key={post.id} className="flex flex-col md:flex-row gap-6 bg-slate-800/50 rounded-lg overflow-hidden p-4">
              <img src={imageUrl} alt={name} className="w-full md:w-48 h-64 object-cover rounded-md" />
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white">{name}</h3>
                
                {actor && (
                    <button 
                        onClick={() => actor.linkedCelebrityId && onViewCelebrityPage(actor.linkedCelebrityId)}
                        disabled={!actor.linkedCelebrityId}
                        className="text-left group disabled:cursor-default"
                    >
                        <p className="text-md font-semibold text-purple-300 group-hover:underline disabled:no-underline">
                            Played by {actor.name}
                        </p>
                    </button>
                )}

                <p className="text-sm text-slate-300 my-3 italic line-clamp-3">"{bio}"</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {keyTraits.map(trait => (
                    <span key={trait} className="bg-slate-700 text-xs font-semibold text-slate-200 px-2.5 py-1 rounded-full">
                      {trait}
                    </span>
                  ))}
                </div>
                
                <button 
                  onClick={() => onViewFullPost(post)}
                  className="text-sm font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                >
                  Read Full Bio <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CharacterIntroductions;
