import { PostType } from './PostType';

export enum ReactionType {
  Love = '❤️',
  Whistle = '🥳',
  Celebrate = '🎉',
}

export enum SuggestionType {
  Topic = 'Topic',
  Celeb = 'Celebrity',
}

export { PostType };

export interface Suggestion {
  id: string;
  name: string;
  avatar: string;
  type: SuggestionType;
  isFanned: boolean;
  linkedId?: string;
}

export interface FanzSay {
  id: string;
  text: string;
  fans: string[]; // Array of avatar URLs
}

export interface Episode {
  season: number;
  episodeNumber: number;
  title: string;
  synopsis: string;
  thumbnailUrl: string;
}

export interface Person {
  name: string;
  role: string;
  imageUrl: string;
  linkedCelebrityId?: string;
}

export interface MovieDetails {
  id: string;
  title: string;
  type: 'Movie' | 'TV Series';
  posterUrl: string;
  rating: number; // e.g., 8.7
  releaseDate: string;
  director: string;
  cast: string[];
  genres: string[];
  synopsis: string;
  country: string;
  language: string;
  productionCompanies: string[];
  fullCast: Person[];
  crew: Person[];
}

export interface CharacterDetails {
  name: string;
  imageUrl: string;
  role: string;
  bio: string;
  keyTraits: string[];
  firstAppearance: string;
  linkedMovieId?: string;
  linkedCelebrityId?: string;
}

export interface CountdownDetails {
  title: string;
  targetDate: string; // ISO 8601 format
  imageUrl: string;
  bookingUrl: string;
}

export interface FilmographyItem {
  id:string;
  title: string;
  year: number;
  posterUrl: string;
  linkedMovieId?: string;
}

export interface AwardDetails {
  awardName: string;
  awardFor: string; // e.g., "Best Actor" or "Chronos Prophecy"
  event: string;
  year: number;
  imageUrl?: string;
  linkedMovieId?: string;
  linkedCelebrityId?: string;
}

export interface ProjectAnnouncementDetails {
  title: string;
  posterUrl: string;
  status: string; // e.g., "In Production", "Pre-Production"
  expectedRelease: string; // e.g., "Coming 2025"
  crew: string; // e.g., "From the director of 'Chronos Prophecy'"
  logline: string;
}

export interface CelebrityDetails {
  id: string;
  name: string;
  imageUrl: string;
  knownFor: string;
  bio: string;
  notableWorks: string[];
  birthDate: string; // ISO 8601 format date
}

export interface BoxOfficeDetails {
  title: string;
  grossRevenue: number;
  ranking: number;
  region: string;
  sourceUrl?: string;
  linkedMovieId?: string;
}

export interface TriviaDetails {
  title: string;
  triviaItems: string[];
  linkedCelebrityId?: string;
}

export interface Post {
  id: string;
  type: PostType;
  author: string;
  avatar: string;
  timestamp: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  videoDuration?: number; // in seconds
  eventDetails?: {
    title: string;
    subtitle?: string;
  };
  movieDetails?: MovieDetails;
  episodes?: Episode[];
  characterDetails?: CharacterDetails;
  countdownDetails?: CountdownDetails;
  filmographyDetails?: FilmographyItem[];
  awardDetails?: AwardDetails;
  projectAnnouncementDetails?: ProjectAnnouncementDetails;
  celebrityDetails?: CelebrityDetails;
  boxOfficeDetails?: BoxOfficeDetails;
  triviaDetails?: TriviaDetails;
  reactions: { [key in ReactionType]?: number };
  fanzSays?: FanzSay[];
  fanzSaysEnabled?: boolean;
  linkedMovieIds?: string[];
  linkedCelebrityIds?: string[];
}

export interface HypeLogEntry {
  movieId: string;
  timestamp: string; // ISO 8601 format
}

export interface UserProfileData {
  name: string;
  avatar: string;
  favoriteStars: string[];
  favoriteMovies: string[];
  favoriteGenres: string[];
}