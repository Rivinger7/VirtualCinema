import { Routes } from '@angular/router';
import { Homepage } from './features/homepage/homepage';
import { Movie } from './features/movie/movie';
import { TvShow } from './features/tv-show/tv-show';

export const routes: Routes = [
  {
    path: '',
    component: Homepage,
  },
  {
    path: 'movie/:genre',
    component: Movie,
  },
  {
    path: 'tv-show/:genre',
    component: TvShow,
  },
];
