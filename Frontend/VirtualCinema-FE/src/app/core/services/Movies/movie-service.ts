import { Injectable } from '@angular/core';
import { tmdb } from '../../../core/providers/tmdb';
import { MovieDetails, MovieImages } from '@lorenzopant/tmdb';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  async getLatestMovie() {
    return await tmdb.movies.latest();
  }

  async getMovieDetails(movieId: number): Promise<MovieDetails> {
    return await tmdb.movies.details({ movie_id: movieId });
  }

  async getImages(movieId: number) {
    return await tmdb.movies.images({ movie_id: movieId });
  }

  async getPopularMovies(page: number = 1) {
    return await tmdb.movie_lists.popular({
      page,
    });
  }

  async getNowPlayingMovies(page: number = 1) {
    return await tmdb.movie_lists.now_playing({
      page,
    });
  }

  async getTopRatedMovies(page: number = 1) {
    return await tmdb.movie_lists.top_rated({
      page,
    });
  }

  async getUpComingMovies(page: number = 1) {
    return await tmdb.movie_lists.upcoming({
      page,
    });
  }

  async getMovieGenres() {
    return await tmdb.genres.movie_list();
  }

  async getMoviesByGenre(genreId: number, page: number = 1) {
    return await tmdb.discover.movie({
      with_genres: genreId,
      page,
    });
  }
}
