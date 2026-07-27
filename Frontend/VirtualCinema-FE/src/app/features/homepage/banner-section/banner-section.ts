import { Component, computed, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { LucideAngularModule, Play, Info } from 'lucide-angular';
import { MovieService } from '../../../core/services/Movies/movie-service';
import { signal } from '@angular/core';
import { MovieAppendToResponseNamespace, MovieDetailsWithAppends } from '@lorenzopant/tmdb';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TrailerDialog } from '../../../shared/components/dialogs/trailer-dialog/trailer-dialog';
import { Router } from '@angular/router';

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
  private readonly router = inject(Router);

  latestMovie = signal<
    MovieDetailsWithAppends<['images', 'credits', 'recommendations', 'videos']> | undefined
  >(undefined);
  trailer = computed(() => {
    return this.latestMovie()?.videos.results.find(
      (video) => video.site === 'YouTube' && video.type === 'Trailer',
    );
  });
  readonly latestMovieId: number = 1368337;
  lastestMovieTitle: string = '';
  async ngOnInit() {
    await this.getLatestMovie(this.latestMovieId);
    this.lastestMovieTitle = this.latestMovie()!.title;
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

  selectMovie(id: number, title: string) {
    const slug = title.toLocaleLowerCase().replaceAll(' ', '-');
    this.router.navigate(['/movie', id, slug]);
  }
}
