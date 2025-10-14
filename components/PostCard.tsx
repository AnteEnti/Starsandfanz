import React, { useRef, useState } from 'react';
import { Post, ReactionType } from '../types';
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
  onReaction: (postId: string, reactionType: ReactionType) => void;
  onFanzSay: (postId: string, fanzSayId: string) => void;
  currentUserAvatar: string;
}

const CONTENT_TRUNCATE_LENGTH = 300;

const PostCard: React.FC<PostCardProps> = ({ post, onReaction, onFanzSay, currentUserAvatar }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animatingReaction, setAnimatingReaction] = useState<ReactionType | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

  const triggerConfetti = () => {
    if (canvasRef.current) {
      const myConfetti = confetti.create(canvasRef.current, { resize: true, useWorker: true });
      myConfetti({
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        particleCount: randomInRange(50, 100),
        origin: { y: 0.6 },
      });
    }
  };

  const handleReactionClick = (postId: string, reactionType: ReactionType) => {
    onReaction(postId, reactionType);
    if (reactionType === ReactionType.Celebrate) {
      triggerConfetti();
    }
    if (reactionType === ReactionType.Whistle) {
      setAnimatingReaction(ReactionType.Whistle);
      setTimeout(() => setAnimatingReaction(null), 1000); // Duration of the animation
    }
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
        return post.imageUrl ? <img className="w-full h-auto object-cover" src={post.imageUrl} alt="Post content" /> : null;
      // FIX: Add block scope to prevent variable redeclaration errors.
      case PostType.MovieDetails: {
        if (!post.movieDetails) return null;
        const { posterUrl, title, rating, synopsis, director, cast, genres } = post.movieDetails;
        return (
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
                <div>
                    <strong className="text-purple-300">Director:</strong>
                    <span className="text-slate-200 ml-2">{director}</span>
                </div>
                <div>
                    <strong className="text-purple-300">Cast:</strong>
                    <span className="text-slate-200 ml-2">{cast.join(', ')}</span>
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
        );
      }
      // FIX: Add block scope to prevent variable redeclaration errors. The 'imageUrl' variable was conflicting with another case.
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
      case PostType.Countdown: {
        if (!post.countdownDetails) return null;
        const { targetDate, imageUrl, bookingUrl } = post.countdownDetails;
        const isCountdownFinished = new Date() > new Date(targetDate);
        const buttonText = isCountdownFinished ? "Now Showing!" : "Book Tickets Now";

        return (
          <div>
            <img src={imageUrl} alt="Countdown poster" className="w-full h-auto object-cover" />
            <div className="p-4 bg-slate-700/80">
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-full text-center font-bold py-3 px-6 rounded-full transition duration-300 text-lg ${isCountdownFinished ? 'bg-amber-500 hover:bg-amber-600' : 'bg-purple-600 hover:bg-purple-700'} text-white`}
              >
                {buttonText}
              </a>
            </div>
          </div>
        );
      }
      case PostType.Filmography:
        if (!post.filmographyDetails) return null;
        return <FilmographyCarousel movies={post.filmographyDetails} />;
      // FIX: Add block scope to prevent variable redeclaration errors. The 'imageUrl' variable was conflicting with another case.
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
              <img src={posterUrl} alt={`${title} poster`} className="w-full h-full object-cover" />
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
        default:
            return null;
    }

    return (
        <div className="px-5 pt-5">
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
        </div>
    );
  };
  
  const hasEventHeader = [
    PostType.Anniversary, PostType.Birthday, PostType.MovieDetails, 
    PostType.CharacterIntroduction, PostType.Awards, PostType.Countdown, 
    PostType.Filmography, PostType.ProjectAnnouncement
  ].includes(post.type);

  const hasPadding = ![
    PostType.Trailer, PostType.MovieDetails, PostType.CharacterIntroduction,
    PostType.Countdown, PostType.Filmography, PostType.Awards, PostType.ProjectAnnouncement
  ].includes(post.type);


  return (
    <div className="relative rounded-xl shadow-2xl transform hover:scale-[1.01] transition-transform duration-300 bg-gradient-to-r from-purple-500 via-rose-500 to-amber-400 animate-gradient-border p-[2px]">
      <div className="relative bg-slate-800 rounded-[10px] overflow-hidden w-full">
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none z-20" aria-hidden="true"></canvas>
        
        {hasEventHeader ? renderEventHeader() : null}
        
        <div className={hasPadding ? "p-5" : ""}>
          <div className={hasPadding ? "" : "p-5"}>
              <div className="flex items-center mb-4">
                  <img className="h-12 w-12 rounded-full border-2 border-slate-600" src={post.avatar} alt={post.author} />
                  <div className="ml-4">
                      <div className="text-lg font-semibold text-white">{post.author}</div>
                      <div className="text-sm text-slate-400">{post.timestamp}</div>
                  </div>
              </div>
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
          </div>

          {renderPostContent()}
        </div>
        
        <div className="p-5">
          <div className="flex items-center justify-between pb-3 border-b-2 border-slate-700">
              {Object.values(ReactionType).map(reaction => (
                <ReactionButton
                  key={reaction}
                  type={reaction}
                  count={post.reactions[reaction] || 0}
                  onClick={() => handleReactionClick(post.id, reaction)}
                  isAnimating={animatingReaction === reaction}
                />
              ))}
          </div>

          <CommentSection
            fanzSays={post.fanzSays}
            onFanzSay={(fanzSayId) => onFanzSay(post.id, fanzSayId)}
            currentUserAvatar={currentUserAvatar}
          />
        </div>
      </div>
    </div>
  );
};

export default PostCard;