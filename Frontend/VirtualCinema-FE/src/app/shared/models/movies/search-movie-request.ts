import { CountryISO3166_1, Language } from '@lorenzopant/tmdb';

export interface SearchMovieRequest {
  querry: string;
  includeAdult?: boolean;
  language?: Language;
  page?: number;
  primaryReleaseYear?: string;
  region?: CountryISO3166_1;
  year?: string;
}
