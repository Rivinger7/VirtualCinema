import { MovieResultItem } from '@lorenzopant/tmdb';

export type MovieCardModel = Pick<
  MovieResultItem,
  'id' | 'title' | 'poster_path' | 'backdrop_path' | 'vote_average'
>;
