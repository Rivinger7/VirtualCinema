import { Component, input, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { inject, OnInit } from '@angular/core';
import { PaginatedResponse, TVSeriesResultItem } from '@lorenzopant/tmdb';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TVShowService } from '../../core/services/TVShows/tvshow-service';
import { TvShowCard } from '../../shared/components/cards/tv-show-card/tv-show-card';

@Component({
  selector: 'app-tv-show',
  imports: [PaginatorModule, TvShowCard],
  templateUrl: './tv-show.html',
})
export class TvShow implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private tvShowService = inject(TVShowService);

  tvShows = signal<PaginatedResponse<TVSeriesResultItem> | undefined>(undefined);

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
      const tvShows = await this.tvShowService.getTVShowsByGenre(genreId);

      this.tvShows.set(tvShows);
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
    const movies = await this.tvShowService.getTVShowsByGenre(this.genreId, this.currentPage());

    this.tvShows.set(movies);
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
}
