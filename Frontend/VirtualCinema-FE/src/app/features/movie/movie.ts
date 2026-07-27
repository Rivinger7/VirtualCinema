import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { inject, OnInit } from '@angular/core';
import { MovieResultItem, PaginatedResponse } from '@lorenzopant/tmdb';
import { MovieService } from '../../core/services/Movies/movie-service';
import { MovieCard } from '../../shared/components/cards/movie-card/movie-card';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-movie',
  imports: [MovieCard, PaginatorModule, SkeletonModule],
  templateUrl: './movie.html',
})
export class Movie implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private movieService = inject(MovieService);
  private readonly router = inject(Router);

  movies = signal<PaginatedResponse<MovieResultItem> | undefined>(undefined);
  readonly isLoading = signal(true);

  genreName = signal('');

  async ngOnInit() {
    this.registerRouter();
  }

  private async registerRouter() {
    this.route.paramMap.subscribe(async (params) => {
      const genreSlug = params.get('genre');

      if (!genreSlug) {
        this.isLoading.set(false);
        return;
      }

      this.isLoading.set(true);
      this.genreName.set(genreSlug);

      try {
        const genreId = await this.getGenreIdFromSlug(genreSlug);

        if (!genreId) {
          this.isLoading.set(false);
          return;
        }

        this.currentPage.set(1);
        this.genreId = genreId;
        const movies = await this.movieService.getMoviesByGenre(genreId);

        this.movies.set(movies);
      } finally {
        this.isLoading.set(false);
      }
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
    this.isLoading.set(true);

    try {
      const movies = await this.movieService.getMoviesByGenre(this.genreId, this.currentPage());
      this.movies.set(movies);
    } finally {
      this.isLoading.set(false);
    }
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

  selectMovie(id: number, title: string) {
    const slug = title.toLocaleLowerCase().replaceAll(' ', '-');
    this.router.navigate(['/movie', id, slug]);
  }
}
