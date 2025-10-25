import React, { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import { Post, Reaction, FanzSay, Person, MovieDetails, CelebrityDetails } from '../types';
import ReactionButton from './ReactionButton';
import CommentSection from './CommentSection';
import VideoPlayer from './VideoPlayer';
import { StarIcon } from './icons';
import { PostType } from '../PostType';
import CountdownTimer from './CountdownTimer';
import FilmographyCarousel from './FilmographyCarousel';
import FillingHeart from './FillingHeart';

declare const confetti: any;

interface PostCardProps {
  post: Post;
  onReaction: (postId: string, reactionId: string) => void;
  onFanzSay: (postId: string, fanzSayId: string) => void;
  currentUserAvatar: string;
  onViewFullPost: (post: Post) => void;
  onViewMoviePage: (movieId: string) => void;
  onViewCelebrityPage: (celebrityId: string) => void;
  moviesMap: Map<string, MovieDetails>;
  celebritiesMap: Map<string, CelebrityDetails>;
}

const getPostCardStyle = (type: PostType) => {
  let bgClass = 'bg-slate-800';
  let accentColor = 'border-slate-700';
  switch(type) {
    case PostType.Awards:
      bgClass = 'bg-gradient-to-br from-amber-500/10 via-slate-800 to-slate-800';
      accentColor = 'border-amber-400/40';
      break;
    case PostType.Trailer:
      bgClass = 'bg-gradient-to-br from-indigo-500/10 via-slate-800 to-slate-800';
      accentColor = 'border-indigo-400/40';
      break;
    case PostType.Birthday:
    case PostType.Anniversary:
      bgClass = 'bg-gradient-to-br from-rose-500/10 via-slate-800 to-slate-800';
      accentColor = 'border-rose-400/40';
      break;
    case PostType.ProjectAnnouncement:
      bgClass = 'bg-gradient-to-br from-yellow-400/10 via-slate-800 to-slate-800';
      accentColor = 'border-yellow-300/40';
      break;
    case PostType.BoxOffice:
      bgClass = 'bg-gradient-to-br from-green-500/10 via-slate-800 to-slate-800';
      accentColor = 'border-green-400/40';
      break;
    case PostType.Trivia:
      bgClass = 'bg-gradient-to-br from-cyan-500/10 via-slate-800 to-slate-800';
      accentColor = 'border-cyan-400/40';
      break;
    case PostType.MovieDetails:
    case PostType.CharacterIntroduction:
      bgClass = 'bg-gradient-to-br from-sky-500/10 via-slate-800 to-slate-800';
      accentColor = 'border-sky-400/40';
      break;
    case PostType.Celebrity:
      bgClass = 'bg-gradient-to-br from-teal-500/10 via-slate-800 to-slate-800';
      accentColor = 'border-teal-400/40';
      break;
    case PostType.Countdown:
      bgClass = 'bg-gradient-to-br from-purple-500/10 via-slate-800 to-slate-800';
      accentColor = 'border-purple-400/40';
      break;
    case PostType.Filmography:
      bgClass = 'bg-gradient-to-br from-slate-500/10 via-slate-800 to-slate-800';
      accentColor = 'border-slate-400/40';
      break;
    default:
      bgClass = 'bg-slate-800';
      accentColor = 'border-slate-700';
      break;
  }
  return { bgClass, accentColor };
};


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

const PostCard: React.FC<PostCardProps> = ({ post, onReaction, onFanzSay, currentUserAvatar, onViewFullPost, onViewMoviePage, onViewCelebrityPage, moviesMap, celebritiesMap }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [animatingReaction, setAnimatingReaction] = useState<string | null>(null);
  const [animatingFanzSayId, setAnimatingFanzSayId] = useState<string | null>(null);
  const [isCommentSectionVisible, setIsCommentSectionVisible] = useState(false);
  const confettiClickCounter = useRef(0);
  const confettiInstance = useRef<any>(null);
  const [loveClickCount, setLoveClickCount] = useState(0);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // Reset state for new content
    setIsExpanded(false);
    setIsOverflowing(false);

    const checkOverflow = () => {
      const element = contentRef.current;
      if (element) {
        // With line-clamp applied, check if content is taller than its visible area
        if (element.scrollHeight > element.clientHeight) {
          setIsOverflowing(true);
        }
      }
    };
    // Use a timeout to ensure DOM has updated with the new content and styles
    const timer = setTimeout(checkOverflow, 100);
    return () => clearTimeout(timer);
  }, [post.content]);

  const authorInfo = useMemo(() => {
    const defaultAuthor = {
      avatar: post.avatar,
      name: post.author,
      subtitle: post.timestamp,
      isMovie: false,
    };

    let info = { ...defaultAuthor };
    let primarySubtitle = '';

    const linkedMovieId = post.linkedMovieIds?.[0];
    const linkedCelebrityId = post.linkedCelebrityIds?.[0];
    const movie = linkedMovieId ? moviesMap.get(linkedMovieId) : undefined;
    const celebrity = linkedCelebrityId ? celebritiesMap.get(linkedCelebrityId) : undefined;

    switch (post.type) {
      case PostType.MovieDetails:
        if (post.movieDetails) {
          info.avatar = post.movieDetails.posterUrl;
          info.name = post.movieDetails.title;
          primarySubtitle = post.movieDetails.genres.slice(0, 2).join(' • ');
          info.isMovie = true;
        }
        break;
      
      case PostType.ProjectAnnouncement:
        if (post.projectAnnouncementDetails) {
          info.avatar = post.projectAnnouncementDetails.posterUrl;
          info.name = post.projectAnnouncementDetails.title;
          primarySubtitle = `Project ${post.projectAnnouncementDetails.status}`;
          info.isMovie = true;
        }
        break;

      case PostType.Celebrity:
        if (post.celebrityDetails) {
          info.avatar = post.celebrityDetails.imageUrl;
          info.name = post.celebrityDetails.name;
          primarySubtitle = post.celebrityDetails.knownFor;
        }
        break;

      case PostType.CharacterIntroduction:
        if (post.characterDetails && movie) {
            const characterName = post.characterDetails.name;
            const actorInfo = movie.fullCast.find(p => p.role === characterName);
            if(actorInfo) {
                const actorCelebrity = actorInfo.linkedCelebrityId ? celebritiesMap.get(actorInfo.linkedCelebrityId) : null;
                info.avatar = actorCelebrity?.imageUrl || actorInfo.imageUrl;
                info.name = actorInfo.name;
                primarySubtitle = `as ${characterName}`;
            }
        }
        break;

      case PostType.Birthday:
      case PostType.Trivia:
      case PostType.Filmography:
        if (celebrity) {
          info.avatar = celebrity.imageUrl;
          info.name = celebrity.name;
          primarySubtitle = post.type === PostType.Birthday ? 'Birthday Celebration' : `${post.type} Spotlight`;
        }
        break;

      case PostType.Trailer:
      case PostType.Anniversary:
      case PostType.Countdown:
      case PostType.BoxOffice:
        if (movie) {
          info.avatar = movie.posterUrl;
          info.name = movie.title;
          primarySubtitle = post.type === PostType.BoxOffice ? 'Box Office Report' : `${post.type}`;
          info.isMovie = true;
        } else if (post.type === PostType.BoxOffice && post.boxOfficeDetails) {
            info.name = post.boxOfficeDetails.title;
            primarySubtitle = 'Box Office Report';
            info.isMovie = true;
        }
        break;
        
      case PostType.Awards:
        const awardFor = post.awardDetails?.awardFor || '';
        if (celebrity) {
            info.avatar = celebrity.imageUrl;
            info.name = celebrity.name;
            primarySubtitle = `Won for ${awardFor}`;
        } else if (movie) {
            info.avatar = movie.posterUrl;
            info.name = movie.title;
            primarySubtitle = `Won for ${awardFor}`;
            info.isMovie = true;
        }
        break;
        
      default: // For Image, Announcement
        if (celebrity && !movie) {
            info.avatar = celebrity.imageUrl;
            info.name = celebrity.name;
            primarySubtitle = post.eventDetails?.title || 'Announcement';
        } else if (movie && !celebrity) {
            info.avatar = movie.posterUrl;
            info.name = movie.title;
            primarySubtitle = post.eventDetails?.title || 'Update';
            info.isMovie = true;
        }
        break;
    }
    
    info.subtitle = primarySubtitle ? `${primarySubtitle} • ${post.timestamp}` : post.timestamp;
    return info;

  }, [post, moviesMap, celebritiesMap]);

  const loveTooltipText = useMemo(() => {
    if (loveClickCount >= 3) return "Heart is full! ❤️";
    if (loveClickCount > 0) return "Keep clicking!";
    return "Fill the heart!";
  }, [loveClickCount]);


  useEffect(() => {
    // This effect handles the creation and cleanup of the confetti instance.
    // It runs only once when the component mounts.
    if (canvasRef.current && !confettiInstance.current) {
        confettiInstance.current = confetti.create(canvasRef.current, {
            resize: true,
            useWorker: true,
            disableForReducedMotion: true,
        });
    }

    // Cleanup function to reset confetti when the component unmounts.
    return () => {
        if (confettiInstance.current) {
            confettiInstance.current.reset();
            confettiInstance.current = null;
        }
    };
  }, []); // Empty dependency array ensures this runs only on mount and unmount.

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
  
  const { totalFanzSaysCount, topComments } = useMemo(() => {
    const count = post.fanzSays?.reduce((acc, fs) => acc + fs.fans.length, 0) || 0;
    const top = post.fanzSays?.filter(fs => fs.fans.length > 0).sort((a, b) => b.fans.length - a.fans.length).slice(0, 2) || [];
    return { totalFanzSaysCount: count, topComments: top };
  }, [post.fanzSays]);

  const handleReactionClick = (event: React.MouseEvent, reactionId: string) => {
    const reaction = post.reactions.find(r => r.id === reactionId);
    if (!reaction) return;

    onReaction(post.id, reactionId);

    if (reaction.id === 'love') {
        const newCount = Math.min(loveClickCount + 1, 3);
        setLoveClickCount(newCount);
        // On the 3rd click, trigger the pulse
        if (newCount === 3 && cardRef.current) {
            cardRef.current.classList.add('animate-love-pulse');
            setTimeout(() => {
                cardRef.current?.classList.remove('animate-love-pulse');
            }, 1000); // Duration of the animation
        }
    } else if (reaction.emoji === '🎉') {
      confettiClickCounter.current += 1;
      if (confettiClickCounter.current > 10) {
        makeItRain();
        confettiClickCounter.current = 0; // Reset
      } else {
        triggerRandomConfetti();
      }
    } else if (reaction.emoji === '🥳') {
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
  
  const renderPostContent = () => {
    // General purpose image takes precedence if it's not a specific visual post type
    if (post.imageUrl && ![PostType.Trailer, PostType.MovieDetails, PostType.CharacterIntroduction, PostType.ProjectAnnouncement, PostType.Celebrity, PostType.Image, PostType.Anniversary].includes(post.type)) {
      return <img className="w-full h-auto object-cover rounded-lg" src={post.imageUrl} alt="Post content" />;
    }

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
      case PostType.Birthday:
        return post.imageUrl ? <img className="w-full h-auto object-cover rounded-lg" src={post.imageUrl} alt="Post content" /> : null;
      
      case PostType.MovieDetails: {
        if (!post.movieDetails) return null;
        const { posterUrl, title, rating, synopsis, director, cast, genres } = post.movieDetails;
        return (
            <button onClick={() => onViewFullPost(post)} className="w-full text-left transition-transform duration-300 hover:scale-[1.02]">
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
          <button onClick={() => onViewFullPost(post)} className="w-full text-left transition-transform duration-300 hover:scale-[1.02]">
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
          </button>
        );
      }
       case PostType.Celebrity: {
        if (!post.celebrityDetails) return null;
        const { name, imageUrl, knownFor, bio, notableWorks, birthDate } = post.celebrityDetails;
        return (
          <button onClick={() => onViewFullPost(post)} className="w-full text-left transition-transform duration-300 hover:scale-[1.02]">
            <div className="flex flex-col md:flex-row gap-5 bg-slate-700/50 rounded-lg overflow-hidden">
              <img src={imageUrl} alt={`${name} portrait`} className="w-full md:w-1/3 object-cover object-top" />
              <div className="p-5 flex-1">
                <h4 className="text-2xl font-bold text-white">{name}</h4>
                <p className="text-teal-300 font-semibold mb-3">{knownFor}</p>
                <p className="text-sm text-slate-300 mb-4 italic line-clamp-4">"{bio}"</p>
                
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
          </button>
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
          <button onClick={() => onViewFullPost(post)} className="w-full text-left transition-transform duration-300 hover:scale-[1.02]">
            <div className="flex flex-col md:flex-row gap-5 bg-slate-700/50 rounded-lg overflow-hidden border-2 border-yellow-400/30">
              <div className="relative w-full md:w-1/3">
                <img src={posterUrl} alt={`${title} poster`} className="w-full object-cover" />
                <div className="absolute top-2 left-2 bg-yellow-400 text-slate-900 font-bold px-2 py-1 rounded-md text-xs uppercase tracking-wider">
                  {status}
                </div>
              </div>
              <div className="p-5 flex-1">
                {relationship && (
                  <button 
                      onClick={(e) => { e.stopPropagation(); onViewMoviePage(relationship.relatedMovieId); }}
                      className="text-xs font-bold text-cyan-300 bg-cyan-500/20 px-2 py-1 rounded-full mb-2 hover:bg-cyan-500/40"
                  >
                      {relationship.type}
                  </button>
                )}
                <p className="text-yellow-300 font-semibold mb-1">{expectedRelease}</p>
                <h4 className="text-2xl font-bold text-white">{title}</h4>
                <p className="text-sm text-slate-300 mt-2 mb-4 italic">"{logline}"</p>
                
                <div className="space-y-3 text-sm border-t border-slate-600 pt-3">
                  {director && (
                    <div>
                      <strong className="text-purple-300">Director:</strong>
                      <span className="text-slate-200 ml-2">{director.name}</span>
                    </div>
                  )}
                  {cast.length > 0 && (
                    <div>
                      <strong className="text-purple-300">Starring:</strong>
                      <span className="text-slate-200 ml-2">{castNames}{cast.length > 3 ? '...' : ''}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </button>
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
      default:
        return null;
    }
  };

  const renderEventHeader = () => {
    if (!post.eventDetails) return null;
    
    // Logic to make the header clickable if it's linked to a single celebrity
    const hasSingleCelebLink = post.linkedCelebrityIds?.length === 1;
    const isMainContentClickable = [PostType.Celebrity, PostType.CharacterIntroduction].includes(post.type);
    const isClickable = hasSingleCelebLink && !isMainContentClickable;
    
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
    
    const eventHeaderContent = (
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
    
    if (isClickable) {
        return (
            <button 
                onClick={() => onViewCelebrityPage(post.linkedCelebrityIds![0])}
                className="w-full text-left transition-transform duration-300 hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800 rounded-lg"
            >
                {eventHeaderContent}
            </button>
        );
    }

    return eventHeaderContent;
  };
  
  const hasEventHeader = [
    PostType.Anniversary, PostType.Birthday, PostType.MovieDetails, 
    PostType.CharacterIntroduction, PostType.Awards, PostType.Countdown, 
    PostType.Filmography, PostType.ProjectAnnouncement, PostType.Celebrity,
    PostType.BoxOffice, PostType.Trivia,
  ].includes(post.type);
  const avatarShapeClass = authorInfo.isMovie ? 'rounded-md' : 'rounded-full';
  const { bgClass, accentColor } = getPostCardStyle(post.type);

  return (
    <div 
      id={`post-card-${post.id}`} 
      ref={cardRef}
      className={`relative ${bgClass} rounded-xl shadow-2xl overflow-hidden w-full flex flex-col`}
    >
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none z-20" aria-hidden="true"></canvas>
        
        {/* Header */}
        <div className="p-5 flex-shrink-0">
          {hasEventHeader && renderEventHeader()}
          <div className="flex items-center mt-4">
            <img className={`h-12 w-12 ${avatarShapeClass} border-2 border-slate-600 object-cover`} src={authorInfo.avatar} alt={authorInfo.name} />
            <div className="ml-4">
              <div className="text-lg font-semibold text-white">{authorInfo.name}</div>
              <div className="text-sm text-slate-400">{authorInfo.subtitle}</div>
            </div>
          </div>
        </div>
        
        {/* Body */}
        <div className="flex-1 overflow-hidden px-5 pb-5 relative">
          <div className={!isExpanded ? 'max-h-32 overflow-hidden' : ''}>
              <p ref={contentRef} className="text-slate-300 mb-4 whitespace-pre-wrap">
                {post.content}
              </p>
          </div>
          {isOverflowing && (
            <button onClick={() => setIsExpanded(!isExpanded)} className="text-purple-400 font-semibold hover:underline text-sm relative -top-3">
              {isExpanded ? 'Read Less' : 'Read More...'}
            </button>
          )}
          {renderPostContent()}
        </div>

        {/* Countdown Footer (special case) */}
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

        {/* Main Footer */}
        <div className={`p-5 flex-shrink-0 border-t ${accentColor} bg-slate-800/50`}>
          {post.reactionsEnabled !== false && post.reactions && post.reactions.length > 0 && (
             <div className={`pb-3 border-b-2 ${accentColor}`}>
                <div className="flex items-center justify-start gap-1 sm:gap-2 flex-wrap">
                    {post.reactions.map(reaction => {
                       if (reaction.id === 'love') {
                         return (
                            <div key={reaction.id} className="relative group flex justify-center">
                                <button
                                    onClick={(e) => handleReactionClick(e, reaction.id)}
                                    className="flex items-center space-x-2 text-slate-400 hover:text-white rounded-full py-2 px-3 transition-all duration-200 ease-in-out transform hover:bg-slate-700"
                                    aria-label="React with Love"
                                >
                                    <FillingHeart fillLevel={loveClickCount} />
                                    <span className="font-semibold text-sm">{reaction.count.toLocaleString()}</span>
                                </button>
                                <div 
                                  className="absolute bottom-full mb-2 w-max px-3 py-1.5 bg-slate-950 text-white text-xs font-semibold rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                  role="tooltip"
                                >
                                  {loveTooltipText}
                                </div>
                            </div>
                         );
                       }
                       return (
                          <ReactionButton
                              key={reaction.id}
                              reaction={reaction}
                              onClick={(e) => handleReactionClick(e, reaction.id)}
                              isAnimating={animatingReaction === reaction.emoji}
                          />
                       );
                    })}
                </div>
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
  );
};

export default React.memo(PostCard);