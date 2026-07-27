import { Component, inject, OnInit, signal } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { MovieCard } from '../../../shared/components/cards/movie-card/movie-card';
import { MovieService } from '../../../core/services/Movies/movie-service';
import { MovieResultItem } from '@lorenzopant/tmdb';
import { Router } from '@angular/router';

@Component({
  selector: 'app-now-playing-section',
  imports: [CarouselModule, MovieCard],
  templateUrl: './now-playing-section.html',
})
export class NowPlayingSection implements OnInit {
  private readonly movieService = inject(MovieService);
  private readonly router = inject(Router);

  nowPlayingMovies = signal<MovieResultItem[]>([]);

  async ngOnInit() {
    this.getNowPlayingMovies();
  }

  async getNowPlayingMovies(page: number = 1) {
    const response = await this.movieService.getNowPlayingMovies(page);

    this.nowPlayingMovies.set(response.results);
  }

  selectMovie(id: number, title: string) {
    const slug = title.toLocaleLowerCase().replaceAll(' ', '-');
    this.router.navigate(['/movie', id, slug]);
  }
}
