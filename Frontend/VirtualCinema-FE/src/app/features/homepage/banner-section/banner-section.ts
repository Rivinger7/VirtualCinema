import { Component, computed, inject, Injectable, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { LucideAngularModule, Play, Info } from 'lucide-angular';
import { MovieService } from '../../../core/services/Movies/movie-service';
import { signal } from '@angular/core';
import {
  MovieAppendToResponseNamespace,
  MovieDetails,
  MovieDetailsWithAppends,
} from '@lorenzopant/tmdb';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TrailerDialog } from '../../../shared/components/dialogs/trailer-dialog/trailer-dialog';

@Component({
  selector: 'app-banner-section',
  imports: [ButtonModule, LucideAngularModule, RatingModule, FormsModule],
  templateUrl: './banner-section.html',
})
export class BannerSection implements OnInit {
  readonly playIcon = Play;
  readonly infoIcon = Info;

  private readonly movieService = inject(MovieService);
  private readonly dialog = inject(MatDialog);

  latestMovie = signal<
    MovieDetailsWithAppends<['images', 'credits', 'recommendations', 'videos']> | undefined
  >(undefined);
  trailer = computed(() => {
    return this.latestMovie()?.videos.results.find(
      (video) => video.site === 'YouTube' && video.type === 'Trailer',
    );
  });
  private readonly latestMovieId: number = 1368337;
  async ngOnInit() {
    await this.getLatestMovie(this.latestMovieId);
  }

  private async getLatestMovie(movieId: number) {
    const appendResponse: MovieAppendToResponseNamespace[] = [
      'images',
      'credits',
      'recommendations',
      'videos',
    ];

    this.latestMovie.set(
      await this.movieService.getMovieDetailsWithAppendResponseNamespace(movieId, appendResponse),
    );
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
