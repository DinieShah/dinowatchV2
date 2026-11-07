export type AnimeStatus = "airing" | "completed" | "upcoming";

export interface AnimeSummary {
  id: string;
  title: string;
  altTitle?: string;
  malId?: number;
  posterImage: string;
  bannerImage?: string;
  score?: number;
  genres: string[];
  year?: number;
  status: AnimeStatus;
  episodeCount?: number;
  synopsis?: string;
}

export interface AnimeCharacter {
  name: string;
  role?: string;
  image?: string;
  voiceActor?: string;
}

export interface AnimeDetail extends AnimeSummary {
  studios?: string[];
  trailerUrl?: string;
  characters?: AnimeCharacter[];
}

export interface FeaturedAnime extends AnimeSummary {
  featuredEpisode: number;
  bannerImage: string;
}

export interface Episode {
  number: number;
  title: string;
  thumbnail: string;
  durationLabel: string;
  isFiller?: boolean;
  isAired?: boolean;
  airedAt?: number;
}

export interface SubtitleTrack {
  lang: string;
  label: string;
}

export interface QualityOption {
  height: number;
  label: string;
}

export interface WatchData {
  anime: AnimeSummary;
  currentEpisode: number;
  episodes: Episode[];
  subtitles?: SubtitleTrack[];
  qualities?: QualityOption[];
  source?: {
    url: string;
    type: "hls" | "mp4";
  };
}

export interface ContinueWatchingItem {
  anime: AnimeSummary;
  episodeNumber: number;
  progress: number;
  lastWatchedLabel: string;
}

export type FranchiseRole =
  | "prequel"
  | "sequel"
  | "side_story"
  | "spin_off"
  | "alternative_setting"
  | "alternative_version"
  | "parent_story"
  | "summary"
  | "current"
  | "other";

export interface FranchiseItem {
  id: string;
  title: string;
  posterImage: string;
  role: FranchiseRole;
  roleLabel: string;
  subtype?: string;
  year?: number;
  startDate?: string;
  isCurrent: boolean;
}
