import { Component, inject, signal } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { MovieCard } from '../../../shared/components/cards/movie-card/movie-card';
import { MovieService } from '../../../core/services/Movies/movie-service';
import { MovieResultItem } from '@lorenzopant/tmdb';

@Component({
  selector: 'app-up-coming-section',
  imports: [CarouselModule, MovieCard],
  templateUrl: './up-coming-section.html',
})
export class UpComingSection {
  movieService = inject(MovieService);

  upComingMovies = signal<MovieResultItem[]>([]);

  async ngOnInit() {
    this.getUpComingMovies();
  }

  async getUpComingMovies(page: number = 1) {
    const response = await this.movieService.getUpComingMovies(page);

    this.upComingMovies.set(response.results);
  }
}
