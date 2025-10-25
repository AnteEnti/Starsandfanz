import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Post, Suggestion, SuggestionType, PostType, FanzSay, UserProfileData, HypeLogEntry, Reaction, Banner, SiteSettings, ProjectStatus, Person, ProjectRelationshipType, MovieDetails, CelebrityDetails } from './types';
import { loadSiteSettings, saveSiteSettings } from './utils/siteSettings';
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


const INITIAL_POSTS: Post[] = [
  {
    id: 'post-telugu-project-1',
    type: PostType.ProjectAnnouncement,
    author: 'ఫ్యాన్జ్ అడ్డా అడ్మిన్',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    timestamp: 'ఇప్పుడే',
    content: "అభిమానులారా, సిద్ధంగా ఉండండి! మా తదుపరి భారీ చిత్రం 'కిరీటం' యొక్క అధికారిక ప్రకటన. ఒక పురాణ గాథ మీ ముందుకు రాబోతోంది.",
    eventDetails: {
      title: "కొత్త ప్రాజెక్ట్ ప్రకటన",
    },
    projectAnnouncementDetails: {
      title: "కిరీటం",
      posterUrl: 'https://picsum.photos/seed/kireetam-poster/800/1200',
      status: ProjectStatus.InProduction,
      expectedRelease: '2025 లో వస్తోంది',
      crew: [{ name: 'Elara Vance', role: 'Director', imageUrl: 'https://i.pravatar.cc/150?u=elara-vance', linkedCelebrityId: CELEB_ELARA_VANCE_ID }],
      cast: [{ name: 'Telugu Superstar', role: 'Lead', imageUrl: 'https://i.pravatar.cc/150?u=telugu-superstar', linkedCelebrityId: CELEB_TELUGU_SUPERSTAR_ID }],
      logline: 'కాలగర్భంలో కలిసిపోయిన ఒక రాజ్యాన్ని తిరిగి పొందేందుకు ఒక వీరుడు చేసే ప్రయాణం.',
    },
    reactionsEnabled: true,
    reactions: [
      { id: 'celebrate', emoji: '🎉', count: 18000 },
      { id: 'love', emoji: '❤️', count: 15000 },
      { id: 'points', emoji: '⭐', count: 9503 },
    ],
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
    author: 'ఫ్యాన్జ్ అడ్డా అడ్మిన్',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    timestamp: '2 గంటల క్రితం',
    content: "మన ప్రియమైన సూపర్ స్టార్ కి పుట్టినరోజు శుభాకాంక్షలు! మీ నటన మరియు కృషి మాకు ఎల్లప్పుడూ స్ఫూర్తినిస్తాయి. మీ శుభాకాంక్షలను క్రింద కామెంట్స్ లో తెలియజేయండి! 🎂",
    eventDetails: {
      title: "హ్యాపీ బర్త్ డే, సూపర్ స్టార్!",
    },
    imageUrl: 'https://picsum.photos/seed/telugu-bday/800/500',
    reactionsEnabled: true,
    reactions: [
      { id: 'celebrate', emoji: '🎉', count: 22000 },
      { id: 'love', emoji: '❤️', count: 19503 },
      { id: 'points', emoji: '⭐', count: 12100 },
    ],
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
    author: 'Fanz Adda Admin',
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
    reactionsEnabled: true,
    reactions: [
        { id: 'celebrate', emoji: '🎉', count: 25000 },
        { id: 'love', emoji: '❤️', count: 18000 },
        { id: 'points', emoji: '⭐', count: 15200 },
    ],
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
    author: 'Fanz Adda Admin',
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
    reactionsEnabled: true,
    reactions: [
        { id: 'celebrate', emoji: '🎉', count: 14000 },
        { id: 'points', emoji: '⭐', count: 7800 },
    ],
    fanzSays: [
      { id: 'sc-bo-1', text: 'Record breaking! 💰', fans: createFanAvatars(10, 'bo1') },
      { id: 'sc-bo-2', text: 'Absolutely deserved!', fans: createFanAvatars(8, 'bo2') },
    ],
    linkedMovieIds: [MOVIE_CHRONOS_PROPHECY_ID],
  },
  {
    id: 'post-trivia-1',
    type: PostType.Trivia,
    author: 'Fanz Adda Admin',
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
    reactionsEnabled: true,
    reactions: [
        { id: 'love', emoji: '❤️', count: 8900 },
        { id: 'points', emoji: '⭐', count: 6720 },
    ],
    fanzSays: [
      { id: 'sc-trivia-1', text: 'Wow, I had no idea!', fans: createFanAvatars(7, 'trivia1') },
      { id: 'sc-trivia-2', text: 'So talented!', fans: createFanAvatars(5, 'trivia2') },
    ],
    linkedCelebrityIds: [CELEB_LEO_STARLIGHT_ID],
  },
   {
    id: 'post-project-announce-1',
    type: PostType.ProjectAnnouncement,
    author: 'Fanz Adda Admin',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    timestamp: '4 hours ago',
    content: "The next saga begins! We are thrilled to announce 'Aethelgard's Legacy', a new epic adventure currently in production. Get ready for a journey into a world of myth and legend.",
    eventDetails: {
      title: "New Project Announcement",
    },
    projectAnnouncementDetails: {
      title: "Aethelgard's Legacy",
      posterUrl: 'https://picsum.photos/seed/aethelgard-poster/800/1200',
      status: ProjectStatus.InProduction,
      expectedRelease: 'Coming 2025',
      crew: [{ name: 'Elara Vance', role: 'Director', imageUrl: 'https://i.pravatar.cc/150?u=elara-vance', linkedCelebrityId: CELEB_ELARA_VANCE_ID }],
      cast: [
        { name: 'Leo Starlight', role: 'Lead', imageUrl: 'https://i.pravatar.cc/150?u=leo-starlight', linkedCelebrityId: CELEB_LEO_STARLIGHT_ID },
        { name: 'Aria Blaze', role: 'Co-Lead', imageUrl: 'https://i.pravatar.cc/150?u=aria-blaze', linkedCelebrityId: CELEB_ARIA_BLAZE_ID }
      ],
      logline: 'In a land forgotten by time, a hero must rise to reclaim a stolen birthright.',
      relationship: {
        type: ProjectRelationshipType.Universe,
        relatedMovieId: MOVIE_CHRONOS_PROPHECY_ID,
      }
    },
    reactionsEnabled: true,
    reactions: [
        { id: 'celebrate', emoji: '🎉', count: 15000 },
        { id: 'love', emoji: '❤️', count: 12000 },
        { id: 'points', emoji: '⭐', count: 8800 },
    ],
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
    author: 'Fanz Adda Admin',
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
    reactionsEnabled: true,
    reactions: [
        { id: 'celebrate', emoji: '🎉', count: 9800 },
        { id: 'points', emoji: '⭐', count: 5100 },
    ],
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
    author: 'Fanz Adda Admin',
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
    reactionsEnabled: true,
    reactions: [
        { id: 'love', emoji: '❤️', count: 11000 },
        { id: 'points', emoji: '⭐', count: 8300 },
    ],
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
    author: 'Fanz Adda Admin',
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
    reactionsEnabled: true,
    reactions: [
        { id: 'love', emoji: '❤️', count: 22000 },
        { id: 'celebrate', emoji: '🎉', count: 14000 },
        { id: 'points', emoji: '⭐', count: 19800 },
    ],
    fanzSays: [
      { id: 'sc-celeb-1', text: 'The GOAT! 🐐', fans: createFanAvatars(10, 'celeb1') },
      { id: 'sc-celeb-2', text: 'An inspiration!', fans: createFanAvatars(7, 'celeb2') },
      { id: 'sc-celeb-3', text: 'Legend!', fans: [] },
    ],
  },
   {
    id: 'post-celeb-aria-blaze',
    type: PostType.Celebrity,
    author: 'Fanz Adda Admin',
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
    reactionsEnabled: true,
    reactions: [
        { id: 'love', emoji: '❤️', count: 18000 },
        { id: 'points', emoji: '⭐', count: 11000 },
    ],
    fanzSays: [],
  },
  {
    id: 'post-celeb-nova-lux',
    type: PostType.Celebrity,
    author: 'Fanz Adda Admin',
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
    reactionsEnabled: true,
    reactions: [
        { id: 'love', emoji: '❤️', count: 16500 },
        { id: 'points', emoji: '⭐', count: 9500 },
    ],
    fanzSays: [],
  },
  {
    id: 'post-bday-1',
    type: PostType.Birthday,
    author: 'Fanz Adda Admin',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    timestamp: '2 days ago',
    content: "Wishing the happiest of birthdays to the one and only! Your talent and dedication inspire us all every day. Drop your birthday wishes in the comments below! 🎂",
    eventDetails: {
      title: "Happy Birthday, Leo Starlight!",
    },
    reactionsEnabled: true,
    reactions: [
        { id: 'celebrate', emoji: '🎉', count: 12000 },
        { id: 'love', emoji: '❤️', count: 8500 },
        { id: 'points', emoji: '⭐', count: 10500 },
    ],
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
    author: 'Fanz Adda Admin',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    timestamp: '3 days ago',
    content: "The wait is almost over! Check out the official trailer for 'Galactic Echoes'. We are speechless. What scene are you most excited about?! 🚀",
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?&autoplay=1&mute=1&controls=0',
    videoDuration: 212, // Rick Astley song duration
    reactionsEnabled: true,
    reactions: [
        { id: 'love', emoji: '❤️', count: 5600 },
        { id: 'whistle', emoji: '🥳', count: 3200 },
        { id: 'points', emoji: '⭐', count: 4900 },
    ],
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
    author: 'Fanz Adda Admin',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    timestamp: '4 days ago',
    content: "Can you believe it's been 5 years since 'Chronos Prophecy' hit the theaters? A timeless masterpiece! Share your favorite quote from the movie! 🎬",
    imageUrl: 'https://picsum.photos/seed/chronos-prophecy/800/500',
    eventDetails: {
      title: "Chronos Prophecy",
      subtitle: "5th Anniversary",
    },
    reactionsEnabled: true,
    reactions: [
        { id: 'love', emoji: '❤️', count: 7800 },
        { id: 'points', emoji: '⭐', count: 6200 },
    ],
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
    author: 'Fanz Adda Admin',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    timestamp: '5 days ago',
    content: "Big news, everyone! We're officially launching a fan art competition for the upcoming album. The winning design will be featured on official merchandise and the artist will get to meet the star! Submissions open next week. Get your creative juices flowing!",
    reactionsEnabled: true,
    reactions: [
        { id: 'celebrate', emoji: '🎉', count: 4100 },
        { id: 'points', emoji: '⭐', count: 2500 },
    ],
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
    author: 'Fanz Adda Admin',
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
    reactionsEnabled: true,
    reactions: [
        { id: 'love', emoji: '❤️', count: 15000 },
        { id: 'points', emoji: '⭐', count: 11500 },
    ],
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
    author: 'Fanz Adda Admin',
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
      linkedCelebrityId: CELEB_LEO_STARLIGHT_ID,
    },
    reactionsEnabled: true,
    reactions: [
        { id: 'love', emoji: '❤️', count: 9200 },
        { id: 'whistle', emoji: '🥳', count: 1100 },
        { id: 'points', emoji: '⭐', count: 7300 },
    ],
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
    author: 'Fanz Adda Admin',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    timestamp: '8 days ago',
    content: "A stunning shot from the latest photoshoot. The 'Galactic Echoes' era is going to be visually iconic. ✨",
    imageUrl: 'https://picsum.photos/seed/galactic-echoes/800/500',
    reactionsEnabled: true,
    reactions: [
        { id: 'love', emoji: '❤️', count: 2500 },
        { id: 'celebrate', emoji: '🎉', count: 1800 },
        { id: 'points', emoji: '⭐', count: 3450 },
    ],
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

type ActiveView = 'feed' | 'profile' | 'admin' | 'favorites' | 'about' | 'terms' | 'contact' | 'disclaimer';

interface NavItem {
  id: ActiveView;
  label: string;
  icon: string;
}

const MAX_HYPE_LEVEL = 100;
const CELEBRATION_DURATION = 30000; // 30 seconds

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
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [activeMovieId, setActiveMovieId] = useState<string | null>(null);
  const [activeCelebrityId, setActiveCelebrityId] = useState<string | null>(null);
  const [suggestionToUnfan, setSuggestionToUnfan] = useState<{ id: string; name: string } | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>('feed');
  const [isAdmin] = useState(true); // Dummy admin user
  
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
      // Must be manually activated
      if (!b.isActive) return false;

      const startDate = b.startDate ? new Date(b.startDate) : null;
      const endDate = b.endDate ? new Date(b.endDate) : null;

      // Check if the current time is within the banner's active period
      if (startDate && now < startDate) return false; // Not started yet
      if (endDate && now > endDate) return false;   // Expired

      const targeting = b.targeting;
      if (targeting) {
         // Device targeting check
         if (targeting.device === 'desktop' && isMobile) return false;
         if (targeting.device === 'mobile' && !isMobile) return false;

         // Login status check (assuming user is always logged in for this demo)
         if (targeting.loggedInStatus === 'loggedOut') return false;
         // In a real app, you would check the opposite:
         // if (targeting.loggedInStatus === 'loggedIn' && !isUserLoggedIn) return false;
      }

      return true; // All checks passed
    });
  }, [banners]);
  
  const [isWelcomeBannerVisible, setIsWelcomeBannerVisible] = useState(!!activeBanner);
  const [isBannerMinimized, setIsBannerMinimized] = useState(false);

  useEffect(() => {
    // Simulate fetching posts from an API
    const timer = setTimeout(() => {
      setPosts(INITIAL_POSTS);
      setIsLoading(false);
    }, 1500); // 1.5 second delay

    return () => clearTimeout(timer);
  }, []);

  // Apply site settings on load and on change
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

  // Handle scroll for banner minimization
  useEffect(() => {
    // This effect should only trigger minimization once on scroll down,
    // and not re-open the banner on scroll up.
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

  // Effect for header shrink on scroll
  useEffect(() => {
    const handleHeaderScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Only attach scroll listener if no full-page view is active
    if (activeMovieId || activeCelebrityId || activePostId) {
      setIsScrolled(false); // Reset on page open
      return; // Don't attach listener
    }

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleHeaderScroll);
    };
  }, [activeMovieId, activeCelebrityId, activePostId]);
  
    // Effect to add/remove body class for Celebration Mode
  useEffect(() => {
    if (isCelebrationModeActive) {
      document.body.classList.add('celebration-mode');
    } else {
      document.body.classList.remove('celebration-mode');
    }
    // Cleanup on unmount
    return () => document.body.classList.remove('celebration-mode');
  }, [isCelebrationModeActive]);

  // Effect to handle the Celebration Mode timer
  useEffect(() => {
    if (isCelebrationModeActive) {
      const timer = setTimeout(() => {
        setIsCelebrationModeActive(false);
        setHypeLevel(0); // Reset the meter
      }, CELEBRATION_DURATION);
      return () => clearTimeout(timer); // Cleanup timer if component unmounts
    }
  }, [isCelebrationModeActive]);


  const handleReopenBanner = useCallback(() => {
    setIsBannerMinimized(false);
    // Scroll to top for a smooth experience
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);


  const handleUpdateProfile = useCallback((newProfile: UserProfileData) => {
    setUserProfile(newProfile);
  }, []);

  const handleUpdateBanners = useCallback((newBanners: Banner[]) => {
    setBanners(newBanners);
  }, []);

  const handleUpdateSiteSettings = useCallback((newSettings: SiteSettings) => {
    saveSiteSettings(newSettings);
    setSiteSettings(newSettings); // This will trigger the useEffect above to apply changes
  }, []);

  const { allGenres, allMovies, allStars, allCelebrities, moviesMap, celebritiesMap } = useMemo(() => {
    const genres = new Set<string>();
    const movies = new Map<string, string>();
    const stars = new Set<string>();
    const celebrities = new Map<string, string>();
    const moviesMap = new Map<string, MovieDetails>();
    const celebritiesMap = new Map<string, CelebrityDetails>();

    INITIAL_POSTS.forEach(post => {
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
  }, []);
  
  const handleViewMoviePage = useCallback((movieId: string) => {
    setActiveMovieId(movieId);
    setActiveCelebrityId(null);
    setActivePostId(null);
    setActiveView('feed'); // Ensure we are not on a static page
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
    // 1. Handle direct entity post types
    if (post.type === PostType.MovieDetails && post.movieDetails) {
      handleViewMoviePage(post.movieDetails.id);
      return;
    }
    if (post.type === PostType.Celebrity && post.celebrityDetails) {
      handleViewCelebrityPage(post.celebrityDetails.id);
      return;
    }
    // A Project Announcement is effectively a "pre-movie" page
    if (post.type === PostType.ProjectAnnouncement && post.linkedMovieIds?.length === 1) {
      handleViewMoviePage(post.linkedMovieIds[0]);
      return;
    }

    // 2. For other post types, check for unambiguous links
    const hasOneMovie = post.linkedMovieIds?.length === 1;
    const hasOneCeleb = post.linkedCelebrityIds?.length === 1;

    // If it's clearly about one movie, go there
    if (hasOneMovie && !hasOneCeleb) {
      handleViewMoviePage(post.linkedMovieIds![0]);
      return;
    }

    // If it's clearly about one celebrity, go there
    if (hasOneCeleb && !hasOneMovie) {
      handleViewCelebrityPage(post.linkedCelebrityIds![0]);
      return;
    }
    
    // 3. Fallback for ambiguous posts (e.g., linked to both a movie and celeb) 
    // or posts with no links (e.g., generic announcement).
    setActivePostId(post.id);
    setActiveMovieId(null);
    setActiveCelebrityId(null);
    setActiveView('feed');
    window.scrollTo(0, 0);
  }, [handleViewMoviePage, handleViewCelebrityPage]);

  const handleClosePostPage = useCallback(() => {
    setActivePostId(null);
  }, []);

  const handleAddPost = useCallback((postData: Omit<Post, 'id' | 'author' | 'avatar' | 'timestamp'>) => {
    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: 'Fanz Adda Admin',
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
  
  const handleToggleFavoriteMovie = useCallback((movieTitle: string) => {
    setUserProfile(prevProfile => {
      const isAlreadyFavorite = prevProfile.favoriteMovies.includes(movieTitle);
      const newFavoriteMovies = isAlreadyFavorite
        ? prevProfile.favoriteMovies.filter(title => title !== movieTitle)
        : [...prevProfile.favoriteMovies, movieTitle];
      
      return { ...prevProfile, favoriteMovies: newFavoriteMovies };
    });
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
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId && post.reactions) {
          const newReactions = post.reactions.map(reaction => {
            if (reaction.id === reactionId) {
              return { ...reaction, count: reaction.count + 1 };
            }
            return reaction;
          });
          return { ...post, reactions: newReactions };
        }
        return post;
      })
    );
    incrementHype();
  }, [incrementHype]);

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
    incrementHype();
  }, [userProfile.avatar, incrementHype]);

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
        setHypeLog(prevLog => [...prevLog, { movieId, timestamp: new Date().toISOString() }]);
    } else {
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

  // Create a memoized map of all celebrity names to their avatars for efficient lookup.
  const celebrityAvatarMap = useMemo(() => {
    const celebAvatars = new Map<string, string>();

    // Source avatars from suggestions first
    INITIAL_SUGGESTIONS.forEach(sugg => {
      if (sugg.type === SuggestionType.Celeb && sugg.name && sugg.avatar) {
        celebAvatars.set(sugg.name, sugg.avatar);
      }
    });

    // Then, source from celebrity-specific posts, adding any not already present.
    // This ensures the map is as comprehensive as possible.
    INITIAL_POSTS.forEach(post => {
      if (post.type === PostType.Celebrity && post.celebrityDetails) {
        if (!celebAvatars.has(post.celebrityDetails.name)) {
            celebAvatars.set(post.celebrityDetails.name, post.celebrityDetails.imageUrl);
        }
      }
    });

    return celebAvatars;
  }, []); // Empty dependency array as posts/suggestions are constant and don't change.

  // Use the map to dynamically get the avatars for the user's currently favorited stars.
  // This list will automatically update when the user's profile changes.
  const favoriteStarAvatars = useMemo(() => {
    return userProfile.favoriteStars
      .map(starName => celebrityAvatarMap.get(starName))
      .filter((avatar): avatar is string => !!avatar); // Filter out any stars not found in the map
  }, [userProfile.favoriteStars, celebrityAvatarMap]);
  
  const navItems: NavItem[] = useMemo(() => [
    { id: 'feed', label: 'Feed', icon: 'home' },
    { id: 'favorites', label: 'Favorites', icon: 'favorite' },
    { id: 'profile', label: 'Profile', icon: 'person' },
    ...(isAdmin ? [{ id: 'admin', label: 'Admin', icon: 'admin_panel_settings' } as const] : []),
  ], [isAdmin]);

  const getDesktopTabStyle = (view: ActiveView) => {
    const baseStyle = "px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800";
    if (activeView === view) {
      return `${baseStyle} bg-purple-600 text-white`;
    }
    return `${baseStyle} text-slate-300 hover:bg-slate-700`;
  };
  
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
                {unfannedSuggestions.length > 0 && (
                  <SuggestionCarousel
                    suggestions={unfannedSuggestions}
                    onToggleFan={handleToggleFan}
                    onStartUnfan={handleStartUnfan}
                    onViewCelebrityPage={handleViewCelebrityPage}
                  />
                )}

                <div className="space-y-6 mt-6">
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <PostCardSkeleton key={index} />
                    ))
                  ) : (
                    posts.map((post) => (
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
                    ))
                  )}
                </div>
              </div>
            )}
            
            {activeView === 'favorites' && (
              <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
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
              </div>
            )}

            {activeView === 'profile' && (
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

            {activeView === 'admin' && isAdmin && (
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

  return (
    <>
      {isWelcomeBannerVisible && activeBanner && !isBannerMinimized && (
        <WelcomeBanner 
          onDismiss={() => setIsWelcomeBannerVisible(false)} 
          content={activeBanner}
        />
      )}
      <Header 
        setActiveView={setActiveView} 
        userAvatar={userProfile.avatar}
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
      {!activeMovieId && !activeCelebrityId && !activePostId && (
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
      
      <BottomNavBar 
        activeView={activeView}
        setActiveView={setActiveView}
        navItems={navItems}
      />
      
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