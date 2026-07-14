import { Component, input, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { inject, OnInit } from '@angular/core';
import { MovieResultItem, PaginatedResponse } from '@lorenzopant/tmdb';
import { MovieService } from '../../core/services/Movies/movie-service';
import { MovieCard } from '../../shared/components/cards/movie-card/movie-card';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'app-movie',
  imports: [MovieCard, PaginatorModule],
  templateUrl: './movie.html',
})
export class Movie implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private movieService = inject(MovieService);

  movies = signal<PaginatedResponse<MovieResultItem> | undefined>(undefined);

  genreName = signal('');

  async ngOnInit() {
    this.registerRouter();
  }

  private async registerRouter() {
    this.route.paramMap.subscribe(async (params) => {
      const genreSlug = params.get('genre');

      if (!genreSlug) {
        console.log('No genre slug');
        return;
      }

      this.genreName.set(genreSlug);

      const genreId = await this.getGenreIdFromSlug(genreSlug);

      if (!genreId) {
        console.log('No genre id');
        return;
      }

      this.currentPage.set(1);
      this.genreId = genreId;
      const movies = await this.movieService.getMoviesByGenre(genreId);

      this.movies.set(movies);

      console.log(movies);
    });
  }
  private async getGenreIdFromSlug(slug: string) {
    const response = await this.movieService.getMovieGenres();

    const genre = response.genres.find((g) => g.name.toLowerCase().replaceAll(' ', '-') === slug);

    return genre?.id;
  }
  currentPage = signal(1);
  genreId!: number;
  private async loadMovies() {
    const movies = await this.movieService.getMoviesByGenre(this.genreId, this.currentPage());

    this.movies.set(movies);
  }

  Math = Math;
  first: number = 0;
  rows: number = 10;
  async onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
    this.currentPage.set((event.page ?? 0) + 1);

    await this.loadMovies();
  }
}
