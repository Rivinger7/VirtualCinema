import { Injectable } from '@angular/core';
import { tmdb } from '../../../core/providers/tmdb';
import {
  MovieAppendToResponseNamespace,
  MovieDetails,
  MovieDetailsWithAppends,
} from '@lorenzopant/tmdb';
import { SearchMovieRequest } from '../../../shared/models/movies/search-movie-request';

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
  async getMovieDetailsWithAppendResponseNamespace<
    AppendResponses extends MovieAppendToResponseNamespace[],
  >(
    movieId: number,
    appendResponse: AppendResponses,
  ): Promise<MovieDetailsWithAppends<AppendResponses>> {
    return (await tmdb.movies.details({
      movie_id: movieId,
      append_to_response: appendResponse,
    })) as MovieDetailsWithAppends<AppendResponses>;
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

  async searchMovieByTitle(searchMovieRequest: SearchMovieRequest) {
    return await tmdb.search.movies({
      query: searchMovieRequest.querry,
      language: searchMovieRequest.language,
      region: searchMovieRequest.region,
      year: searchMovieRequest.year,
      page: (searchMovieRequest.page = 1),
    });
  }
}
