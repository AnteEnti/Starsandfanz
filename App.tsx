import React, { useState, useCallback, useMemo } from 'react';
import { Post, ReactionType, Suggestion, SuggestionType, PostType, FanzSay, UserProfileData } from './types';
import Header from './components/Header';
import PostCard from './components/PostCard';
import SuggestionCarousel from './components/SuggestionCarousel';
import Modal from './components/Modal';
import UserProfile from './components/UserProfile';
import AdminPage from './components/AdminPage';

const createFanAvatars = (count: number, seed: string) => 
  Array.from({ length: count }, (_, i) => `https://i.pravatar.cc/150?u=${seed}-${i}`);

const INITIAL_POSTS: Post[] = [
    {
    id: 'post-award-1',
    type: PostType.Awards,
    author: 'Star Sphere Admin',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    timestamp: 'Just now',
    content: "A massive congratulations for the big win! An unforgettable performance in 'Chronos Prophecy' gets the recognition it deserves. Well done!",
    eventDetails: {
      title: "And the Award goes to...",
    },
    awardDetails: {
      awardName: 'Golden Globe for Best Actor',
      awardFor: "'Chronos Prophecy'",
      event: 'Golden Globe Awards',
      year: 2024,
      imageUrl: 'https://picsum.photos/seed/goldenglobe/200/200'
    },
    reactions: {
      [ReactionType.Celebrate]: 25000,
      [ReactionType.Love]: 18000,
    },
    fanzSays: [
      { id: 'sc-award-1', text: 'Well Deserved! 🏆', fans: createFanAvatars(12, 'award1') },
      { id: 'sc-award-2', text: 'So Proud! ❤️', fans: createFanAvatars(8, 'award2') },
      { id: 'sc-award-3', text: 'Legendary Performance!', fans: createFanAvatars(6, 'award3') },
      { id: 'sc-award-4', text: 'King for a reason! 👑', fans: [] },
    ],
  },
   {
    id: 'post-project-announce-1',
    type: PostType.ProjectAnnouncement,
    author: 'Star Sphere Admin',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    timestamp: '4 hours ago',
    content: "The next saga begins! We are thrilled to announce 'Aethelgard's Legacy', a new epic adventure currently in production. Get ready for a journey into a world of myth and legend.",
    eventDetails: {
      title: "New Project Announcement",
    },
    projectAnnouncementDetails: {
      title: "Aethelgard's Legacy",
      posterUrl: 'https://picsum.photos/seed/aethelgard-poster/800/1200',
      status: 'In Production',
      expectedRelease: 'Coming 2025',
      crew: 'From visionary director Elara Vance',
      logline: 'In a land forgotten by time, a hero must rise to reclaim a stolen birthright.',
    },
    reactions: {
      [ReactionType.Celebrate]: 15000,
      [ReactionType.Love]: 12000,
    },
    fanzSays: [
      { id: 'sc-pa-1', text: "Let's Gooo! 🔥", fans: createFanAvatars(21, 'pa1') },
      { id: 'sc-pa-2', text: "Already hyped!", fans: createFanAvatars(14, 'pa2') },
      { id: 'sc-pa-3', text: 'This sounds epic!', fans: createFanAvatars(9, 'pa3') },
      { id: 'sc-pa-4', text: 'Another masterpiece incoming!', fans: [] },
    ],
  },
  {
    id: 'post-countdown-1',
    type: PostType.Countdown,
    author: 'Star Sphere Admin',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    timestamp: '8 hours ago',
    content: "The countdown has begun! Get ready for the worldwide premiere of 'Galactic Echoes'. We're on the edge of our seats!",
    eventDetails: {
      title: "'Galactic Echoes' Premiere",
    },
    countdownDetails: {
      title: 'Premiering In',
      targetDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
      imageUrl: 'https://picsum.photos/seed/galactic-echoes-poster/800/1200',
      bookingUrl: '#',
    },
    reactions: {
      [ReactionType.Celebrate]: 9800,
    },
    fanzSays: [
        { id: 'sc-cd-1', text: "Can't Wait! 🔥", fans: createFanAvatars(15, 'cd1') },
        { id: 'sc-cd-2', text: 'Take my money! 💸', fans: createFanAvatars(11, 'cd2') },
        { id: 'sc-cd-3', text: 'This will be epic!', fans: createFanAvatars(7, 'cd3') },
        { id: 'sc-cd-4', text: 'Already booked tickets!', fans: [] },
    ],
  },
   {
    id: 'post-filmography-1',
    type: PostType.Filmography,
    author: 'Star Sphere Admin',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    timestamp: '1 day ago',
    content: "From blockbuster hits to indie gems, the journey has been incredible. Take a look back at some of the most iconic roles. Which one is your all-time favorite?",
    eventDetails: {
      title: "A Look Back: Filmography",
    },
    filmographyDetails: [
      { id: 'film-1', title: 'Chronos Prophecy', year: 2019, posterUrl: 'https://picsum.photos/seed/chronos-prophecy-poster/400/600' },
      { id: 'film-2', title: 'Crimson Tide', year: 2017, posterUrl: 'https://picsum.photos/seed/crimson-tide-poster/400/600' },
      { id: 'film-3', title: 'Echoes of a Dream', year: 2015, posterUrl: 'https://picsum.photos/seed/echoes-dream-poster/400/600' },
      { id: 'film-4', title: 'Neon Shadows', year: 2013, posterUrl: 'https://picsum.photos/seed/neon-shadows-poster/400/600' },
    ],
    reactions: {
      [ReactionType.Love]: 11000,
    },
    fanzSays: [
      { id: 'sc-film-1', text: 'All of them! 🤩', fans: createFanAvatars(9, 'film1') },
      { id: 'sc-film-2', text: "'Chronos Prophecy' is my favorite!", fans: createFanAvatars(6, 'film2') },
      { id: 'sc-film-3', text: 'What a filmography!', fans: createFanAvatars(4, 'film3') },
      { id: 'sc-film-4', text: 'An absolute legend!', fans: [] },
    ],
  },
  {
    id: 'post-bday-1',
    type: PostType.Birthday,
    author: 'Star Sphere Admin',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    timestamp: '2 days ago',
    content: "Wishing the happiest of birthdays to the one and only! Your talent and dedication inspire us all every day. Drop your birthday wishes in the comments below! 🎂",
    eventDetails: {
      title: "Happy Birthday, Leo Starlight!",
    },
    reactions: {
      [ReactionType.Celebrate]: 12000,
      [ReactionType.Love]: 8500,
    },
    fanzSays: [
      { id: 'sc-bday-1', text: 'Happy Birthday! 🎉', fans: createFanAvatars(32, 'bday1') },
      { id: 'sc-bday-2', text: 'Many happy returns!', fans: createFanAvatars(18, 'bday2') },
      { id: 'sc-bday-3', text: 'Have a great year ahead!', fans: createFanAvatars(11, 'bday3') },
      { id: 'sc-bday-4', text: 'Stay blessed!', fans: [] },
    ],
  },
  {
    id: 'post-trailer-1',
    type: PostType.Trailer,
    author: 'Star Sphere Admin',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    timestamp: '3 days ago',
    content: "The wait is almost over! Check out the official trailer for 'Galactic Echoes'. We are speechless. What scene are you most excited about?! 🚀",
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?&autoplay=1&mute=1&controls=0',
    videoDuration: 212, // Rick Astley song duration
    reactions: {
      [ReactionType.Love]: 5600,
      [ReactionType.Whistle]: 3200,
    },
    fanzSays: [
      { id: 'sc-trailer-1', text: 'Mind Blowing! 🤯', fans: createFanAvatars(4, 'trailer1') },
      { id: 'sc-trailer-2', text: 'Goosebumps! 🥶', fans: createFanAvatars(3, 'trailer2') },
      { id: 'sc-trailer-3', text: 'That is Awesome! ✨', fans: createFanAvatars(2, 'trailer3') },
      { id: 'sc-trailer-4', text: 'Instant Blockbuster!', fans: [] },
    ],
  },
  {
    id: 'post-anniv-1',
    type: PostType.Anniversary,
    author: 'Star Sphere Admin',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    timestamp: '4 days ago',
    content: "Can you believe it's been 5 years since 'Chronos Prophecy' hit the theaters? A timeless masterpiece! Share your favorite quote from the movie! 🎬",
    imageUrl: 'https://picsum.photos/seed/chronos-prophecy/800/500',
    eventDetails: {
      title: "Chronos Prophecy",
      subtitle: "5th Anniversary",
    },
    reactions: {
      [ReactionType.Love]: 7800,
    },
    fanzSays: [
      { id: 'sc-anniv-1', text: 'A true classic! 🎬', fans: createFanAvatars(8, 'anniv1') },
      { id: 'sc-anniv-2', text: "Feels like yesterday!", fans: createFanAvatars(5, 'anniv2') },
      { id: 'sc-anniv-3', text: 'Time for a re-watch!', fans: createFanAvatars(3, 'anniv3') },
      { id: 'sc-anniv-4', text: 'Changed my life!', fans: [] },
    ],
  },
  {
    id: 'post-announce-1',
    type: PostType.Announcement,
    author: 'Star Sphere Admin',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    timestamp: '5 days ago',
    content: "Big news, everyone! We're officially launching a fan art competition for the upcoming album. The winning design will be featured on official merchandise and the artist will get to meet the star! Submissions open next week. Get your creative juices flowing!",
    reactions: {
      [ReactionType.Celebrate]: 4100,
    },
    fanzSays: [
      { id: 'sc-announce-1', text: 'This is amazing news! 🎉', fans: createFanAvatars(4, 'announce1') },
      { id: 'sc-announce-2', text: 'So exciting!', fans: createFanAvatars(3, 'announce2') },
      { id: 'sc-announce-3', text: "I'm so participating!", fans: [] },
    ],
  },
  {
    id: 'post-movie-1',
    type: PostType.MovieDetails,
    author: 'Star Sphere Admin',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    timestamp: '6 days ago',
    content: "Dive deep into the film that started it all. 'Chronos Prophecy' remains a fan favorite for its mind-bending plot and incredible performances. What's your favorite theory about the ending?",
    eventDetails: {
      title: "Movie Deep Dive",
    },
    movieDetails: {
      title: 'Chronos Prophecy',
      posterUrl: 'https://picsum.photos/seed/chronos-prophecy-poster/500/750',
      rating: 8.7,
      director: 'Elara Vance',
      cast: ['Leo Starlight', 'Aria Blaze', 'Nova Lux'],
      genres: ['Sci-Fi', 'Thriller', 'Mystery'],
      synopsis: 'A brilliant physicist discovers a way to manipulate time, but his invention falls into the wrong hands, forcing him into a desperate race against the clock to prevent a catastrophic alteration of history.',
    },
    reactions: {
      [ReactionType.Love]: 15000,
    },
    fanzSays: [
      { id: 'sc-movie-1', text: 'An absolute masterpiece! 💯', fans: createFanAvatars(13, 'movie1') },
      { id: 'sc-movie-2', text: 'The ending was brilliant!', fans: createFanAvatars(9, 'movie2') },
      { id: 'sc-movie-3', text: 'Changed the sci-fi game.', fans: createFanAvatars(6, 'movie3') },
      { id: 'sc-movie-4', text: 'A must-watch film.', fans: [] },
    ],
  },
  {
    id: 'post-char-1',
    type: PostType.CharacterIntroduction,
    author: 'Star Sphere Admin',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    timestamp: '7 days ago',
    content: "Let's talk about the enigmatic antagonist from 'Chronos Prophecy'. Ozes Ghambira is more than just a villain; he's a complex character with a tragic backstory. What are your theories about his true motivations?",
    eventDetails: {
      title: "Character Spotlight",
    },
    characterDetails: {
      name: 'Ozes Ghambira',
      imageUrl: 'https://picsum.photos/seed/ozes-ghambira/500/750',
      role: "Antagonist in 'Chronos Prophecy'",
      bio: "A former colleague of the protagonist, Ozes Ghambira was consumed by his ambition to correct a past tragedy. His manipulation of time is driven by a desperate, albeit misguided, desire to rewrite his own history, making him a formidable and sympathetic foe.",
      keyTraits: ['Brilliant', 'Ruthless', 'Obsessed', 'Tragic'],
      firstAppearance: "'Chronos Prophecy' (2019)",
    },
    reactions: {
      [ReactionType.Love]: 9200,
      [ReactionType.Whistle]: 1100,
    },
    fanzSays: [
      { id: 'sc-char-1', text: 'Such a complex character!', fans: createFanAvatars(7, 'char1') },
      { id: 'sc-char-2', text: 'Best villain ever!', fans: createFanAvatars(5, 'char2') },
      { id: 'sc-char-3', text: 'More of a tragic hero.', fans: [] },
    ],
  },
   {
    id: 'post-1',
    type: PostType.Image,
    author: 'Star Sphere Admin',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    timestamp: '8 days ago',
    content: "A stunning shot from the latest photoshoot. The 'Galactic Echoes' era is going to be visually iconic. ✨",
    imageUrl: 'https://picsum.photos/seed/galactic-echoes/800/500',
    reactions: {
      [ReactionType.Love]: 2500,
      [ReactionType.Celebrate]: 1800,
    },
    fanzSays: [
      { id: 'sc-img-1', text: 'Absolutely stunning! 💖', fans: createFanAvatars(2, 'img1') },
      { id: 'sc-img-2', text: 'Just... wow! 🤩', fans: createFanAvatars(1, 'img2') },
      { id: 'sc-img-3', text: 'Iconic is right!', fans: [] },
      { id: 'sc-img-4', text: 'Setting new trends!', fans: [] },
    ],
  },
];

const INITIAL_SUGGESTIONS: Suggestion[] = [
  { id: 'sugg-1', name: 'Galactic Echoes Album', avatar: 'https://picsum.photos/seed/album-topic/200', type: SuggestionType.Topic, isFanned: false },
  { id: 'sugg-2', name: 'Aria Blaze', avatar: 'https://i.pravatar.cc/150?u=aria-blaze', type: SuggestionType.Celeb, isFanned: true },
  { id: 'sugg-3', name: 'Leo Starlight', avatar: 'https://i.pravatar.cc/150?u=leo-starlight', type: SuggestionType.Celeb, isFanned: false },
  { id: 'sugg-4', name: 'World Tour Moments', avatar: 'https://picsum.photos/seed/tour-topic/200', type: SuggestionType.Topic, isFanned: false },
  { id: 'sugg-5', name: 'Behind The Scenes', avatar: 'https://picsum.photos/seed/bts-topic/200', type: SuggestionType.Topic, isFanned: true },
  { id: 'sugg-6', name: 'Nova Lux', avatar: 'https://i.pravatar.cc/150?u=nova-lux', type: SuggestionType.Celeb, isFanned: false },
];


const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [suggestions, setSuggestions] = useState<Suggestion[]>(INITIAL_SUGGESTIONS);
  const [userProfile, setUserProfile] = useState<UserProfileData>({
    name: 'Leo Fan',
    avatar: 'https://i.pravatar.cc/150?u=currentUser',
    favoriteStars: ['Leo Starlight', 'Aria Blaze'],
    favoriteMovies: ['Chronos Prophecy'],
    favoriteGenres: ['Sci-Fi', 'Thriller'],
  });
  const [isUnfanModalOpen, setIsUnfanModalOpen] = useState(false);
  const [suggestionToUnfan, setSuggestionToUnfan] = useState<{ id: string; name: string } | null>(null);
  const [activeView, setActiveView] = useState<'feed' | 'profile' | 'admin'>('feed');
  const [isAdmin] = useState(true); // Dummy admin user
  
  const handleUpdateProfile = useCallback((newProfile: UserProfileData) => {
    setUserProfile(newProfile);
  }, []);

  const { allGenres, allMovies, allStars } = useMemo(() => {
    const genres = new Set<string>();
    const movies = new Set<string>();
    const stars = new Set<string>();

    INITIAL_POSTS.forEach(post => {
      if (post.movieDetails) {
        movies.add(post.movieDetails.title);
        post.movieDetails.genres.forEach(g => genres.add(g));
        post.movieDetails.cast.forEach(c => stars.add(c));
      }
      if (post.filmographyDetails) {
        post.filmographyDetails.forEach(f => movies.add(f.title));
      }
    });

    return {
      allGenres: Array.from(genres),
      allMovies: Array.from(movies),
      allStars: Array.from(stars),
    };
  }, []);

  const handleAddPost = useCallback((postData: Omit<Post, 'id' | 'author' | 'avatar' | 'timestamp' | 'reactions' | 'fanzSays'>) => {
    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: 'Star Sphere Admin',
      avatar: 'https://i.pravatar.cc/150?u=admin',
      timestamp: 'Just now',
      reactions: {},
      fanzSays: [
          { id: `sc-new-${Date.now()}-1`, text: 'This is great!', fans: [] },
          { id: `sc-new-${Date.now()}-2`, text: 'Awesome!', fans: [] },
      ],
      ...postData,
    };
    setPosts(prevPosts => [newPost, ...prevPosts]);
    setActiveView('feed'); // Switch back to feed after posting
  }, []);

  const handleToggleFan = useCallback((suggestionId: string) => {
    setSuggestions(prevSuggestions =>
      prevSuggestions.map(suggestion =>
        suggestion.id === suggestionId
          ? { ...suggestion, isFanned: !suggestion.isFanned }
          : suggestion
      )
    );
  }, []);

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

  const handleReaction = useCallback((postId: string, reactionType: ReactionType) => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          const newReactions = { ...post.reactions };
          newReactions[reactionType] = (newReactions[reactionType] || 0) + 1;
          return { ...post, reactions: newReactions };
        }
        return post;
      })
    );
  }, []);

  const handleFanzSay = useCallback((postId: string, fanzSayId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
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
          return { ...post, fanzSays: newFanzSays };
        }
        return post;
      })
    );
  }, [userProfile.avatar]);

  const fannedSuggestions = useMemo(() => suggestions.filter(s => s.isFanned), [suggestions]);
  
  const interactedPosts = useMemo(() => 
    posts.filter(p => 
      p.fanzSays?.some(fs => fs.fans.includes(userProfile.avatar))
    ), 
    [posts, userProfile.avatar]
  );

  return (
    <>
      <Header 
        activeView={activeView} 
        setActiveView={setActiveView} 
        userAvatar={userProfile.avatar}
        isAdmin={isAdmin}
      />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeView === 'feed' && (
          <>
            <SuggestionCarousel 
              suggestions={suggestions} 
              onToggleFan={handleToggleFan}
              onStartUnfan={handleStartUnfan}
            />

            <div className="space-y-6 mt-6">
              {posts.map(post => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onReaction={handleReaction}
                  onFanzSay={handleFanzSay}
                  currentUserAvatar={userProfile.avatar}
                />
              ))}
            </div>
          </>
        )}
        
        {activeView === 'profile' && (
          <UserProfile
            user={userProfile}
            fannedItems={fannedSuggestions}
            interactedPosts={interactedPosts}
            onToggleFan={handleToggleFan}
            onStartUnfan={handleStartUnfan}
            onReaction={handleReaction}
            onFanzSay={handleFanzSay}
            onUpdateProfile={handleUpdateProfile}
            favoriteOptions={{ genres: allGenres, movies: allMovies, stars: allStars }}
          />
        )}

        {activeView === 'admin' && isAdmin && (
          <AdminPage onAddPost={handleAddPost} />
        )}
      </main>
      
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