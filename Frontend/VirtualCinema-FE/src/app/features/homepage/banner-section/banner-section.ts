import { Component, inject, Injectable, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { LucideAngularModule, Play, Info } from 'lucide-angular';
import { MovieService } from '../../../core/services/Movies/movie-service';
import { signal } from '@angular/core';
import { MovieDetails } from '@lorenzopant/tmdb';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-banner-section',
  imports: [ButtonModule, LucideAngularModule, RatingModule, FormsModule],
  templateUrl: './banner-section.html',
})
export class BannerSection implements OnInit {
  readonly playIcon = Play;
  readonly infoIcon = Info;

  private movieService = inject(MovieService);

  latestMovie = signal<MovieDetails | null>(null);
  private readonly latestMovieId: number = 1368337;
  async ngOnInit() {
    this.latestMovie.set(await this.movieService.getMovieDetails(this.latestMovieId));
  }
}
