import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { MovieCard } from '../../../shared/components/cards/movie-card/movie-card';
import { MovieService } from '../../../core/services/Movies/movie-service';
import { MovieResultItem } from '@lorenzopant/tmdb';
import { Router } from '@angular/router';

@Component({
  selector: 'app-popular-section',
  imports: [CarouselModule, MovieCard],
  templateUrl: './popular-section.html',
})
export class PopularSection implements OnInit {
  private readonly movieService = inject(MovieService);
  private readonly router = inject(Router);

  popularMovies = signal<MovieResultItem[]>([]);

  async ngOnInit() {
    this.getPopularMovies();
  }

  async getPopularMovies(page: number = 1) {
    const response = await this.movieService.getPopularMovies(page);

    this.popularMovies.set(response.results);
  }

  selectMovie(id: number, title: string) {
    const slug = title.toLocaleLowerCase().replaceAll(' ', '-');
    this.router.navigate(['/movie', id, slug]);
  }
}
