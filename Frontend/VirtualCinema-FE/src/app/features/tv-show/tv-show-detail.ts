import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  TVAppendToResponseNamespace,
  TVDetailsWithAppends,
  TVSeriesDetails,
} from '@lorenzopant/tmdb';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { LucideAngularModule, Play, Info } from 'lucide-angular';
import { SkeletonModule } from 'primeng/skeleton';
import { ImageModule } from 'primeng/image';
import { MatDialog } from '@angular/material/dialog';
import { TrailerDialog } from '../../shared/components/dialogs/trailer-dialog/trailer-dialog';
import { TVShowService } from '../../core/services/TVShows/tvshow-service';
import { TvShowCard } from '../../shared/components/cards/tv-show-card/tv-show-card';

@Component({
  selector: 'app-tv-show-detail',
  imports: [
    ButtonModule,
    LucideAngularModule,
    RatingModule,
    FormsModule,
    DatePipe,
    CarouselModule,
    SkeletonModule,
    ImageModule,
    TvShowCard,
  ],
  templateUrl: './tv-show-detail.html',
})
export class TvShowDetail implements OnInit {
  readonly playIcon = Play;
  readonly infoIcon = Info;

  private readonly tvShowService = inject(TVShowService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  tvShowDetail = signal<
    TVDetailsWithAppends<['images', 'credits', 'recommendations', 'videos']> | undefined
  >(undefined);
  readonly isLoading = signal(true);

  routerCategoryName = 'tv-show';

  runtime = computed(() => {
    const minutes = this.tvShowDetail()?.episode_run_time?.[0];
    if (!minutes) return '';

    return `${minutes}m`;
  });

  recommendedTVShows = computed(
    () => this.tvShowDetail()?.recommendations.results.slice(0, 20) ?? [],
  );

  trailer = computed(() => {
    return this.tvShowDetail()?.videos.results.find(
      (video) => video.site === 'YouTube' && video.type === 'Trailer',
    );
  });

  async ngOnInit() {
    this.registerRouter();
  }

  private async registerRouter() {
    this.route.paramMap.subscribe(async (params) => {
      const titleSlug = params.get('title');
      if (!titleSlug) {
        return;
      }

      const tvShowId = Number(params.get('id'));
      if (Number.isNaN(tvShowId)) {
        return;
      }

      await this.getTVShowDetails(tvShowId);
    });
  }

  private async getTVShowDetails(tvShowId: number) {
    this.isLoading.set(true);

    try {
      const appendResponse: TVAppendToResponseNamespace[] = [
        'images',
        'credits',
        'recommendations',
        'videos',
      ];

      const tvShow = await this.tvShowService.getTVShowDetailsWithAppendResponseNamespace(
        tvShowId,
        appendResponse,
      );

      tvShow.images = {
        ...tvShow.images,
        posters: tvShow.images.posters.slice(0, 10),
        backdrops: tvShow.images.backdrops.slice(0, 10),
        logos: tvShow.images.logos.slice(0, 10),
      };

      this.tvShowDetail.set(tvShow);
    } finally {
      this.isLoading.set(false);
    }
  }

  selectGenre(genreName: string) {
    const slug = genreName.toLocaleLowerCase().replaceAll(' ', '-');
    this.router.navigate([this.routerCategoryName, slug]);
  }

  selectRecommendedTVShow(id: number, title: string) {
    const slug = title.toLocaleLowerCase().replaceAll(' ', '-');
    this.router.navigate(['/tv-show', id, slug]);
  }

  openTrailer() {
    this.dialog.open(TrailerDialog, {
      width: '960px',
      maxWidth: '90vw',
      panelClass: 'trailer-dialog',
      data: this.trailer()?.key,
    });
  }
}
