import { Post, SuggestionType, PostType, FanzSay, Reaction, ProjectStatus, Person, ProjectRelationshipType } from '../types';

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


const defaultReactions: Reaction[] = [
  { id: 'love', emoji: '❤️', count: Math.floor(Math.random() * 500) + 50 },
  { id: 'whistle', emoji: '🥳', count: Math.floor(Math.random() * 300) + 20 },
  { id: 'celebrate', emoji: '🎉', count: Math.floor(Math.random() * 800) + 100 },
];

const defaultFanzSays: FanzSay[] = [
  { id: 'fs1', text: 'Mind-blowing!', fans: createFanAvatars(5, 'fs1') },
  { id: 'fs2', text: 'Pure Goosebumps!', fans: createFanAvatars(12, 'fs2') },
  { id: 'fs3', text: 'A true masterpiece!', fans: createFanAvatars(8, 'fs3') },
];

export const INITIAL_POSTS: Post[] = [
  // Post 1: MovieDetails - Chronos Prophecy
  {
    id: 'post-1',
    type: PostType.MovieDetails,
    author: 'Fanz Adda Admin',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    timestamp: '2 days ago',
    content: "Dive deep into the world of Chronos Prophecy, a sci-fi epic that redefined the genre. Explore the cast, crew, and the intricate story that captured our imaginations.",
    eventDetails: {
      title: 'Movie Deep Dive',
      subtitle: 'Chronos Prophecy',
    },
    movieDetails: {
      id: MOVIE_CHRONOS_PROPHECY_ID,
      title: 'Chronos Prophecy',
      type: 'Movie',
      posterUrl: 'https://picsum.photos/seed/chronos-poster/500/750',
      rating: 8.9,
      releaseDate: '2023-10-26',
      director: 'Elara Vance',
      cast: ['Leo Starlight', 'Aria Blaze', 'Nova Lux'],
      genres: ['Sci-Fi', 'Thriller', 'Action'],
      synopsis: 'In a future where time can be manipulated, a rogue agent discovers a prophecy that predicts the end of existence. He must race against the clock, and time itself, to avert the apocalypse.',
      country: 'USA',
      language: 'English',
      productionCompanies: ['Starlight Pictures', 'Future Frame Studios'],
      fullCast: [
        { name: 'Leo Starlight', role: 'Kaelen', imageUrl: 'https://i.pravatar.cc/150?u=leo-starlight', linkedCelebrityId: CELEB_LEO_STARLIGHT_ID },
        { name: 'Aria Blaze', role: 'Seraphina', imageUrl: 'https://i.pravatar.cc/150?u=aria-blaze', linkedCelebrityId: CELEB_ARIA_BLAZE_ID },
        { name: 'Nova Lux', role: 'The Chronicler', imageUrl: 'https://i.pravatar.cc/150?u=nova-lux', linkedCelebrityId: CELEB_NOVA_LUX_ID }
      ],
      crew: [
        { name: 'Elara Vance', role: 'Director', imageUrl: 'https://i.pravatar.cc/150?u=elara-vance', linkedCelebrityId: CELEB_ELARA_VANCE_ID },
        { name: 'Orion Hayes', role: 'Writer', imageUrl: 'https://i.pravatar.cc/150?u=orion-hayes' },
      ]
    },
    reactions: defaultReactions,
    fanzSays: defaultFanzSays,
    linkedMovieIds: [MOVIE_CHRONOS_PROPHECY_ID],
    linkedCelebrityIds: [CELEB_LEO_STARLIGHT_ID, CELEB_ARIA_BLAZE_ID, CELEB_NOVA_LUX_ID, CELEB_ELARA_VANCE_ID],
  },
  // Post 2: Celebrity - Leo Starlight
  {
    id: 'post-2',
    type: PostType.Celebrity,
    author: 'Fanz Adda Admin',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    timestamp: '3 days ago',
    content: "A true icon of our generation! Let's celebrate Leo Starlight, the charismatic force behind some of cinema's most unforgettable roles. What's your favorite Leo performance?",
    eventDetails: { title: 'Celebrity Spotlight' },
    celebrityDetails: {
      id: CELEB_LEO_STARLIGHT_ID,
      name: 'Leo Starlight',
      imageUrl: 'https://i.pravatar.cc/150?u=leo-starlight',
      knownFor: 'Actor, Producer',
      bio: 'Known for his intense performances and dedication to his craft, Leo Starlight has become a household name in Hollywood. From indie darlings to blockbuster hits, his versatility knows no bounds.',
      notableWorks: ['Chronos Prophecy', 'Aethelgard\'s Legacy', 'Kireetam'],
      birthDate: '1985-11-11',
    },
    reactions: defaultReactions,
    fanzSays: defaultFanzSays,
    linkedCelebrityIds: [CELEB_LEO_STARLIGHT_ID],
  },
  // Post 3: Countdown - Galactic Echoes
  {
    id: 'post-3',
    type: PostType.Countdown,
    author: 'Fanz Adda Admin',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    timestamp: '5 days ago',
    content: "The wait is almost over! The next chapter in the saga, Galactic Echoes, is just around the corner. Get your tickets now and prepare for an interstellar journey like no other!",
    eventDetails: { title: "Galactic Echoes Premiere" },
    countdownDetails: {
      title: 'Galactic Echoes Release',
      targetDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
      imageUrl: 'https://picsum.photos/seed/galactic-countdown/800/450',
      bookingUrl: '#',
    },
    reactions: defaultReactions,
    fanzSays: defaultFanzSays,
    linkedMovieIds: [MOVIE_GALACTIC_ECHOES_ID],
    linkedCelebrityIds: [CELEB_ARIA_BLAZE_ID],
  },
  // Post 4: Birthday - Aria Blaze
  {
    id: 'post-4',
    type: PostType.Birthday,
    author: 'Fanz Adda Admin',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    timestamp: '1 day ago',
    content: "Happy Birthday to the incredibly talented Aria Blaze! 🎂 Your performances light up the screen and inspire us all. Wishing you a year of success and happiness. Drop your birthday wishes below!",
    imageUrl: 'https://picsum.photos/seed/aria-bday/800/600',
    eventDetails: { title: 'Happy Birthday, Aria Blaze!' },
    reactions: defaultReactions,
    fanzSays: defaultFanzSays,
    linkedCelebrityIds: [CELEB_ARIA_BLAZE_ID],
  },
  // Post 5: Project Announcement
  {
    id: 'post-5',
    type: PostType.ProjectAnnouncement,
    author: 'Fanz Adda Admin',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    timestamp: '6 days ago',
    content: "BIG NEWS! The next installment in the Aethelgard universe has been announced. 'Aethelgard's Legacy' continues the epic story. Get ready for more action, drama, and breathtaking visuals.",
    eventDetails: { title: "New Project Announcement" },
    projectAnnouncementDetails: {
      title: "Aethelgard's Legacy",
      posterUrl: 'https://picsum.photos/seed/aethelgard-poster/500/750',
      status: ProjectStatus.PreProduction,
      expectedRelease: 'Late 2025',
      logline: 'The heir to a forgotten kingdom must reclaim their birthright from a shadowy cabal that has ruled for centuries.',
      cast: [
        { name: 'Leo Starlight', role: 'Valerius', imageUrl: 'https://i.pravatar.cc/150?u=leo-starlight', linkedCelebrityId: CELEB_LEO_STARLIGHT_ID },
        { name: 'Seraphina Moon', role: 'Lyra', imageUrl: 'https://i.pravatar.cc/150?u=seraphina-moon' },
      ],
      crew: [
        { name: 'Elara Vance', role: 'Director', imageUrl: 'https://i.pravatar.cc/150?u=elara-vance', linkedCelebrityId: CELEB_ELARA_VANCE_ID },
      ],
      relationship: {
        type: ProjectRelationshipType.Sequel,
        relatedMovieId: MOVIE_CHRONOS_PROPHECY_ID,
      },
    },
    reactions: defaultReactions,
    fanzSays: defaultFanzSays,
    linkedMovieIds: [MOVIE_AETHELGARDS_LEGACY_ID],
    linkedCelebrityIds: [CELEB_LEO_STARLIGHT_ID, CELEB_ELARA_VANCE_ID]
  },
];
