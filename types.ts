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
}

export interface FanzSay {
  id: string;
  text: string;
  fans: string[]; // Array of avatar URLs
}

export interface MovieDetails {
  title: string;
  posterUrl: string;
  rating: number; // e.g., 8.7
  director: string;
  cast: string[];
  genres: string[];
  synopsis: string;
}

export interface CharacterDetails {
  name: string;
  imageUrl: string;
  role: string;
  bio: string;
  keyTraits: string[];
  firstAppearance: string;
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
}

export interface AwardDetails {
  awardName: string;
  awardFor: string; // e.g., "Best Actor" or "Chronos Prophecy"
  event: string;
  year: number;
  imageUrl?: string;
}

export interface ProjectAnnouncementDetails {
  title: string;
  posterUrl: string;
  status: string; // e.g., "In Production", "Pre-Production"
  expectedRelease: string; // e.g., "Coming 2025"
  crew: string; // e.g., "From the director of 'Chronos Prophecy'"
  logline: string;
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
  characterDetails?: CharacterDetails;
  countdownDetails?: CountdownDetails;
  filmographyDetails?: FilmographyItem[];
  awardDetails?: AwardDetails;
  projectAnnouncementDetails?: ProjectAnnouncementDetails;
  reactions: { [key in ReactionType]?: number };
  fanzSays?: FanzSay[];
}

export interface UserProfileData {
  name: string;
  avatar: string;
  favoriteStars: string[];
  favoriteMovies: string[];
  favoriteGenres: string[];
}