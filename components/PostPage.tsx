import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Post, Reaction, FanzSay } from '../types';
import ReactionButton from './ReactionButton';
import CommentSection from './CommentSection';
import VideoPlayer from './VideoPlayer';
import { StarIcon } from './icons';
import { PostType } from '../PostType';
import CountdownTimer from './CountdownTimer';
import FilmographyCarousel from './FilmographyCarousel';

declare const confetti: any;

interface PostPageProps {
  postId: string;
  posts: Post[];
  onClose: () => void;
  onReaction: (postId: string, reactionId: string) => void;
  onFanzSay: (postId: string, fanzSayId: string) => void;
  currentUserAvatar: string;
  onViewMoviePage: (movieId: string) => void;
  onViewCelebrityPage: (celebrityId: string) => void;
}

const PostPage: React.FC<PostPageProps> = ({ postId, posts, onClose, onReaction, onFanzSay, currentUserAvatar, onViewMoviePage, onViewCelebrityPage }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const confettiInstance = useRef<any>(null);
  const [animatingReaction, setAnimatingReaction] = useState<string | null>(null);
  const [animatingFanzSayId, setAnimatingFanzSayId] = useState<string | null>(null);

  const post = useMemo(() => posts.find(p => p.id === postId), [postId, posts]);

  useEffect(() => {
    // Create confetti instance on mount
    if (canvasRef.current && !confettiInstance.current) {
      confettiInstance.current = confetti.create(canvasRef.current, {
        resize: true,
        useWorker: true,
        disableForReducedMotion: true,
      });
    }

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    // Cleanup function for unmount
    return () => {
        document.body.style.overflow = 'unset';
        if (confettiInstance.current) {
            confettiInstance.current.reset();
            confettiInstance.current = null;
        }
    };
  }, []); // Empty dependency array to run only on mount/unmount

  const { totalFanzSaysCount } = useMemo(() => {
    if (!post) return { totalFanzSaysCount: 0 };
    const count = post.fanzSays?.reduce((acc, fs) => acc + fs.fans.length, 0) || 0;
    return { totalFanzSaysCount: count };
  }, [post]);

  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;
  
  const triggerConfetti = () => {
    if (confettiInstance.current) {
      confettiInstance.current({
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        particleCount: randomInRange(50, 100),
        origin: { y: 0.6 },
      });
    }
  };

  const handleReactionClick = (e: React.MouseEvent, reactionId: string) => {
    if (!post) return;
    const reaction = post.reactions.find(r => r.id === reactionId);
    if (!reaction) return;
    
    onReaction(post.id, reactionId);
    
    if (reaction.emoji === '🎉') triggerConfetti();
    if (reaction.emoji === '🥳') {
      setAnimatingReaction('🥳');
      setTimeout(() => setAnimatingReaction(null), 1000);
    }
  };

  const handleFanzSayClick = (postId: string, fanzSayId: string) => {
    onFanzSay(postId, fanzSayId);
    setAnimatingFanzSayId(fanzSayId);
    setTimeout(() => setAnimatingFanzSayId(null), 600);
  };
  
  const renderPostContent = () => {
    if (!post) return null;
    if (post.imageUrl && ![PostType.Trailer, PostType.MovieDetails, PostType.CharacterIntroduction, PostType.ProjectAnnouncement, PostType.Celebrity, PostType.Image, PostType.Anniversary].includes(post.type)) {
      return <img className="w-full h-auto object-cover rounded-lg" src={post.imageUrl} alt="Post content" />;
    }

    switch (post.type) {
        case PostType.Trailer: return <VideoPlayer videoUrl={post.videoUrl!} duration={post.videoDuration!} />;
        case PostType.Image:
        case PostType.Anniversary:
        case PostType.Birthday:
            return post.imageUrl ? <img className="w-full h-auto object-cover rounded-lg" src={post.imageUrl} alt="Post content" /> : null;
        case PostType.MovieDetails: {
            if (!post.movieDetails) return null;
            const { posterUrl, title, rating, synopsis, director, cast, genres } = post.movieDetails;
            return (
              <button onClick={() => onViewMoviePage(post.movieDetails!.id)} className="w-full text-left transition-transform duration-300 hover:scale-[1.02]">
                <div className="flex flex-col md:flex-row gap-5 bg-slate-700/50 rounded-lg overflow-hidden">
                    <img src={posterUrl} alt={`${title} poster`} className="w-full md:w-1/3 object-cover" />
                    <div className="p-5 flex-1">
                        <div className="flex justify-between items-start mb-2">
                        <h4 className="text-2xl font-bold text-white">{title}</h4>
                        <div className="flex items-center space-x-1 bg-amber-500 text-white font-bold px-2 py-1 rounded-md text-sm">
                            <StarIcon className="h-4 w-4" />
                            <span>{rating.toFixed(1)}</span>
                        </div>
                        </div>
                        <p className="text-sm text-slate-300 mb-4 italic">"{synopsis}"</p>
                        <div className="space-y-3 text-sm">
                        <div><strong className="text-purple-300">Director:</strong><span className="text-slate-200 ml-2">{director}</span></div>
                        <div><strong className="text-purple-300">Cast:</strong><span className="text-slate-200 ml-2">{cast.join(', ')}</span></div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">{genres.map(genre => (<span key={genre} className="bg-slate-600 text-xs font-semibold text-slate-200 px-2.5 py-1 rounded-full">{genre}</span>))}</div>
                    </div>
                </div>
              </button>
            );
        }
        case PostType.CharacterIntroduction: {
            if (!post.characterDetails) return null;
            const { name, imageUrl, role, bio, keyTraits, firstAppearance } = post.characterDetails;
            return (
            <div className="flex flex-col md:flex-row gap-5 bg-slate-700/50 rounded-lg overflow-hidden">
                <img src={imageUrl} alt={`${name} portrait`} className="w-full md:w-1/3 object-cover object-top" />
                <div className="p-5 flex-1">
                <h4 className="text-2xl font-bold text-white">{name}</h4>
                <p className="text-purple-300 font-semibold mb-3">{role}</p>
                <p className="text-sm text-slate-300 mb-4 italic">"{bio}"</p>
                <div className="space-y-3 text-sm mb-4"><div><strong className="text-purple-300">First Appearance:</strong><span className="text-slate-200 ml-2">{firstAppearance}</span></div></div>
                <div className="flex flex-wrap gap-2">{keyTraits.map(trait => (<span key={trait} className="bg-slate-600 text-xs font-semibold text-slate-200 px-2.5 py-1 rounded-full">{trait}</span>))}</div>
                </div>
            </div>
            );
        }
        case PostType.Celebrity: {
            if (!post.celebrityDetails) return null;
            const { name, imageUrl, knownFor, bio, notableWorks, birthDate } = post.celebrityDetails;
            return (
            <button onClick={() => post.celebrityDetails && onViewCelebrityPage(post.celebrityDetails.id)} className="w-full text-left transition-transform duration-300 hover:scale-[1.02]">
                <div className="flex flex-col md:flex-row gap-5 bg-slate-700/50 rounded-lg overflow-hidden">
                    <img src={imageUrl} alt={`${name} portrait`} className="w-full md:w-1/3 object-cover object-top" />
                    <div className="p-5 flex-1">
                    <h4 className="text-2xl font-bold text-white">{name}</h4>
                    <p className="text-teal-300 font-semibold mb-3">{knownFor}</p>
                    <p className="text-sm text-slate-300 mb-4 italic line-clamp-4">"{bio}"</p>
                    <div className="space-y-3 text-sm mb-4"><div><strong className="text-purple-300">Born:</strong><span className="text-slate-200 ml-2">{new Date(birthDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</span></div></div>
                    <div className="flex flex-wrap gap-2">
                        <strong className="text-purple-300 w-full text-sm">Notable Works:</strong>
                        {notableWorks.map(work => (<span key={work} className="bg-slate-600 text-xs font-semibold text-slate-200 px-2.5 py-1 rounded-full">{work}</span>))}
                    </div>
                    </div>
                </div>
            </button>
            );
        }
        case PostType.Countdown: return post.countdownDetails ? <div className="rounded-lg overflow-hidden"><img src={post.countdownDetails.imageUrl} alt="Countdown poster" className="w-full h-auto object-cover" /></div> : null;
        case PostType.Filmography: return post.filmographyDetails ? <FilmographyCarousel movies={post.filmographyDetails} onViewMoviePage={onViewMoviePage} /> : null;
        case PostType.Awards: {
            if (!post.awardDetails) return null;
            const { awardName, awardFor, event, year, imageUrl } = post.awardDetails;
            return (
            <div className="bg-gradient-to-br from-amber-400/20 via-slate-700/10 to-amber-400/20 p-5 rounded-lg border border-amber-400/30">
                {post.imageUrl && <img src={post.imageUrl} alt="Award background" className="w-full h-auto object-cover rounded-lg mb-4" />}
                <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-5">
                {imageUrl && <img src={imageUrl} alt={event} className="w-24 h-24 rounded-full border-4 border-amber-400" />}
                <div className="flex-1">
                    <p className="text-amber-300 font-semibold">{event} {year}</p>
                    <h4 className="text-2xl font-bold text-white my-1">{awardName}</h4>
                    <p className="text-lg text-slate-300">for <span className="font-semibold">{awardFor}</span></p>
                </div>
                </div>
            </div>
            );
        }
        case PostType.ProjectAnnouncement: {
            if (!post.projectAnnouncementDetails) return null;
            const { posterUrl, title, status, expectedRelease, logline, crew, cast, relationship } = post.projectAnnouncementDetails;
            const director = crew.find(p => p.role.toLowerCase() === 'director');
            const castNames = cast.slice(0, 3).map(p => p.name).join(', ');
            return (
              <div className="flex flex-col md:flex-row gap-5 bg-slate-700/50 rounded-lg overflow-hidden border-2 border-yellow-400/30">
                <div className="relative w-full md:w-1/3">
                  <img src={posterUrl} alt={`${title} poster`} className="w-full object-cover" />
                  <div className="absolute top-2 left-2 bg-yellow-400 text-slate-900 font-bold px-2 py-1 rounded-md text-xs uppercase tracking-wider">{status}</div>
                </div>
                <div className="p-5 flex-1">
                  {relationship && (
                     <button 
                        onClick={() => onViewMoviePage(relationship.relatedMovieId)}
                        className="text-xs font-bold text-cyan-300 bg-cyan-500/20 px-2 py-1 rounded-full mb-2 hover:bg-cyan-500/40"
                     >
                        {relationship.type}
                    </button>
                  )}
                  <p className="text-yellow-300 font-semibold mb-1">{expectedRelease}</p>
                  <h4 className="text-2xl font-bold text-white">{title}</h4>
                  <p className="text-sm text-slate-300 mt-2 mb-4 italic">"{logline}"</p>
                  <div className="space-y-3 text-sm border-t border-slate-600 pt-3">
                    {director && (<div><strong className="text-purple-300">Director:</strong><span className="text-slate-200 ml-2">{director.name}</span></div>)}
                    {cast.length > 0 && (<div><strong className="text-purple-300">Starring:</strong><span className="text-slate-200 ml-2">{castNames}{cast.length > 3 ? '...' : ''}</span></div>)}
                  </div>
                </div>
              </div>
            );
        }
        case PostType.BoxOffice: {
            if (!post.boxOfficeDetails) return null;
            const { grossRevenue, ranking, region, sourceUrl } = post.boxOfficeDetails;
            return (
            <div className="bg-green-500/10 p-5 rounded-lg border border-green-500/30 text-center">
                <p className="text-green-300 font-semibold">{region}</p>
                <p className="text-5xl font-black text-white my-2">${grossRevenue.toLocaleString()}</p>
                <div className="flex justify-center items-center gap-4">
                <span className="text-lg font-bold text-white">#{ranking}</span>
                {sourceUrl && <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-400 hover:text-white underline">Source</a>}
                </div>
            </div>
            );
        }
        case PostType.Trivia: {
            if (!post.triviaDetails) return null;
            const { triviaItems } = post.triviaDetails;
            return (
            <div className="bg-yellow-400/10 p-5 rounded-lg border border-yellow-400/30">
                {post.imageUrl && <img src={post.imageUrl} alt="Trivia background" className="w-full h-auto object-cover rounded-lg mb-4" />}
                <ul className="space-y-3 list-disc list-inside">
                {triviaItems.map((item, index) => (
                    <li key={index} className="text-slate-300 italic">
                    {item}
                    </li>
                ))}
                </ul>
            </div>
            );
        }
        case PostType.Announcement:
             return post.imageUrl ? <img className="w-full h-auto object-cover rounded-lg" src={post.imageUrl} alt="Post content" /> : null;
        default: return null;
    }
  };

  const renderEventHeader = () => {
    if (!post || !post.eventDetails) return null;
    let icon, rightContent = null;
    let titleColor = 'text-purple-300';
    if (post.type === PostType.Countdown && post.countdownDetails) rightContent = <CountdownTimer targetDate={post.countdownDetails.targetDate} />;
    switch (post.type) {
        case PostType.Birthday: icon = <span className="material-symbols-outlined text-2xl text-pink-400">cake</span>; titleColor = 'text-pink-300'; break;
        case PostType.Anniversary: icon = <span className="material-symbols-outlined text-2xl text-amber-400">movie</span>; titleColor = 'text-amber-300'; break;
        case PostType.Announcement: icon = <span className="material-symbols-outlined text-2xl text-cyan-400">campaign</span>; titleColor = 'text-cyan-300'; break;
        case PostType.ProjectAnnouncement: icon = <span className="material-symbols-outlined text-2xl text-yellow-400">lightbulb</span>; titleColor = 'text-yellow-300'; break;
        case PostType.MovieDetails: icon = <span className="material-symbols-outlined text-2xl text-sky-400">theaters</span>; titleColor = 'text-sky-300'; break;
        case PostType.CharacterIntroduction: icon = <span className="material-symbols-outlined text-2xl text-green-400">badge</span>; titleColor = 'text-green-300'; break;
        case PostType.Celebrity: icon = <span className="material-symbols-outlined text-2xl text-teal-400">person</span>; titleColor = 'text-teal-300'; break;
        case PostType.Awards: icon = <span className="material-symbols-outlined text-2xl text-amber-400">emoji_events</span>; titleColor = 'text-amber-300'; break;
        case PostType.Countdown: icon = <span className="material-symbols-outlined text-2xl text-indigo-400">schedule</span>; titleColor = 'text-indigo-300'; break;
        case PostType.Filmography: icon = <span className="material-symbols-outlined text-2xl text-rose-400">video_library</span>; titleColor = 'text-rose-300'; break;
        case PostType.BoxOffice: icon = <span className="material-symbols-outlined text-2xl text-green-400">monetization_on</span>; titleColor = 'text-green-300'; break;
        case PostType.Trivia: icon = <span className="material-symbols-outlined text-2xl text-yellow-400">lightbulb</span>; titleColor = 'text-yellow-300'; break;
        default: return null;
    }
    return (
        <div className="flex items-center justify-between bg-slate-700/50 p-3 rounded-lg">
            <div className="flex items-center space-x-3">{icon}<div><h3 className={`font-bold text-lg ${titleColor}`}>{post.eventDetails.title}</h3>{post.eventDetails.subtitle && (<p className="text-sm text-slate-400">{post.eventDetails.subtitle}</p>)}</div></div>
            {rightContent}
        </div>
    );
  };

  if (!post) {
    return (
      <div className="fixed inset-0 bg-slate-900 z-40 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Post Not Found</h1>
          <button onClick={onClose} className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full">
            Back to Feed
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900 z-40 animate-page-enter">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none z-20" aria-hidden="true"></canvas>
      
      <div className="absolute top-4 left-4 z-50">
          <button onClick={onClose} className="flex items-center gap-2 text-white font-semibold text-sm p-2 rounded-lg bg-black/40 hover:bg-black/60 transition-colors backdrop-blur-sm">
              <span className="material-symbols-outlined">arrow_back</span>
              Back to Feed
          </button>
      </div>

      <div className="h-full w-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
        <div className="max-w-2xl mx-auto py-8">
            <div className="bg-slate-800 rounded-xl shadow-2xl overflow-hidden">
                <div className="p-5">
                    {renderEventHeader()}
                    <div className="flex items-center mt-4">
                        <img className="h-12 w-12 rounded-full border-2 border-slate-600" src={post.avatar} alt={post.author} />
                        <div className="ml-4">
                            <div className="text-lg font-semibold text-white">{post.author}</div>
                            <div className="text-sm text-slate-400">{post.timestamp}</div>
                        </div>
                    </div>
                </div>

                <div className="px-5 pb-5">
                    <p className="text-slate-300 mb-4 whitespace-pre-wrap">{post.content}</p>
                    {renderPostContent()}
                </div>

                {post.type === PostType.Countdown && post.countdownDetails && (
                  <div className="px-5 pb-5">
                    <a
                      href={post.countdownDetails.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block w-full text-center font-bold py-3 px-6 rounded-full transition duration-300 text-lg ${
                        new Date() > new Date(post.countdownDetails.targetDate) ? 'bg-amber-500 hover:bg-amber-600' : 'bg-purple-600 hover:bg-purple-700'
                      } text-white`}
                    >
                      {new Date() > new Date(post.countdownDetails.targetDate) ? "Now Showing!" : "Book Tickets Now"}
                    </a>
                  </div>
                )}
                
                <div className="p-5 border-t border-slate-700 bg-slate-800">
                    {post.reactionsEnabled !== false && post.reactions && post.reactions.length > 0 && (
                         <div className="pb-3 border-b-2 border-slate-700">
                            <div className="flex items-center justify-start gap-1 sm:gap-2 flex-wrap">
                                {post.reactions.map(reaction => (
                                    <ReactionButton
                                        key={reaction.id}
                                        reaction={reaction}
                                        onClick={(e) => handleReactionClick(e, reaction.id)}
                                        isAnimating={animatingReaction === reaction.emoji}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {post.fanzSaysEnabled !== false && (
                      <div className="mt-4">
                          <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Fanz Says ({totalFanzSaysCount.toLocaleString()})</h4>
                          <CommentSection
                              fanzSays={post.fanzSays}
                              onFanzSay={(fanzSayId) => handleFanzSayClick(post.id, fanzSayId)}
                              currentUserAvatar={currentUserAvatar}
                              animatingFanzSayId={animatingFanzSayId}
                          />
                      </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PostPage;