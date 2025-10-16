
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Post, ReactionType, Suggestion, SuggestionType, PostType, FanzSay, UserProfileData, HypeLogEntry } from './types';
import Header from './components/Header';
import PostCard from './components/PostCard';
import SuggestionCarousel from './components/SuggestionCarousel';
import Modal from './components/Modal';
import UserProfile from './components/UserProfile';
import AdminPage from './components/AdminPage';
import PostCardSkeleton from './components/PostCardSkeleton';
import ContentModal from './components/ContentModal';
import InFeedSuggestion from './components/InFeedSuggestion';
import MoviePage from './components/MoviePage';

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


const INITIAL_POSTS: Post[] = [
  {
    id: 'post-telugu-project-1',
    type: PostType.ProjectAnnouncement,
    author: 'స్టార్ స్పియర్ అడ్మిన్',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    timestamp: 'ఇప్పుడే',
    content: "అభిమానులారా, సిద్ధంగా ఉండండి! మా తదుపరి భారీ చిత్రం 'కిరీటం' యొక్క అధికారిక ప్రకటన. ఒక పురాణ గాథ మీ ముందుకు రాబోతోంది.",
    eventDetails: {
      title: "కొత్త ప్రాజెక్ట్ ప్రకటన",
    },
    projectAnnouncementDetails: {
      title: "కిరీటం",
      posterUrl: 'https://picsum.photos/seed/kireetam-poster/800/1200',
      status: 'ప్రస్తుతం నిర్మాణంలో ఉంది',
      expectedRelease: '2025 లో వస్తోంది',
      crew: 'దూరదృష్టి గల దర్శకుడు ఎలారా వాన్స్ నుండి',
      logline: 'కాలగర్భంలో కలిసిపోయిన ఒక రాజ్యాన్ని తిరిగి పొందేందుకు ఒక వీరుడు చేసే ప్రయాణం.',
    },
    reactions: {
      [ReactionType.Celebrate]: 18000,
      [ReactionType.Love]: 15000,
    },
    fanzSays: [
      { id: 'sc-telugu-pa-1', text: "అద్భుతం! 🔥", fans: createFanAvatars(18, 'telugu-pa1') },
      { id: 'sc-telugu-pa-2', text: "వేచి ఉండలేము!", fans: createFanAvatars(12, 'telugu-pa2') },
      { id: 'sc-telugu-pa-3', text: 'ఇది బ్లాక్ బస్టర్ అవుతుంది!', fans: createFanAvatars(10, 'telugu-pa3') },
      { id: 'sc-telugu-pa-4', text: 'జై సినిమా!', fans: [] },
    ],
    linkedMovieIds: [MOVIE_KIREETAM_ID],
  },
  {
    id: 'post-telugu-bday-1',
    type: PostType.Birthday,
    author: 'స్టార్ స్పియర్ అడ్మిన్',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    timestamp: '2 గంటల క్రితం',
    content: "మన ప్రియమైన సూపర్ స్టార్ కి పుట్టినరోజు శుభాకాంక్షలు! మీ నటన మరియు కృషి మాకు ఎల్లప్పుడూ స్ఫూర్తినిస్తాయి. మీ శుభాకాంక్షలను క్రింద కామెంట్స్ లో తెలియజేయండి! 🎂",
    eventDetails: {
      title: "హ్యాపీ బర్త్ డే, సూపర్ స్టార్!",
    },
    imageUrl: 'https://picsum.photos/seed/telugu-bday/800/500',
    reactions: {
      [ReactionType.Celebrate]: 22000,
      [ReactionType.Love]: 19500,
    },
    fanzSays: [
      { id: 'sc-telugu-bday-1', text: 'పుట్టినరోజు శుభాకాంక్షలు! 🎉', fans: createFanAvatars(28, 'telugu-bday1') },
      { id: 'sc-telugu-bday-2', text: 'జై రెబెల్ స్టార్!', fans: createFanAvatars(22, 'telugu-bday2') },
      { id: 'sc-telugu-bday-3', text: 'మీరు ఎల్లప్పుడూ బాగుండాలి!', fans: createFanAvatars(15, 'telugu-bday3') },
      { id: 'sc-telugu-bday-4', text: 'స్టే బ్లెస్డ్!', fans: [] },
    ],
    linkedCelebrityIds: [CELEB_TELUGU_SUPERSTAR_ID],
  },
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
      imageUrl: 'https://picsum.photos/seed/goldenglobe/200/200',
      linkedMovieId: MOVIE_CHRONOS_PROPHECY_ID,
      linkedCelebrityId: CELEB_LEO_STARLIGHT_ID,
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
    linkedMovieIds: [MOVIE_CHRONOS_PROPHECY_ID],
    linkedCelebrityIds: [CELEB_LEO_STARLIGHT_ID],
  },
  {
    id: 'post-box-office-1',
    type: PostType.BoxOffice,
    author: 'Star Sphere Admin',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    timestamp: '1 day ago',
    content: "'Chronos Prophecy' continues to dominate, smashing records in its opening weekend! An incredible achievement for the entire team.",
    eventDetails: {
      title: "Weekend Box Office",
    },
    boxOfficeDetails: {
      title: "Chronos Prophecy",
      grossRevenue: 152500000,
      ranking: 1,
      region: "Domestic Weekend",
      sourceUrl: '#',
      linkedMovieId: MOVIE_CHRONOS_PROPHECY_ID,
    },
    reactions: { [ReactionType.Celebrate]: 14000 },
    fanzSays: [
      { id: 'sc-bo-1', text: 'Record breaking! 💰', fans: createFanAvatars(10, 'bo1') },
      { id: 'sc-bo-2', text: 'Absolutely deserved!', fans: createFanAvatars(8, 'bo2') },
    ],
    linkedMovieIds: [MOVIE_CHRONOS_PROPHECY_ID],
  },
  {
    id: 'post-trivia-1',
    type: PostType.Trivia,
    author: 'Star Sphere Admin',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    timestamp: '3 days ago',
    content: "How well do you know Leo Starlight? Here are a few fun facts you might not have known about the superstar!",
    eventDetails: {
      title: "Did You Know?",
    },
    triviaDetails: {
      title: "Leo Starlight Trivia",
      triviaItems: [
        "He is an accomplished painter and has had several gallery showings.",
        "He speaks three languages fluently.",
        "Before acting, he was a trained chef at a Michelin-starred restaurant.",
        "He performed all of his own stunts in 'Chronos Prophecy'."
      ],
      linkedCelebrityId: CELEB_LEO_STARLIGHT_ID,
    },
    reactions: { [ReactionType.Love]: 8900 },
    fanzSays: [
      { id: 'sc-trivia-1', text: 'Wow, I had no idea!', fans: createFanAvatars(7, 'trivia1') },
      { id: 'sc-trivia-2', text: 'So talented!', fans: createFanAvatars(5, 'trivia2') },
    ],
    linkedCelebrityIds: [CELEB_LEO_STARLIGHT_ID],
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
    linkedMovieIds: [MOVIE_AETHELGARDS_LEGACY_ID],
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
    linkedMovieIds: [MOVIE_GALACTIC_ECHOES_ID],
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
      { id: 'film-1', title: 'Chronos Prophecy', year: 2019, posterUrl: 'https://picsum.photos/seed/chronos-prophecy-poster/400/600', linkedMovieId: MOVIE_CHRONOS_PROPHECY_ID },
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
    linkedCelebrityIds: [CELEB_LEO_STARLIGHT_ID],
  },
   {
    id: 'post-celeb-1',
    type: PostType.Celebrity,
    author: 'Star Sphere Admin',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    timestamp: '1 day ago',
    content: "Celebrating a true icon of the silver screen! Let's take a closer look at the career of the legendary Leo Starlight.",
    eventDetails: {
      title: "Celebrity Spotlight",
    },
    celebrityDetails: {
      id: CELEB_LEO_STARLIGHT_ID,
      name: 'Leo Starlight',
      imageUrl: 'https://i.pravatar.cc/150?u=leo-starlight',
      knownFor: 'Actor, Producer, Philanthropist',
      bio: "A versatile actor known for his captivating performances, Leo Starlight has graced the screen for over two decades, winning numerous accolades and the hearts of fans worldwide. His dedication to his craft is matched only by his commitment to environmental causes.",
      notableWorks: ['Chronos Prophecy', 'Crimson Tide', 'Echoes of a Dream', 'Neon Shadows'],
      birthDate: '1974-11-11',
    },
    reactions: {
      [ReactionType.Love]: 22000,
      [ReactionType.Celebrate]: 14000,
    },
    fanzSays: [
      { id: 'sc-celeb-1', text: 'The GOAT! 🐐', fans: createFanAvatars(10, 'celeb1') },
      { id: 'sc-celeb-2', text: 'An inspiration!', fans: createFanAvatars(7, 'celeb2') },
      { id: 'sc-celeb-3', text: 'Legend!', fans: [] },
    ],
  },
   {
    id: 'post-celeb-aria-blaze',
    type: PostType.Celebrity,
    author: 'Star Sphere Admin',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    timestamp: '2 days ago',
    content: "Shining a spotlight on the immensely talented Aria Blaze, whose performance in 'Chronos Prophecy' left us all speechless.",
    eventDetails: { title: "Celebrity Spotlight" },
    celebrityDetails: {
      id: CELEB_ARIA_BLAZE_ID,
      name: 'Aria Blaze',
      imageUrl: 'https://i.pravatar.cc/150?u=aria-blaze',
      knownFor: 'Actress, Singer',
      bio: "Aria Blaze is a powerhouse of talent, known for her dynamic range and emotional depth. She burst onto the scene with her debut album before conquering Hollywood.",
      notableWorks: ['Chronos Prophecy', 'Symphony of Souls'],
      birthDate: '1988-04-21',
    },
    reactions: { [ReactionType.Love]: 18000 },
    fanzSays: [],
  },
  {
    id: 'post-celeb-nova-lux',
    type: PostType.Celebrity,
    author: 'Star Sphere Admin',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    timestamp: '2 days ago',
    content: "Let's appreciate Nova Lux, the unforgettable face of resilience and cunning in 'Chronos Prophecy'.",
    eventDetails: { title: "Celebrity Spotlight" },
    celebrityDetails: {
      id: CELEB_NOVA_LUX_ID,
      name: 'Nova Lux',
      imageUrl: 'https://i.pravatar.cc/150?u=nova-lux',
      knownFor: 'Actor, Director',
      bio: "With a career spanning theatre and film, Nova Lux brings a gravitas to every role. Lux is also an accomplished director, with several award-winning short films to their name.",
      notableWorks: ['Chronos Prophecy', 'The Last Stand'],
      birthDate: '1981-09-15',
    },
    reactions: { [ReactionType.Love]: 16500 },
    fanzSays: [],
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
    linkedCelebrityIds: [CELEB_LEO_STARLIGHT_ID],
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
    linkedMovieIds: [MOVIE_GALACTIC_ECHOES_ID],
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
    linkedMovieIds: [MOVIE_CHRONOS_PROPHECY_ID],
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
    linkedMovieIds: [MOVIE_GALACTIC_ECHOES_ID],
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
      id: MOVIE_CHRONOS_PROPHECY_ID,
      title: 'Chronos Prophecy',
      type: 'TV Series',
      posterUrl: 'https://picsum.photos/seed/chronos-prophecy-poster/500/750',
      rating: 8.7,
      releaseDate: '2019-10-17',
      director: 'Elara Vance',
      cast: ['Leo Starlight', 'Aria Blaze', 'Nova Lux'],
      genres: ['Sci-Fi', 'Thriller', 'Mystery'],
      synopsis: 'A brilliant physicist discovers a way to manipulate time, but his invention falls into the wrong hands, forcing him into a desperate race against the clock to prevent a catastrophic alteration of history. The series follows his journey through different timelines to restore order.',
      country: 'United States',
      language: 'English',
      productionCompanies: ['Starlight Productions', 'Quantum Films'],
      fullCast: [
        { name: 'Leo Starlight', role: 'Dr. Aris Thorne', imageUrl: 'https://i.pravatar.cc/150?u=leo-starlight', linkedCelebrityId: CELEB_LEO_STARLIGHT_ID },
        { name: 'Aria Blaze', role: 'Dr. Lena Petrova', imageUrl: 'https://i.pravatar.cc/150?u=aria-blaze', linkedCelebrityId: CELEB_ARIA_BLAZE_ID },
        { name: 'Nova Lux', role: 'General Eva Rostova', imageUrl: 'https://i.pravatar.cc/150?u=nova-lux', linkedCelebrityId: CELEB_NOVA_LUX_ID },
        { name: 'Silas Croft', role: 'Ozes Ghambira', imageUrl: 'https://i.pravatar.cc/150?u=silas-croft' },
        { name: 'Jaxon Kade', role: 'Commander Valerius', imageUrl: 'https://i.pravatar.cc/150?u=jaxon-kade' },
        { name: 'Lyra Solstice', role: 'The Oracle', imageUrl: 'https://i.pravatar.cc/150?u=lyra-solstice' },
        { name: 'Orion Pax', role: 'Technician First Class', imageUrl: 'https://i.pravatar.cc/150?u=orion-pax' },
        { name: 'Seraphina Moon', role: 'Archivist', imageUrl: 'https://i.pravatar.cc/150?u=seraphina-moon' },
        { name: 'Kaelen', role: 'Temporal Guard', imageUrl: 'https://i.pravatar.cc/150?u=kaelen' },
        { name: 'Rylan', role: 'Temporal Guard', imageUrl: 'https://i.pravatar.cc/150?u=rylan' },
      ],
      crew: [
        { name: 'Elara Vance', role: 'Director', imageUrl: 'https://i.pravatar.cc/150?u=elara-vance' },
        { name: 'Kaelen', role: 'Writer', imageUrl: 'https://i.pravatar.cc/150?u=kaelen' },
        { name: 'Seraphina Moon', role: 'Producer', imageUrl: 'https://i.pravatar.cc/150?u=seraphina-moon' },
        { name: 'Orion Pax', role: 'Cinematographer', imageUrl: 'https://i.pravatar.cc/150?u=orion-pax' },
        { name: 'Lyra Solstice', role: 'Composer', imageUrl: 'https://i.pravatar.cc/150?u=lyra-solstice' },
      ],
    },
    episodes: [
        { season: 1, episodeNumber: 1, title: 'The Anomaly', synopsis: 'Dr. Aris Thorne first discovers a temporal anomaly that could change the world.', thumbnailUrl: 'https://picsum.photos/seed/cp-s1e1/400/225' },
        { season: 1, episodeNumber: 2, title: 'Ripples in Time', synopsis: 'The consequences of the first experiment begin to unfold in unexpected ways.', thumbnailUrl: 'https://picsum.photos/seed/cp-s1e2/400/225' },
        { season: 1, episodeNumber: 3, title: 'The Ghambira Gambit', synopsis: 'Ozes Ghambira reveals his own plans for the technology, setting up a confrontation.', thumbnailUrl: 'https://picsum.photos/seed/cp-s1e3/400/225' },
        { season: 1, episodeNumber: 4, title: 'Point of No Return', synopsis: 'Aris must make a choice that will either save the timeline or shatter it forever.', thumbnailUrl: 'https://picsum.photos/seed/cp-s1e4/400/225' },
    ],
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
      linkedMovieId: MOVIE_CHRONOS_PROPHECY_ID,
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
    linkedMovieIds: [MOVIE_CHRONOS_PROPHECY_ID],
    linkedCelebrityIds: [CELEB_LEO_STARLIGHT_ID, CELEB_ARIA_BLAZE_ID, CELEB_NOVA_LUX_ID],
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
    linkedMovieIds: [MOVIE_GALACTIC_ECHOES_ID],
  },
];

const INITIAL_SUGGESTIONS: Suggestion[] = [
  { id: 'sugg-1', name: 'Galactic Echoes Album', avatar: 'https://picsum.photos/seed/album-topic/200', type: SuggestionType.Topic, isFanned: false, linkedId: MOVIE_GALACTIC_ECHOES_ID },
  { id: 'sugg-2', name: 'Aria Blaze', avatar: 'https://i.pravatar.cc/150?u=aria-blaze', type: SuggestionType.Celeb, isFanned: true, linkedId: CELEB_ARIA_BLAZE_ID },
  { id: 'sugg-3', name: 'Leo Starlight', avatar: 'https://i.pravatar.cc/150?u=leo-starlight', type: SuggestionType.Celeb, isFanned: false, linkedId: CELEB_LEO_STARLIGHT_ID },
  { id: 'sugg-4', name: 'World Tour Moments', avatar: 'https://picsum.photos/seed/tour-topic/200', type: SuggestionType.Topic, isFanned: false },
  { id: 'sugg-5', name: 'Behind The Scenes', avatar: 'https://picsum.photos/seed/bts-topic/200', type: SuggestionType.Topic, isFanned: true },
  { id: 'sugg-6', name: 'Nova Lux', avatar: 'https://i.pravatar.cc/150?u=nova-lux', type: SuggestionType.Celeb, isFanned: false, linkedId: CELEB_NOVA_LUX_ID },
];


const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<Suggestion[]>(INITIAL_SUGGESTIONS);
  const [userProfile, setUserProfile] = useState<UserProfileData>({
    name: 'Leo Fan',
    avatar: 'https://i.pravatar.cc/150?u=currentUser',
    favoriteStars: ['Leo Starlight', 'Aria Blaze'],
    favoriteMovies: ['Chronos Prophecy'],
    favoriteGenres: ['Sci-Fi', 'Thriller'],
  });
  const [isUnfanModalOpen, setIsUnfanModalOpen] = useState(false);
  const [activePost, setActivePost] = useState<Post | null>(null);
  const [activeMovieId, setActiveMovieId] = useState<string | null>(null);
  const [suggestionToUnfan, setSuggestionToUnfan] = useState<{ id: string; name: string } | null>(null);
  const [activeView, setActiveView] = useState<'feed' | 'profile' | 'admin' | 'favorites'>('feed');
  const [isAdmin] = useState(true); // Dummy admin user
  
  const [userHypeState, setUserHypeState] = useState({ count: 3, lastReset: new Date().toISOString() });
  const [hypeLog, setHypeLog] = useState<HypeLogEntry[]>([]);

  useEffect(() => {
    // Simulate fetching posts from an API
    const timer = setTimeout(() => {
      setPosts(INITIAL_POSTS);
      setIsLoading(false);
    }, 1500); // 1.5 second delay

    return () => clearTimeout(timer);
  }, []);

  // Sync active post in modal with the main posts list
  useEffect(() => {
    if (activePost) {
      const updatedPost = posts.find(p => p.id === activePost.id);
      if (updatedPost && JSON.stringify(updatedPost) !== JSON.stringify(activePost)) {
        setActivePost(updatedPost);
      } else if (!updatedPost) {
        // Post was deleted, close the modal
        setActivePost(null);
      }
    }
  }, [posts, activePost]);


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
  
  const handleViewMoviePage = useCallback((movieId: string) => {
    setActiveMovieId(movieId);
    setActivePost(null); // Close modal if open
    window.scrollTo(0, 0);
  }, []);

  const handleCloseMoviePage = useCallback(() => {
    setActiveMovieId(null);
  }, []);

  const handleViewPost = useCallback((post: Post) => {
    if (post.type === PostType.MovieDetails && post.movieDetails) {
      handleViewMoviePage(post.movieDetails.id);
    } else {
      setActivePost(post);
    }
  }, [handleViewMoviePage]);

  const handleAddPost = useCallback((postData: Omit<Post, 'id' | 'author' | 'avatar' | 'timestamp'>) => {
    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: 'Star Sphere Admin',
      avatar: 'https://i.pravatar.cc/150?u=admin',
      timestamp: 'Just now',
      ...postData,
    };
    setPosts(prevPosts => [newPost, ...prevPosts]);
  }, []);
  
  const handleUpdatePost = useCallback((updatedPost: Post) => {
    setPosts(prevPosts =>
      prevPosts.map(p => (p.id === updatedPost.id ? { ...updatedPost, timestamp: 'Edited' } : p))
    );
  }, []);

  const handleDeletePost = useCallback((postId: string) => {
    setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
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

  const handleHype = useCallback((movieId: string) => {
    const now = new Date();
    const lastResetDate = new Date(userHypeState.lastReset);

    // Get the last Monday. 0=Sun, 1=Mon, ..., 6=Sat
    const todayDay = now.getDay();
    const daysSinceMonday = todayDay === 0 ? 6 : todayDay - 1;
    const lastMonday = new Date(now);
    lastMonday.setDate(now.getDate() - daysSinceMonday);
    lastMonday.setHours(0, 0, 0, 0);

    let newCount = userHypeState.count;
    let newResetDate = userHypeState.lastReset;

    if (lastResetDate < lastMonday) {
        newCount = 3; // Reset hypes
        newResetDate = now.toISOString();
    }

    if (newCount > 0) {
        newCount--;
        // In a real app, this action would be sent to a server.
        console.log(`Hyped movie ${movieId}! Hypes left this week: ${newCount}`);
        setHypeLog(prevLog => [...prevLog, { movieId, timestamp: new Date().toISOString() }]);
    } else {
        console.log("No hypes left for this week.");
        return; // Don't update state if no hypes left
    }

    setUserHypeState({
        count: newCount,
        lastReset: newResetDate,
    });
  }, [userHypeState]);

  const fannedSuggestions = useMemo(() => suggestions.filter(s => s.isFanned), [suggestions]);
  
  const interactedPosts = useMemo(() => 
    posts.filter(p => 
      p.fanzSays?.some(fs => fs.fans.includes(userProfile.avatar))
    ), 
    [posts, userProfile.avatar]
  );
  
  const unfannedSuggestions = useMemo(() => suggestions.filter(s => !s.isFanned), [suggestions]);

  const feedItems = useMemo(() => {
    const items: (Post | { type: 'suggestion'; suggestion: Suggestion })[] = [];
    let suggestionIndex = 0;
    posts.forEach((post, index) => {
        items.push(post);
        // Inject a suggestion every 4 posts, if available
        if ((index + 1) % 4 === 0 && suggestionIndex < unfannedSuggestions.length) {
            items.push({
                type: 'suggestion',
                suggestion: unfannedSuggestions[suggestionIndex],
            });
            suggestionIndex++;
        }
    });
    return items;
  }, [posts, unfannedSuggestions]);

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

  return (
    <>
      <Header 
        activeView={activeView} 
        setActiveView={setActiveView} 
        userAvatar={userProfile.avatar}
        isAdmin={isAdmin}
      />
      
      {activeMovieId ? (
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
        />
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 sm:pb-6">
          {activeView === 'feed' && (
            <div className="max-w-2xl mx-auto">
              {unfannedSuggestions.length > 0 && (
                <SuggestionCarousel 
                  suggestions={unfannedSuggestions} 
                  onToggleFan={handleToggleFan}
                  onStartUnfan={handleStartUnfan}
                />
              )}

              <div className="space-y-6 mt-6">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => <PostCardSkeleton key={index} />)
                ) : (
                  feedItems.map((item) => {
                    if ('id' in item) { // It's a Post
                      return (
                        <PostCard 
                          key={item.id} 
                          post={item} 
                          onReaction={handleReaction}
                          onFanzSay={handleFanzSay}
                          currentUserAvatar={userProfile.avatar}
                          onViewFullPost={handleViewPost}
                          onViewMoviePage={handleViewMoviePage}
                        />
                      );
                    } else { // It's a suggestion
                      return (
                        <InFeedSuggestion 
                          key={`sugg-feed-${item.suggestion.id}`} 
                          suggestion={item.suggestion} 
                          onToggleFan={handleToggleFan}
                        />
                      );
                    }
                  })
                )}
              </div>
            </div>
          )}
          
          {activeView === 'favorites' && (
            <div className="max-w-2xl mx-auto">
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
            </div>
          )}

          {activeView === 'profile' && (
            <div className="max-w-2xl mx-auto">
              <UserProfile
                user={userProfile}
                fannedItems={fannedSuggestions}
                interactedPosts={interactedPosts}
                // FIX: Pass the correct handler for onToggleFan. `handleStartUnfan` has the wrong signature. `handleToggleFan` is correct.
                onToggleFan={handleToggleFan}
                onStartUnfan={handleStartUnfan}
                onReaction={handleReaction}
                onFanzSay={handleFanzSay}
                onUpdateProfile={handleUpdateProfile}
                favoriteOptions={{ genres: allGenres, movies: allMovies, stars: allStars }}
                onViewFullPost={handleViewPost}
                onViewMoviePage={handleViewMoviePage}
              />
            </div>
          )}

          {activeView === 'admin' && isAdmin && (
            <AdminPage 
              posts={posts}
              onAddPost={handleAddPost}
              onUpdatePost={handleUpdatePost}
              onDeletePost={handleDeletePost}
            />
          )}
        </main>
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

      {activePost && (
        <ContentModal 
          post={activePost}
          onClose={() => setActivePost(null)}
          onReaction={handleReaction}
          onFanzSay={handleFanzSay}
          currentUserAvatar={userProfile.avatar}
          onViewMoviePage={handleViewMoviePage}
        />
      )}
    </>
  );
};

export default App;