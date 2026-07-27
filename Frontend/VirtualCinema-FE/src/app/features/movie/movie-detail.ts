import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MovieService } from '../../core/services/Movies/movie-service';
import { ActivatedRoute } from '@angular/router';
import { MovieAppendToResponseNamespace, MovieDetailsWithAppends } from '@lorenzopant/tmdb';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Play, Info } from 'lucide-angular';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MovieCard } from '../../shared/components/cards/movie-card/movie-card';
import { SkeletonModule } from 'primeng/skeleton';
import { ImageModule } from 'primeng/image';
import { MatDialog } from '@angular/material/dialog';
import { TrailerDialog } from '../../shared/components/dialogs/trailer-dialog/trailer-dialog';

@Component({
  selector: 'app-movie-detail',
  imports: [
    ButtonModule,
    LucideAngularModule,
    RatingModule,
    FormsModule,
    DatePipe,
    CarouselModule,
    MovieCard,
    SkeletonModule,
    ImageModule,
  ],
  templateUrl: './movie-detail.html',
})
export class MovieDetail implements OnInit {
  readonly playIcon = Play;
  readonly infoIcon = Info;

  private readonly movieService = inject(MovieService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  movieDetail = signal<
    MovieDetailsWithAppends<['images', 'credits', 'recommendations', 'videos']> | undefined
  >(undefined);
  readonly isLoading = signal(true);

  routerCategoryName = 'movie';
  runtime = computed(() => {
    const minutes = this.movieDetail()?.runtime;
    if (!minutes) return '';

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return `${hours}h ${mins}m`;
  });
  recommendedMovies = computed(
    () => this.movieDetail()?.recommendations.results.slice(0, 20) ?? [],
  );
  trailer = computed(() => {
    return this.movieDetail()?.videos.results.find(
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

      const movieId = Number(params.get('id'));
      if (Number.isNaN(movieId)) {
        return;
      }

      await this.getMovieDetails(movieId);
    });
  }

  private async getMovieDetails(movieId: number) {
    this.isLoading.set(true);

    try {
      const appendResponse: MovieAppendToResponseNamespace[] = [
        'images',
        'credits',
        'recommendations',
        'videos',
      ];

      const movie = await this.movieService.getMovieDetailsWithAppendResponseNamespace(
        movieId,
        appendResponse,
      );

      movie.images = {
        ...movie.images,
        posters: movie.images.posters.slice(0, 10),
        backdrops: movie.images.backdrops.slice(0, 10),
        logos: movie.images.logos.slice(0, 10),
      };

      this.movieDetail.set(movie);
    } finally {
      this.isLoading.set(false);
    }
  }

  selectGenre(genreName: string) {
    const slug = genreName.toLocaleLowerCase().replaceAll(' ', '-');
    this.router.navigate([this.routerCategoryName, slug]);
  }

  selectRecommendedMovie(id: number, title: string) {
    const slug = title.toLocaleLowerCase().replaceAll(' ', '-');
    this.router.navigate(['/movie', id, slug]);
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
