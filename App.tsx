import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Post, Suggestion, SuggestionType, PostType, FanzSay, UserProfileData, HypeLogEntry, Reaction, Banner, SiteSettings, ProjectStatus, Person, ProjectRelationshipType, MovieDetails, CelebrityDetails } from './types';
import { loadSiteSettings, saveSiteSettings } from './utils/siteSettings';
import { getPosts, createWpPost, updateWpPost } from './services/wordpress';
import { INITIAL_POSTS } from './data/initialPosts';
import { Header } from './components/Header';
import PostCard from './components/PostCard';
import SuggestionCarousel from './components/SuggestionCarousel';
import Modal from './components/Modal';
import UserProfile from './components/UserProfile';
import AdminPage from './components/AdminPage';
import PostCardSkeleton from './components/PostCardSkeleton';
import MoviePage from './components/MoviePage';
import WelcomeBanner from './components/WelcomeBanner';
import Footer from './components/Footer';
import AboutPage from './components/pages/AboutPage';
import TermsPage from './components/pages/TermsPage';
import ContactPage from './components/pages/ContactPage';
import DisclaimerPage from './components/pages/DisclaimerPage';
import CelebrityPage from './components/CelebrityPage';
import BottomNavBar from './components/BottomNavBar';
import PostPage from './components/PostPage';
import { useAuth } from './hooks/useAuth';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import OnboardingModal from './components/OnboardingModal';

const createFanAvatars = (count: number, seed: string) => 
  Array.from({ length: count }, (_, i) => `https://i.pravatar.cc/150?u=${seed}-${i}`);

// Define IDs for linking
const MOVIE_KIREETAM_ID = 'movie-kireetam';
const MOVIE_CHRONOS_PROPHECY_ID = 'movie-chronos-prophecy';
const MOVIE_AETHELGARDS_LEGACY_ID = 'movie-aethelgards-legacy';
const MOVIE_GALACTIC_ECHOES_ID = 'movie-galactic-echoes';
const CELEB_TELUGU_SUPERSTAR_ID = 'celeb-telugu-superstar';
const CELEB_LEO_STARLIGHT_ID = 'celeb-leo-starlight';
const CELEB_ARIA_BLAZE_ID = 'celeb-aria-blaze';
const CELEB_NOVA_LUX_ID = 'celeb-nova-lux';
const CELEB_ELARA_VANCE_ID = 'celeb-elara-vance';

const INITIAL_SUGGESTIONS: Suggestion[] = [
  { id: 'sugg-1', name: 'Galactic Echoes Album', avatar: 'https://picsum.photos/seed/album-topic/200', type: SuggestionType.Topic, isFanned: false, linkedId: MOVIE_GALACTIC_ECHOES_ID },
  { id: 'sugg-2', name: 'Aria Blaze', avatar: 'https://i.pravatar.cc/150?u=aria-blaze', type: SuggestionType.Celeb, isFanned: true, linkedId: CELEB_ARIA_BLAZE_ID },
  { id: 'sugg-3', name: 'Leo Starlight', avatar: 'https://i.pravatar.cc/150?u=leo-starlight', type: SuggestionType.Celeb, isFanned: false, linkedId: CELEB_LEO_STARLIGHT_ID },
  { id: 'sugg-4', name: 'World Tour Moments', avatar: 'https://picsum.photos/seed/tour-topic/200', type: SuggestionType.Topic, isFanned: false },
  { id: 'sugg-5', name: 'Behind The Scenes', avatar: 'https://picsum.photos/seed/bts-topic/200', type: SuggestionType.Topic, isFanned: true },
  { id: 'sugg-6', name: 'Nova Lux', avatar: 'https://i.pravatar.cc/150?u=nova-lux', type: SuggestionType.Celeb, isFanned: false, linkedId: CELEB_NOVA_LUX_ID },
];

type ActiveView = 'feed' | 'profile' | 'admin' | 'favorites' | 'about' | 'terms' | 'contact' | 'disclaimer';
type AuthModalView = 'closed' | 'login' | 'register';

interface NavItem {
  id: ActiveView;
  label: string;
  icon: string;
}

const MAX_HYPE_LEVEL = 100;
const CELEBRATION_DURATION = 30000; // 30 seconds

const App: React.FC = () => {
  const { user, isAuthenticated, isLoading: isAuthLoading, updateProfile, isAdmin, isEditor } = useAuth();
  const token = localStorage.getItem('fanz_adda_jwt');
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<Suggestion[]>(INITIAL_SUGGESTIONS);
  const [authModal, setAuthModal] = useState<AuthModalView>('closed');
  
  const userProfile = useMemo<UserProfileData>(() => {
    if (isAuthenticated && user) {
      return user;
    }
    // Return a default guest profile if not logged in
    return {
      id: 0,
      name: 'Guest',
      avatar: 'https://i.pravatar.cc/150?u=guestUser',
      favoriteStars: [],
      favoriteMovies: [],
      favoriteGenres: [],
      roles: [],
    };
  }, [isAuthenticated, user]);
  
  const [isUnfanModalOpen, setIsUnfanModalOpen] = useState(false);
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [activeMovieId, setActiveMovieId] = useState<string | null>(null);
  const [activeCelebrityId, setActiveCelebrityId] = useState<string | null>(null);
  const [suggestionToUnfan, setSuggestionToUnfan] = useState<{ id: string; name: string } | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>('feed');
  
  const [userHypeState, setUserHypeState] = useState({ count: 3, lastReset: new Date().toISOString() });
  const [hypeLog, setHypeLog] = useState<HypeLogEntry[]>([]);
  
  const [banners, setBanners] = useState<Banner[]>([
    {
      id: 'default-welcome-banner-1',
      name: 'Default Welcome Banner',
      isActive: true,
      headline1: "నిజమైన అభిమానులు రివ్యూలు అడగరు,",
      headline2: "సెలబ్రేట్‌ చేసుకుంటారు!",
      description: "ఇక్కడ ప్రతి సినిమా ఒక జ్ఞాపకం, ప్రతి స్టార్‌ ఒక ఎమోషన్‌.\nఇది విమర్శల స్థలం కాదు, ఇది అభిమానుల హంగామా...........! 🌟\n\nసినిమాలను ప్రేమించే ఫ్యాన్స్‌ కోసమే ఈ వేదిక,\nfanzadda.com ki స్వాగతం —",
      targeting: {
        device: 'all',
        loggedInStatus: 'all',
      }
    }
  ]);
  
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(loadSiteSettings());
  
  const [hypeLevel, setHypeLevel] = useState(0);
  const [isCelebrationModeActive, setIsCelebrationModeActive] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const activeBanner = useMemo(() => {
    const now = new Date();
    // A simple check for mobile. In a real app, this might be more robust.
    const isMobile = window.innerWidth < 768; 

    return banners.find(b => {
      if (!b.isActive) return false;
      const startDate = b.startDate ? new Date(b.startDate) : null;
      const endDate = b.endDate ? new Date(b.endDate) : null;
      if (startDate && now < startDate) return false;
      if (endDate && now > endDate) return false;
      const targeting = b.targeting;
      if (targeting) {
         if (targeting.device === 'desktop' && isMobile) return false;
         if (targeting.device === 'mobile' && !isMobile) return false;
         if (targeting.loggedInStatus === 'loggedOut' && isAuthenticated) return false;
         if (targeting.loggedInStatus === 'loggedIn' && !isAuthenticated) return false;
      }
      return true;
    });
  }, [banners, isAuthenticated]);
  
  const [isWelcomeBannerVisible, setIsWelcomeBannerVisible] = useState(!!activeBanner);
  const [isBannerMinimized, setIsBannerMinimized] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // --- START: Onboarding and Logout Logic ---
  const wasAuthenticated = useRef(isAuthenticated);

  useEffect(() => {
    // This effect handles post-authentication actions
    if (isAuthenticated && user) {
        // Simple check: if any favorite list is empty, trigger onboarding.
        // A more robust check might involve a 'has_completed_onboarding' flag from the backend.
        const needsOnboarding =
            !user.favoriteStars || user.favoriteStars.length === 0 ||
            !user.favoriteMovies || user.favoriteMovies.length === 0 ||
            !user.favoriteGenres || user.favoriteGenres.length === 0;

        if (needsOnboarding) {
            setIsOnboardingOpen(true);
        }
    }
    
    // This handles redirection after logout
    if (wasAuthenticated.current && !isAuthenticated) {
      // User has just logged out, redirect to feed
      setActiveView('feed');
    }
    wasAuthenticated.current = isAuthenticated;
  }, [isAuthenticated, user]);

  const handleOnboardingSave = useCallback(async (newProfile: UserProfileData) => {
    await updateProfile(newProfile);
    setIsOnboardingOpen(false);
  }, [updateProfile]);
  // --- END: Onboarding and Logout Logic ---

  useEffect(() => {
    // Fetch posts from WordPress backend
    const fetchContent = async () => {
      setIsLoading(true);

      const fetchedPosts = await getPosts();
      
      if (fetchedPosts.length > 0) {
        setPosts(fetchedPosts);
      } else {
        console.warn("Could not fetch any content from backend. Using static fallback data for testing.");
        setPosts(INITIAL_POSTS);
      }

      setIsLoading(false);
    };

    fetchContent();
  }, []);

  useEffect(() => {
    document.title = siteSettings.siteName;
    const faviconEl = document.querySelector('link[rel="icon"]');
    if (faviconEl) {
        if (siteSettings.favicon) {
            (faviconEl as HTMLLinkElement).href = siteSettings.favicon;
        } else {
            (faviconEl as HTMLLinkElement).href = '/vite.svg'; // Default
        }
    }
  }, [siteSettings]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50 && !isBannerMinimized) {
        setIsBannerMinimized(true);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isBannerMinimized]);

  useEffect(() => {
    const handleHeaderScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    if (activeMovieId || activeCelebrityId || activePostId) {
      setIsScrolled(false);
      return;
    }

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();

    return () => {
      window.removeEventListener('scroll', handleHeaderScroll);
    };
  }, [activeMovieId, activeCelebrityId, activePostId]);
  
  useEffect(() => {
    if (isCelebrationModeActive) {
      document.body.classList.add('celebration-mode');
    } else {
      document.body.classList.remove('celebration-mode');
    }
    return () => document.body.classList.remove('celebration-mode');
  }, [isCelebrationModeActive]);

  useEffect(() => {
    if (isCelebrationModeActive) {
      const timer = setTimeout(() => {
        setIsCelebrationModeActive(false);
        setHypeLevel(0);
      }, CELEBRATION_DURATION);
      return () => clearTimeout(timer);
    }
  }, [isCelebrationModeActive]);

  const handleReopenBanner = useCallback(() => {
    setIsBannerMinimized(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleUpdateProfile = useCallback(async (newProfile: UserProfileData) => {
    await updateProfile(newProfile);
  }, [updateProfile]);

  const handleUpdateBanners = useCallback((newBanners: Banner[]) => {
    setBanners(newBanners);
  }, []);

  const handleUpdateSiteSettings = useCallback((newSettings: SiteSettings) => {
    saveSiteSettings(newSettings);
    setSiteSettings(newSettings);
  }, []);

  const { allGenres, allMovies, allStars, allCelebrities, moviesMap, celebritiesMap } = useMemo(() => {
    const genres = new Set<string>();
    const movies = new Map<string, string>();
    const stars = new Set<string>();
    const celebrities = new Map<string, string>();
    const moviesMap = new Map<string, MovieDetails>();
    const celebritiesMap = new Map<string, CelebrityDetails>();

    posts.forEach(post => {
      if (post.movieDetails) {
        movies.set(post.movieDetails.id, post.movieDetails.title);
        moviesMap.set(post.movieDetails.id, post.movieDetails);
        post.movieDetails.genres.forEach(g => genres.add(g));
        post.movieDetails.cast.forEach(c => stars.add(c));
      }
      if (post.celebrityDetails) {
        celebrities.set(post.celebrityDetails.id, post.celebrityDetails.name);
        celebritiesMap.set(post.celebrityDetails.id, post.celebrityDetails);
      }
      if (post.filmographyDetails) {
        post.filmographyDetails.forEach(f => movies.set(f.id, f.title));
      }
    });

    return {
      allGenres: Array.from(genres),
      allMovies: Array.from(movies.entries()).map(([id, title]) => ({ id, title })),
      allStars: Array.from(stars),
      allCelebrities: Array.from(celebrities.entries()).map(([id, name]) => ({ id, name })),
      moviesMap,
      celebritiesMap,
    };
  }, [posts]);
  
  const handleViewMoviePage = useCallback((movieId: string) => {
    setActiveMovieId(movieId);
    setActiveCelebrityId(null);
    setActivePostId(null);
    setActiveView('feed');
    window.scrollTo(0, 0);
  }, []);

  const handleCloseMoviePage = useCallback(() => {
    setActiveMovieId(null);
    setActiveView('feed');
  }, []);

  const handleViewCelebrityPage = useCallback((celebId: string) => {
    setActiveCelebrityId(celebId);
    setActiveMovieId(null);
    setActivePostId(null);
    setActiveView('feed');
    window.scrollTo(0, 0);
  }, []);

  const handleCloseCelebrityPage = useCallback(() => {
    setActiveCelebrityId(null);
  }, []);

  const handleViewPost = useCallback((post: Post) => {
    if (post.type === PostType.MovieDetails && post.movieDetails) {
      handleViewMoviePage(post.movieDetails.id);
      return;
    }
    if (post.type === PostType.Celebrity && post.celebrityDetails) {
      handleViewCelebrityPage(post.celebrityDetails.id);
      return;
    }
    if (post.type === PostType.ProjectAnnouncement && post.linkedMovieIds?.length === 1) {
      handleViewMoviePage(post.linkedMovieIds[0]);
      return;
    }
    const hasOneMovie = post.linkedMovieIds?.length === 1;
    const hasOneCeleb = post.linkedCelebrityIds?.length === 1;
    if (hasOneMovie && !hasOneCeleb) {
      handleViewMoviePage(post.linkedMovieIds![0]);
      return;
    }
    if (hasOneCeleb && !hasOneMovie) {
      handleViewCelebrityPage(post.linkedCelebrityIds![0]);
      return;
    }
    setActivePostId(post.id);
    setActiveMovieId(null);
    setActiveCelebrityId(null);
    setActiveView('feed');
    window.scrollTo(0, 0);
  }, [handleViewMoviePage, handleViewCelebrityPage]);

  const handleClosePostPage = useCallback(() => {
    setActivePostId(null);
  }, []);

  const handleAddPost = useCallback(async (postData: Omit<Post, 'id' | 'author' | 'avatar' | 'timestamp'>) => {
    if (!token) {
      alert("Authentication error. Please log in again.");
      return;
    }
    try {
      const newPost = await createWpPost(token, postData);
      setPosts(prevPosts => [newPost, ...prevPosts]);
    } catch (error) {
      console.error("Failed to create post:", error);
      alert(`Error creating post: ${(error as Error).message}`);
    }
  }, [token]);
  
  const handleUpdatePost = useCallback(async (updatedPost: Post) => {
     if (!token) {
      alert("Authentication error. Please log in again.");
      return;
    }
    try {
      const savedPost = await updateWpPost(token, updatedPost.id, updatedPost);
      // The local state might have already been updated optimistically.
      // To prevent a flicker, we only update if the saved data is different.
      // For simplicity here, we'll just re-map to ensure consistency.
      setPosts(prevPosts =>
        prevPosts.map(p => (p.id === savedPost.id ? savedPost : p))
      );
    } catch (error) {
      console.error("Failed to update post:", error);
      alert(`Error updating post: ${(error as Error).message}`);
    }
  }, [token]);

  const handleDeletePost = useCallback((postId: string) => {
    setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
  }, []);

  const handleInteraction = (action: () => void) => {
    if (!isAuthenticated) {
      setAuthModal('login');
      return;
    }
    action();
  };

  const handleToggleFan = useCallback((suggestionId: string) => {
    handleInteraction(() => {
      setSuggestions(prevSuggestions =>
        prevSuggestions.map(suggestion =>
          suggestion.id === suggestionId
            ? { ...suggestion, isFanned: !suggestion.isFanned }
            : suggestion
        )
      );
    });
  }, [isAuthenticated]);
  
  const handleToggleFavoriteMovie = useCallback((movieTitle: string) => {
    handleInteraction(() => {
      const isAlreadyFavorite = userProfile.favoriteMovies.includes(movieTitle);
      const newFavoriteMovies = isAlreadyFavorite
        ? userProfile.favoriteMovies.filter(title => title !== movieTitle)
        : [...userProfile.favoriteMovies, movieTitle];
      handleUpdateProfile({ ...userProfile, favoriteMovies: newFavoriteMovies });
    });
  }, [isAuthenticated, userProfile, handleUpdateProfile]);

  const handleStartUnfan = useCallback((id: string, name: string) => {
    setSuggestionToUnfan({ id, name });
    setIsUnfanModalOpen(true);
  }, []);

  const handleConfirmUnfan = useCallback(() => {
    if (suggestionToUnfan) {
      handleToggleFan(suggestionToUnfan.id);
    }
    setIsUnfanModalOpen(false);
    setSuggestionToUnfan(null);
  }, [suggestionToUnfan, handleToggleFan]);
  
  const handleCancelUnfan = useCallback(() => {
    setIsUnfanModalOpen(false);
    setSuggestionToUnfan(null);
  }, []);

  const incrementHype = useCallback(() => {
    setHypeLevel(prevLevel => {
      if (prevLevel >= MAX_HYPE_LEVEL) {
        return MAX_HYPE_LEVEL;
      }
      const newLevel = prevLevel + 1;
      if (newLevel >= MAX_HYPE_LEVEL) {
        setIsCelebrationModeActive(true);
      }
      return newLevel;
    });
  }, []);

  const handleReaction = useCallback((postId: string, reactionId: string) => {
    handleInteraction(() => {
      let updatedPost: Post | null = null;
      const newPosts = posts.map(post => {
        if (post.id === postId && post.reactions) {
          const newReactions = post.reactions.map(reaction => {
            if (reaction.id === reactionId) {
              return { ...reaction, count: reaction.count + 1 };
            }
            return reaction;
          });
          updatedPost = { ...post, reactions: newReactions };
          return updatedPost;
        }
        return post;
      });

      setPosts(newPosts); // Optimistic UI update
      if (updatedPost) {
        handleUpdatePost(updatedPost); // Persist to backend
      }
      incrementHype();
    });
  }, [isAuthenticated, posts, handleUpdatePost, incrementHype]);

  const handleFanzSay = useCallback((postId: string, fanzSayId: string) => {
    handleInteraction(() => {
      let updatedPost: Post | null = null;
      const newPosts = posts.map(post => {
        if (post.id === postId && post.fanzSays) {
          const newFanzSays = post.fanzSays.map(fs => {
            if (fs.id === fanzSayId) {
              const userHasSaid = fs.fans.includes(userProfile.avatar);
              const newFans = userHasSaid
                ? fs.fans.filter(fan => fan !== userProfile.avatar)
                : [...fs.fans, userProfile.avatar];
              return { ...fs, fans: newFans };
            }
            return fs;
          });
          updatedPost = { ...post, fanzSays: newFanzSays };
          return updatedPost;
        }
        return post;
      });

      setPosts(newPosts); // Optimistic UI update
      if (updatedPost) {
        handleUpdatePost(updatedPost); // Persist to backend
      }
      incrementHype();
    });
  }, [isAuthenticated, userProfile.avatar, posts, handleUpdatePost, incrementHype]);

  const handleHype = useCallback((movieId: string) => {
    handleInteraction(() => {
      const now = new Date();
      const lastResetDate = new Date(userHypeState.lastReset);
      const todayDay = now.getDay();
      const daysSinceMonday = todayDay === 0 ? 6 : todayDay - 1;
      const lastMonday = new Date(now);
      lastMonday.setDate(now.getDate() - daysSinceMonday);
      lastMonday.setHours(0, 0, 0, 0);

      let newCount = userHypeState.count;
      let newResetDate = userHypeState.lastReset;

      if (lastResetDate < lastMonday) {
          newCount = 3;
          newResetDate = now.toISOString();
      }

      if (newCount > 0) {
          newCount--;
          setHypeLog(prevLog => [...prevLog, { movieId, timestamp: new Date().toISOString() }]);
      } else {
          return;
      }

      setUserHypeState({ count: newCount, lastReset: newResetDate });
    });
  }, [isAuthenticated, userHypeState]);

  const fannedSuggestions = useMemo(() => suggestions.filter(s => s.isFanned), [suggestions]);
  
  const interactedPosts = useMemo(() => 
    posts.filter(p => 
      p.fanzSays?.some(fs => fs.fans.includes(userProfile.avatar))
    ), 
    [posts, userProfile.avatar]
  );
  
  const unfannedSuggestions = useMemo(() => suggestions.filter(s => !s.isFanned), [suggestions]);

  const fannedSuggestionLinkedIds = useMemo(() => 
    suggestions.filter(s => s.isFanned && s.linkedId).map(s => s.linkedId!),
  [suggestions]);

  const favoritesFeed = useMemo(() => {
    if (fannedSuggestionLinkedIds.length === 0) {
        return [];
    }
    return posts.filter(post => {
        const postLinks = [...(post.linkedCelebrityIds || []), ...(post.linkedMovieIds || [])];
        if (postLinks.length === 0) return false;
        return postLinks.some(link => fannedSuggestionLinkedIds.includes(link));
    });
  }, [posts, fannedSuggestionLinkedIds]);

  const celebrityAvatarMap = useMemo(() => {
    const celebAvatars = new Map<string, string>();
    INITIAL_SUGGESTIONS.forEach(sugg => {
      if (sugg.type === SuggestionType.Celeb && sugg.name && sugg.avatar) {
        celebAvatars.set(sugg.name, sugg.avatar);
      }
    });
    posts.forEach(post => {
      if (post.type === PostType.Celebrity && post.celebrityDetails) {
        if (!celebAvatars.has(post.celebrityDetails.name)) {
            celebAvatars.set(post.celebrityDetails.name, post.celebrityDetails.imageUrl);
        }
      }
    });
    return celebAvatars;
  }, [posts]);

  const favoriteStarAvatars = useMemo(() => {
    return userProfile.favoriteStars
      .map(starName => celebrityAvatarMap.get(starName))
      .filter((avatar): avatar is string => !!avatar);
  }, [userProfile.favoriteStars, celebrityAvatarMap]);
  
  const navItems: NavItem[] = useMemo(() => {
    if (!isAuthenticated) return []; // No nav items if not logged in
    
    const items: NavItem[] = [
        { id: 'feed', label: 'Feed', icon: 'home' },
        { id: 'favorites', label: 'Favorites', icon: 'favorite' },
        { id: 'profile', label: 'Profile', icon: 'person' }
    ];

    if (isEditor) {
        items.push({ id: 'admin', label: 'Admin', icon: 'admin_panel_settings' });
    }
    
    return items;
  }, [isAuthenticated, isEditor]);

  const getDesktopTabStyle = (view: ActiveView) => {
    const baseStyle = "px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800";
    if (activeView === view) {
      return `${baseStyle} bg-purple-600 text-white`;
    }
    return `${baseStyle} text-slate-300 hover:bg-slate-700`;
  };

  const LoginPrompt: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
    <div className="text-center py-20 bg-slate-800 rounded-lg mt-6">
        <span className="material-symbols-outlined text-6xl text-slate-500">lock_open</span>
        <h2 className="mt-4 text-2xl font-bold text-white">{title}</h2>
        <p className="mt-2 text-slate-400">{subtitle}</p>
        <button
            onClick={() => setAuthModal('login')}
            className="mt-6 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full transition duration-300"
        >
            Log In
        </button>
    </div>
  );
  
  const renderActivePage = () => {
    if (activeMovieId) {
      return (
        <MoviePage 
          movieId={activeMovieId}
          posts={posts}
          onClose={handleCloseMoviePage}
          onReaction={handleReaction}
          onFanzSay={handleFanzSay}
          currentUserAvatar={userProfile.avatar}
          onViewMoviePage={handleViewMoviePage}
          onViewFullPost={handleViewPost}
          userHypeState={userHypeState}
          onHype={handleHype}
          hypeLog={hypeLog}
          onViewCelebrityPage={handleViewCelebrityPage}
          moviesMap={moviesMap}
          celebritiesMap={celebritiesMap}
          onToggleFavoriteMovie={handleToggleFavoriteMovie}
          favoriteMovies={userProfile.favoriteMovies}
        />
      );
    }
    
    if (activeCelebrityId) {
      return (
        <CelebrityPage
          celebrityId={activeCelebrityId}
          posts={posts}
          suggestions={suggestions}
          onClose={handleCloseCelebrityPage}
          onReaction={handleReaction}
          onFanzSay={handleFanzSay}
          currentUserAvatar={userProfile.avatar}
          onViewMoviePage={handleViewMoviePage}
          onViewFullPost={handleViewPost}
          onToggleFan={handleToggleFan}
          onViewCelebrityPage={handleViewCelebrityPage}
          moviesMap={moviesMap}
          celebritiesMap={celebritiesMap}
        />
      );
    }

    if (activePostId) {
      return (
        <PostPage
          postId={activePostId}
          posts={posts}
          onClose={handleClosePostPage}
          onReaction={handleReaction}
          onFanzSay={handleFanzSay}
          currentUserAvatar={userProfile.avatar}
          onViewMoviePage={handleViewMoviePage}
          onViewCelebrityPage={handleViewCelebrityPage}
        />
      );
    }

    return (
       <>
          <main className="max-w-7xl mx-auto py-6 pb-24 sm:pb-6">
            {activeView === 'feed' && (
              <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <>
                  {unfannedSuggestions.length > 0 && (
                    <SuggestionCarousel
                      suggestions={unfannedSuggestions}
                      onToggleFan={handleToggleFan}
                      onStartUnfan={handleStartUnfan}
                      onViewCelebrityPage={handleViewCelebrityPage}
                    />
                  )}

                  <div className="space-y-6 mt-6">
                    {isLoading || isAuthLoading ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        <PostCardSkeleton key={index} />
                      ))
                    ) : (
                      posts.length > 0 ? posts.map((post) => (
                        <PostCard
                          key={post.id}
                          post={post}
                          onReaction={handleReaction}
                          onFanzSay={handleFanzSay}
                          currentUserAvatar={userProfile.avatar}
                          onViewFullPost={handleViewPost}
                          onViewMoviePage={handleViewMoviePage}
                          onViewCelebrityPage={handleViewCelebrityPage}
                          moviesMap={moviesMap}
                          celebritiesMap={celebritiesMap}
                        />
                      )) : (
                        <div className="text-center py-20 bg-slate-800 rounded-lg mt-6">
                          <span className="material-symbols-outlined text-6xl text-slate-500">signal_wifi_off</span>
                          <h2 className="mt-4 text-2xl font-bold text-white">Could Not Fetch Posts</h2>
                          <p className="mt-2 text-slate-400">There was an issue connecting to the backend. Please check your connection and try again.</p>
                        </div>
                      )
                    )}
                  </div>
                </>
              </div>
            )}
            
            {activeView === 'favorites' && (
              <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                {!isAuthenticated ? (
                   <LoginPrompt title="View Your Favorites" subtitle="Log in to see posts from your fanned celebrities and topics." />
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-rose-400">favorite</span>
                      Your Favorites Feed
                    </h2>
                    {favoritesFeed.length > 0 ? (
                        <div className="space-y-6">
                            {favoritesFeed.map(post => (
                                <PostCard 
                                    key={post.id} 
                                    post={post} 
                                    onReaction={handleReaction}
                                    onFanzSay={handleFanzSay}
                                    currentUserAvatar={userProfile.avatar}
                                    onViewFullPost={handleViewPost}
                                    onViewMoviePage={handleViewMoviePage}
                                    onViewCelebrityPage={handleViewCelebrityPage}
                                    moviesMap={moviesMap}
                                    celebritiesMap={celebritiesMap}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-slate-800 rounded-lg mt-6">
                            <span className="material-symbols-outlined text-6xl text-slate-500">favorite</span>
                            <h2 className="mt-4 text-2xl font-bold text-white">Your Feed is Empty</h2>
                            <p className="mt-2 text-slate-400">Fan some celebrities or topics to see related posts here!</p>
                        </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeView === 'profile' && isAuthenticated && (
              <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <UserProfile
                  user={userProfile}
                  fannedItems={fannedSuggestions}
                  interactedPosts={interactedPosts}
                  onToggleFan={handleToggleFan}
                  onStartUnfan={handleStartUnfan}
                  onReaction={handleReaction}
                  onFanzSay={handleFanzSay}
                  onUpdateProfile={handleUpdateProfile}
                  favoriteOptions={{ genres: allGenres, movies: allMovies.map(m => m.title), stars: allStars }}
                  onViewFullPost={handleViewPost}
                  onViewMoviePage={handleViewMoviePage}
                  onViewCelebrityPage={handleViewCelebrityPage}
                  moviesMap={moviesMap}
                  celebritiesMap={celebritiesMap}
                />
              </div>
            )}

            {activeView === 'admin' && isEditor && (
              <AdminPage 
                posts={posts}
                onAddPost={handleAddPost}
                onUpdatePost={handleUpdatePost}
                onDeletePost={handleDeletePost}
                banners={banners}
                onUpdateBanners={handleUpdateBanners}
                allMovies={allMovies}
                allCelebrities={allCelebrities}
                siteSettings={siteSettings}
                onUpdateSiteSettings={handleUpdateSiteSettings}
                isAdmin={isAdmin}
              />
            )}

            {activeView === 'about' && <AboutPage />}
            {activeView === 'terms' && <TermsPage />}
            {activeView === 'contact' && <ContactPage />}
            {activeView === 'disclaimer' && <DisclaimerPage />}
          </main>
          <Footer setActiveView={setActiveView} />
        </>
    )
  }

  if (isAuthLoading && !user) {
    // Show a full-page loading skeleton only on initial authentication check
    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
  }

  return (
    <>
      {authModal === 'login' && (
        <LoginPage 
          onClose={() => setAuthModal('closed')} 
          onSwitchToRegister={() => setAuthModal('register')}
        />
      )}

      {authModal === 'register' && (
        <RegisterPage 
          onClose={() => setAuthModal('closed')}
          onSwitchToLogin={() => setAuthModal('login')}
        />
      )}

      {isOnboardingOpen && user && (
        <OnboardingModal
          user={user}
          onSave={handleOnboardingSave}
          onClose={() => setIsOnboardingOpen(false)}
          favoriteOptions={{ genres: allGenres, movies: allMovies.map(m => m.title), stars: allStars }}
        />
      )}
      
      {isWelcomeBannerVisible && activeBanner && !isBannerMinimized && (
        <WelcomeBanner 
          onDismiss={() => setIsWelcomeBannerVisible(false)} 
          content={activeBanner}
        />
      )}
      <Header 
        setActiveView={setActiveView}
        onLoginClick={() => setAuthModal('login')}
        favoriteStarAvatars={favoriteStarAvatars}
        isBannerVisible={isWelcomeBannerVisible && isBannerMinimized}
        bannerContent={activeBanner}
        onDismissBanner={() => setIsWelcomeBannerVisible(false)}
        onReopenBanner={handleReopenBanner}
        siteName={siteSettings.siteName}
        logoUrl={siteSettings.logo}
        hypeLevel={hypeLevel}
        maxHypeLevel={MAX_HYPE_LEVEL}
        isCelebrationModeActive={isCelebrationModeActive}
        isScrolled={isScrolled}
      />
      
      {/* Desktop Navigation */}
      {isAuthenticated && !activeMovieId && !activeCelebrityId && !activePostId && (
        <div className="hidden sm:block bg-slate-900 border-b border-slate-700/50">
           <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-center">
              <div className="flex items-center space-x-2 bg-slate-800/50 p-1 rounded-lg">
                 {navItems.map(item => (
                    <button key={item.id} onClick={() => setActiveView(item.id)} className={getDesktopTabStyle(item.id)}>
                        {item.label}
                    </button>
                 ))}
              </div>
           </nav>
        </div>
      )}

      {renderActivePage()}
      
      {isAuthenticated && (
        <BottomNavBar 
          activeView={activeView}
          setActiveView={setActiveView}
          navItems={navItems}
        />
      )}
      
      {isUnfanModalOpen && suggestionToUnfan && (
        <Modal
          isOpen={isUnfanModalOpen}
          onClose={handleCancelUnfan}
          onConfirm={handleConfirmUnfan}
          title="Confirm Un-Fan"
        >
          <p>Are you sure you want to un-fan <strong className="text-purple-300">{suggestionToUnfan.name}</strong>?</p>
        </Modal>
      )}
    </>
  );
};

export default App;