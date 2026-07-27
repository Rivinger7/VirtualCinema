import { Component, inject, signal } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { MovieCard } from '../../../shared/components/cards/movie-card/movie-card';
import { MovieService } from '../../../core/services/Movies/movie-service';
import { MovieResultItem } from '@lorenzopant/tmdb';
import { Router } from '@angular/router';

@Component({
  selector: 'app-up-coming-section',
  imports: [CarouselModule, MovieCard],
  templateUrl: './up-coming-section.html',
})
export class UpComingSection {
  private readonly movieService = inject(MovieService);
  private readonly router = inject(Router);

  upComingMovies = signal<MovieResultItem[]>([]);

  async ngOnInit() {
    this.getUpComingMovies();
  }

  async getUpComingMovies(page: number = 1) {
    const response = await this.movieService.getUpComingMovies(page);

    this.upComingMovies.set(response.results);
  }

  selectMovie(id: number, title: string) {
    const slug = title.toLocaleLowerCase().replaceAll(' ', '-');
    this.router.navigate(['/movie', id, slug]);
  }
}
