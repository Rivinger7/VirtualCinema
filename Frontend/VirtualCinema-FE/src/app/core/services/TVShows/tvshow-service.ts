import { Injectable } from '@angular/core';
import { tmdb } from '../../../core/providers/tmdb';

@Injectable({
  providedIn: 'root',
})
export class TVShowService {
  async getTVShowGenres() {
    return await tmdb.genres.tv_list();
  }

  async getTVShowsByGenre(genreId: number, page: number = 1) {
    return await tmdb.discover.tv({
      with_genres: genreId,
      page,
    });
  }
}
