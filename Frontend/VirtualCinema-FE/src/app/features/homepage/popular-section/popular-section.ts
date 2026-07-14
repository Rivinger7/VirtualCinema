import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { MovieCard } from '../../../shared/components/cards/movie-card/movie-card';
import { MovieService } from '../../../core/services/Movies/movie-service';
import { MovieResultItem } from '@lorenzopant/tmdb';

@Component({
  selector: 'app-popular-section',
  imports: [CarouselModule, MovieCard],
  templateUrl: './popular-section.html',
})
export class PopularSection implements OnInit {
  movieService = inject(MovieService);

  popularMovies = signal<MovieResultItem[]>([]);

  async ngOnInit() {
    this.getPopularMovies();
  }

  async getPopularMovies(page: number = 1) {
    const response = await this.movieService.getPopularMovies(page);

    this.popularMovies.set(response.results);
  }
}
