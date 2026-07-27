import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { inject, OnInit } from '@angular/core';
import { PaginatedResponse, TVSeriesResultItem } from '@lorenzopant/tmdb';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';
import { TVShowService } from '../../core/services/TVShows/tvshow-service';
import { TvShowCard } from '../../shared/components/cards/tv-show-card/tv-show-card';

@Component({
  selector: 'app-tv-show',
  imports: [PaginatorModule, TvShowCard, SkeletonModule],
  templateUrl: './tv-show.html',
})
export class TvShow implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private tvShowService = inject(TVShowService);

  tvShows = signal<PaginatedResponse<TVSeriesResultItem> | undefined>(undefined);
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
        const tvShows = await this.tvShowService.getTVShowsByGenre(genreId);

        this.tvShows.set(tvShows);
      } finally {
        this.isLoading.set(false);
      }
    });
  }
  private async getGenreIdFromSlug(slug: string) {
    const response = await this.tvShowService.getTVShowGenres();

    const genre = response.genres.find((g) => g.name.toLowerCase().replaceAll(' ', '-') === slug);

    return genre?.id;
  }
  currentPage = signal(1);
  genreId!: number;
  private async loadTVShows() {
    this.isLoading.set(true);

    try {
      const movies = await this.tvShowService.getTVShowsByGenre(this.genreId, this.currentPage());
      this.tvShows.set(movies);
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

    await this.loadTVShows();
  }

  selectTVShow(id: number, title: string) {
    const slug = title.toLocaleLowerCase().replaceAll(' ', '-');
    this.router.navigate(['/tv-show', id, slug]);
  }
}
