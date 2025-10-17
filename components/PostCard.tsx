import React, { useRef, useState, useMemo, useLayoutEffect, useEffect } from 'react';
import { Post, Reaction, FanzSay } from '../types';
import ReactionButton from './ReactionButton';
import CommentSection from './CommentSection';
import VideoPlayer from './VideoPlayer';
import { StarIcon } from './icons';
import { PostType } from '../PostType';
import CountdownTimer from './CountdownTimer';
import FilmographyCarousel from './FilmographyCarousel';

declare const confetti: any;

interface PostCardProps {
  post: Post;
  onReaction: (postId: string, reactionId: string) => void;
  onFanzSay: (postId: string, fanzSayId: string) => void;
  currentUserAvatar: string;
  onViewFullPost: (post: Post) => void;
  onViewMoviePage: (movieId: string) => void;
}

const CONTENT_TRUNCATE_LENGTH = 300;

const AnimatedCommentTeaser: React.FC<{topComments: FanzSay[], totalCount: number}> = ({ topComments, totalCount }) => (
    <div className="space-y-2 mt-3 cursor-pointer group">
        {topComments.map((comment, index) => (
            <div 
                key={comment.id} 
                className="bg-slate-700/50 rounded-lg p-2 flex items-center gap-3 animate-comment-teaser"
                style={{ animationDelay: `${index * 150}ms`}}
            >
                <div className="flex -space-x-2 flex-shrink-0">
                    {comment.fans.slice(0, 2).map((fan, i) => (
                        <img key={i} src={fan} alt="fan" className="w-6 h-6 rounded-full ring-2 ring-slate-800" />
                    ))}
                </div>
                <p className="text-sm text-slate-400 truncate italic">
                    <span className="font-bold text-purple-300 not-italic">{comment.fans.length} fans</span> say: "{comment.text}"
                </p>
            </div>
        ))}
        <p className="text-sm text-purple-300 font-semibold text-center pt-2 group-hover:underline">
            View all {totalCount.toLocaleString()} Fanz Says...
        </p>
    </div>
);

const PostCard: React.FC<PostCardProps> = ({ post, onReaction, onFanzSay, currentUserAvatar, onViewFullPost, onViewMoviePage }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [animatingReaction, setAnimatingReaction] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [animatingFanzSayId, setAnimatingFanzSayId] = useState<string | null>(null);
  const [isCommentSectionVisible, setIsCommentSectionVisible] = useState(false);
  const confettiClickCounter = useRef(0);
  const confettiInstance = useRef<any>(null);

  useEffect(() => {
    if (canvasRef.current && !confettiInstance.current) {
      confettiInstance.current = confetti.create(canvasRef.current, { 
          resize: true,
          useWorker: true,
          disableForReducedMotion: true,
      });
    }
  }, []);

  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

  const makeItRain = () => {
    if (!confettiInstance.current) return;
    
    const duration = 4 * 1000;
    const end = Date.now() + duration;
    const colors = ['#a855f7', '#ffffff', '#fde047'];

    (function frame() {
      confettiInstance.current({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
        scalar: 0.9,
      });
      confettiInstance.current({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
        scalar: 0.9,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const triggerRandomConfetti = () => {
    if (confettiInstance.current) {
      confettiInstance.current({
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        particleCount: randomInRange(50, 100),
        origin: { y: 0.6 },
        scalar: 0.9, // Make particles smaller
      });
    }
  };
  
  useLayoutEffect(() => {
    const checkOverflow = () => {
        const element = contentRef.current;
        if (element) {
            const hasOverflow = element.scrollHeight > element.clientHeight;
            if (hasOverflow !== isOverflowing) {
               setIsOverflowing(hasOverflow);
            }
        }
    };
    // Debounced check for resize and a slight delay for initial render
    let timeoutId: number;
    const debouncedCheck = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(checkOverflow, 50);
    }
    
    debouncedCheck(); // Initial check
    window.addEventListener('resize', debouncedCheck);

    return () => {
        clearTimeout(timeoutId);
        window.removeEventListener('resize', debouncedCheck);
    };
  }, [post.id, isExpanded, isOverflowing]); // Rerun on key changes

  const { totalFanzSaysCount, topComments } = useMemo(() => {
    const count = post.fanzSays?.reduce((acc, fs) => acc + fs.fans.length, 0) || 0;
    const top = post.fanzSays?.filter(fs => fs.fans.length > 0).sort((a, b) => b.fans.length - a.fans.length).slice(0, 2) || [];
    return { totalFanzSaysCount: count, topComments: top };
  }, [post.fanzSays]);

  const handleReactionClick = (event: React.MouseEvent, reactionId: string) => {
    const reaction = post.reactions.find(r => r.id === reactionId);
    if (!reaction) return;

    onReaction(post.id, reactionId);

    if (reaction.emoji === '🎉') {
      confettiClickCounter.current += 1;
      if (confettiClickCounter.current > 10) {
        makeItRain();
        confettiClickCounter.current = 0; // Reset
      } else {
        triggerRandomConfetti();
      }
    }
    if (reaction.emoji === '🥳') {
      setAnimatingReaction('🥳');
      setTimeout(() => setAnimatingReaction(null), 1000); // Duration of the animation
    }
  };

  const handleFanzSayClick = (postId: string, fanzSayId: string) => {
    onFanzSay(postId, fanzSayId);
    setAnimatingFanzSayId(fanzSayId);
    setTimeout(() => {
      setAnimatingFanzSayId(null);
    }, 600); // Animation duration should match CSS
  };
  
  const isLongContent = post.content.length > CONTENT_TRUNCATE_LENGTH;

  const renderPostContent = () => {
    switch (post.type) {
      case PostType.Trailer:
        return (
          <VideoPlayer 
            videoUrl={post.videoUrl!}
            duration={post.videoDuration!}
          />
        );
      case PostType.Image:
      case PostType.Anniversary:
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
                    <p className="text-sm text-slate-300 mb-4 italic line-clamp-3">"{synopsis}"</p>
                    
                    <div className="space-y-3 text-sm">
                    <div>
                        <strong className="text-purple-300">Director:</strong>
                        <span className="text-slate-200 ml-2">{director}</span>
                    </div>
                    <div>
                        <strong className="text-purple-300">Cast:</strong>
                        <span className="text-slate-200 ml-2 line-clamp-1">{cast.join(', ')}</span>
                    </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                    {genres.map(genre => (
                        <span key={genre} className="bg-slate-600 text-xs font-semibold text-slate-200 px-2.5 py-1 rounded-full">
                        {genre}
                        </span>
                    ))}
                    </div>
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
              
              <div className="space-y-3 text-sm mb-4">
                <div>
                  <strong className="text-purple-300">First Appearance:</strong>
                  <span className="text-slate-200 ml-2">{firstAppearance}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {keyTraits.map(trait => (
                  <span key={trait} className="bg-slate-600 text-xs font-semibold text-slate-200 px-2.5 py-1 rounded-full">
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      }
       case PostType.Celebrity: {
        if (!post.celebrityDetails) return null;
        const { name, imageUrl, knownFor, bio, notableWorks, birthDate } = post.celebrityDetails;
        return (
          <div className="flex flex-col md:flex-row gap-5 bg-slate-700/50 rounded-lg overflow-hidden">
            <img src={imageUrl} alt={`${name} portrait`} className="w-full md:w-1/3 object-cover object-top" />
            <div className="p-5 flex-1">
              <h4 className="text-2xl font-bold text-white">{name}</h4>
              <p className="text-teal-300 font-semibold mb-3">{knownFor}</p>
              <p className="text-sm text-slate-300 mb-4 italic">"{bio}"</p>
              
              <div className="space-y-3 text-sm mb-4">
                <div>
                  <strong className="text-purple-300">Born:</strong>
                  <span className="text-slate-200 ml-2">{new Date(birthDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <strong className="text-purple-300 w-full text-sm">Notable Works:</strong>
                {notableWorks.map(work => (
                  <span key={work} className="bg-slate-600 text-xs font-semibold text-slate-200 px-2.5 py-1 rounded-full">
                    {work}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      }
      case PostType.Countdown: {
        if (!post.countdownDetails) return null;
        // The button is now rendered outside this function, in a static footer.
        // This component only needs to render the scrollable image part.
        return (
          <div className="rounded-lg overflow-hidden">
            <img src={post.countdownDetails.imageUrl} alt="Countdown poster" className="w-full h-auto object-cover" />
          </div>
        );
      }
      case PostType.Filmography:
        if (!post.filmographyDetails) return null;
        return <FilmographyCarousel movies={post.filmographyDetails} onViewMoviePage={onViewMoviePage} />;
      
      case PostType.Awards: {
        if (!post.awardDetails) return null;
        const { awardName, awardFor, event, year, imageUrl } = post.awardDetails;
        return (
          <div className="bg-gradient-to-br from-amber-400/20 via-slate-700/10 to-amber-400/20 p-5 rounded-lg border border-amber-400/30">
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
        const { posterUrl, title, status, expectedRelease, crew, logline } = post.projectAnnouncementDetails;
        return (
          <div className="flex flex-col md:flex-row gap-5 bg-slate-700/50 rounded-lg overflow-hidden border-2 border-yellow-400/30">
            <div className="relative w-full md:w-1/3">
              <img src={posterUrl} alt={`${title} poster`} className="w-full object-cover" />
              <div className="absolute top-2 left-2 bg-yellow-400 text-slate-900 font-bold px-2 py-1 rounded-md text-xs uppercase tracking-wider">
                {status}
              </div>
            </div>
            <div className="p-5 flex-1">
              <p className="text-yellow-300 font-semibold mb-1">{expectedRelease}</p>
              <h4 className="text-2xl font-bold text-white">{title}</h4>
              <p className="text-sm text-slate-300 mt-2 mb-4 italic">"{logline}"</p>
              
              <div className="space-y-3 text-sm border-t border-slate-600 pt-3">
                <div>
                  <strong className="text-purple-300">Crew:</strong>
                  <span className="text-slate-200 ml-2">{crew}</span>
                </div>
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
      default:
        return null;
    }
  };

  const renderEventHeader = () => {
    if (!post.eventDetails) return null;
    let icon;
    let titleColor = 'text-purple-300';
    let rightContent = null;

    if (post.type === PostType.Countdown && post.countdownDetails) {
        rightContent = <CountdownTimer targetDate={post.countdownDetails.targetDate} />;
    }

    switch (post.type) {
        case PostType.Birthday:
            icon = <span className="material-symbols-outlined text-2xl text-pink-400">cake</span>;
            titleColor = 'text-pink-300';
            break;
        case PostType.Anniversary:
            icon = <span className="material-symbols-outlined text-2xl text-amber-400">movie</span>;
            titleColor = 'text-amber-300';
            break;
        case PostType.Announcement:
            icon = <span className="material-symbols-outlined text-2xl text-cyan-400">campaign</span>;
            titleColor = 'text-cyan-300';
            break;
        case PostType.ProjectAnnouncement:
            icon = <span className="material-symbols-outlined text-2xl text-yellow-400">lightbulb</span>;
            titleColor = 'text-yellow-300';
            break;
        case PostType.MovieDetails:
            icon = <span className="material-symbols-outlined text-2xl text-sky-400">theaters</span>;
            titleColor = 'text-sky-300';
            break;
        case PostType.CharacterIntroduction:
            icon = <span className="material-symbols-outlined text-2xl text-green-400">badge</span>;
            titleColor = 'text-green-300';
            break;
        case PostType.Celebrity:
            icon = <span className="material-symbols-outlined text-2xl text-teal-400">person</span>;
            titleColor = 'text-teal-300';
            break;
        case PostType.Awards:
            icon = <span className="material-symbols-outlined text-2xl text-amber-400">emoji_events</span>;
            titleColor = 'text-amber-300';
            break;
        case PostType.Countdown:
            icon = <span className="material-symbols-outlined text-2xl text-indigo-400">schedule</span>;
            titleColor = 'text-indigo-300';
            break;
        case PostType.Filmography:
            icon = <span className="material-symbols-outlined text-2xl text-rose-400">video_library</span>;
            titleColor = 'text-rose-300';
            break;
        case PostType.BoxOffice:
            icon = <span className="material-symbols-outlined text-2xl text-green-400">monetization_on</span>;
            titleColor = 'text-green-300';
            break;
        case PostType.Trivia:
            icon = <span className="material-symbols-outlined text-2xl text-yellow-400">lightbulb</span>;
            titleColor = 'text-yellow-300';
            break;
        default:
            return null;
    }

    return (
        <div className="flex items-center justify-between bg-slate-700/50 p-3 rounded-lg">
            <div className="flex items-center space-x-3">
                {icon}
                <div>
                    <h3 className={`font-bold text-lg ${titleColor}`}>{post.eventDetails.title}</h3>
                    {post.eventDetails.subtitle && (
                        <p className="text-sm text-slate-400">{post.eventDetails.subtitle}</p>
                    )}
                </div>
            </div>
            {rightContent}
        </div>
    );
  };
  
  const hasEventHeader = [
    PostType.Anniversary, PostType.Birthday, PostType.MovieDetails, 
    PostType.CharacterIntroduction, PostType.Awards, PostType.Countdown, 
    PostType.Filmography, PostType.ProjectAnnouncement, PostType.Celebrity,
    PostType.BoxOffice, PostType.Trivia,
  ].includes(post.type);

  return (
    <>
      <div id={`post-card-${post.id}`} className="relative bg-slate-800 rounded-xl shadow-2xl overflow-hidden w-full border border-slate-700 max-h-[780px] flex flex-col">
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none z-20" aria-hidden="true"></canvas>
        
        {/* Static Header */}
        <div className="p-5 flex-shrink-0">
          {hasEventHeader && renderEventHeader()}
          <div className="flex items-center mt-4">
            <img className="h-12 w-12 rounded-full border-2 border-slate-600" src={post.avatar} alt={post.author} />
            <div className="ml-4">
              <div className="text-lg font-semibold text-white">{post.author}</div>
              <div className="text-sm text-slate-400">{post.timestamp}</div>
            </div>
          </div>
        </div>
        
        {/* Clipped Body */}
        <div ref={contentRef} className="flex-1 overflow-hidden px-5 pb-5 relative">
          <p className="text-slate-300 mb-4 whitespace-pre-wrap">
            {isLongContent && !isExpanded
              ? `${post.content.substring(0, CONTENT_TRUNCATE_LENGTH)}...`
              : post.content}
            {isLongContent && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline bg-transparent border-none p-0 text-purple-400 hover:text-purple-300 font-semibold text-sm ml-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
                aria-expanded={isExpanded}
              >
                {isExpanded ? 'Read Less' : 'Read More'}
              </button>
            )}
          </p>
          {renderPostContent()}

          {isOverflowing && (
             <div 
              className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-800 to-transparent flex items-end justify-center pb-4 pointer-events-none"
              aria-hidden="true"
            >
              <button 
                onClick={() => onViewFullPost(post)}
                className="pointer-events-auto bg-slate-900/80 backdrop-blur-sm text-white font-semibold py-2 px-4 rounded-full flex items-center gap-2 transition-transform hover:scale-105 shadow-lg"
              >
                <span className="material-symbols-outlined text-base">fullscreen</span>
                View Full Post
              </button>
            </div>
          )}
        </div>

        {/* Static Countdown Footer (special case) */}
        {post.type === PostType.Countdown && post.countdownDetails && (
          <div className="px-5 pb-5 flex-shrink-0">
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

        {/* Static Main Footer */}
        <div className="p-5 flex-shrink-0 border-t border-slate-700 bg-slate-800">
          {post.reactionsEnabled !== false && post.reactions && post.reactions.length > 0 && (
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-700">
                {post.reactions.map(reaction => (
                  <ReactionButton
                    key={reaction.id}
                    reaction={reaction}
                    onClick={(e) => handleReactionClick(e, reaction.id)}
                    isAnimating={animatingReaction === reaction.emoji}
                  />
                ))}
            </div>
          )}

          {post.fanzSaysEnabled !== false && (
            isCommentSectionVisible ? (
              <>
                <div className="flex items-center justify-between mt-4">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Fanz Says ({totalFanzSaysCount.toLocaleString()})</h4>
                    <button 
                        onClick={() => setIsCommentSectionVisible(false)}
                        className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
                        aria-label="Hide comments"
                    >
                        <span className="material-symbols-outlined text-base">unfold_less</span>
                        Hide
                    </button>
                </div>
                <CommentSection
                    fanzSays={post.fanzSays}
                    onFanzSay={(fanzSayId) => handleFanzSayClick(post.id, fanzSayId)}
                    currentUserAvatar={currentUserAvatar}
                    animatingFanzSayId={animatingFanzSayId}
                />
              </>
            ) : (
              <div onClick={() => setIsCommentSectionVisible(true)} aria-hidden="true">
                {topComments.length > 0 ? (
                    <AnimatedCommentTeaser topComments={topComments} totalCount={totalFanzSaysCount} />
                ) : (
                    <div className="mt-4">
                        <button
                            className="w-full text-left bg-slate-700/50 hover:bg-slate-700 p-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                            aria-label="Show comments"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-400">
                                    Be the first to say something!
                                </span>
                                <span className="text-sm font-semibold text-purple-300 flex items-center gap-1">
                                    Comments
                                    <span className="material-symbols-outlined text-base">chat_bubble</span>
                                </span>
                            </div>
                        </button>
                    </div>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default React.memo(PostCard);
