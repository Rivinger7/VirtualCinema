import { Component, inject, OnInit, signal } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { MovieCard } from '../../../shared/components/cards/movie-card/movie-card';
import { MovieService } from '../../../core/services/Movies/movie-service';
import { MovieResultItem } from '@lorenzopant/tmdb';

@Component({
  selector: 'app-now-playing-section',
  imports: [CarouselModule, MovieCard],
  templateUrl: './now-playing-section.html',
})
export class NowPlayingSection implements OnInit {
  movieService = inject(MovieService);

  nowPlayingMovies = signal<MovieResultItem[]>([]);

  async ngOnInit() {
    this.getNowPlayingMovies();
  }

  async getNowPlayingMovies(page: number = 1) {
    const response = await this.movieService.getNowPlayingMovies(page);

    this.nowPlayingMovies.set(response.results);
  }
}
