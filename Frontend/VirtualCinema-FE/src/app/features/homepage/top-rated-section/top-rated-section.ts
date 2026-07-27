import { Component, inject, signal } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { MovieCard } from '../../../shared/components/cards/movie-card/movie-card';
import { MovieService } from '../../../core/services/Movies/movie-service';
import { MovieResultItem } from '@lorenzopant/tmdb';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-rated-section',
  imports: [CarouselModule, MovieCard],
  templateUrl: './top-rated-section.html',
})
export class TopRatedSection {
  private readonly movieService = inject(MovieService);
  private readonly router = inject(Router);

  topRatedMovies = signal<MovieResultItem[]>([]);

  async ngOnInit() {
    this.getTopRatedMovies();
  }

  async getTopRatedMovies(page: number = 1) {
    const response = await this.movieService.getTopRatedMovies(page);

    this.topRatedMovies.set(response.results);
  }

  selectMovie(id: number, title: string) {
    const slug = title.toLocaleLowerCase().replaceAll(' ', '-');
    this.router.navigate(['/movie', id, slug]);
  }
}
