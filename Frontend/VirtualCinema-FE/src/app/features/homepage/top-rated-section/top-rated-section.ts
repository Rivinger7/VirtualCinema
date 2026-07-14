import { Component, inject, signal } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { MovieCard } from '../../../shared/components/cards/movie-card/movie-card';
import { MovieService } from '../../../core/services/Movies/movie-service';
import { MovieResultItem } from '@lorenzopant/tmdb';

@Component({
  selector: 'app-top-rated-section',
  imports: [CarouselModule, MovieCard],
  templateUrl: './top-rated-section.html',
})
export class TopRatedSection {
  movieService = inject(MovieService);

  topRatedMovies = signal<MovieResultItem[]>([]);

  async ngOnInit() {
    this.getTopRatedMovies();
  }

  async getTopRatedMovies(page: number = 1) {
    const response = await this.movieService.getTopRatedMovies(page);

    this.topRatedMovies.set(response.results);
  }
}
