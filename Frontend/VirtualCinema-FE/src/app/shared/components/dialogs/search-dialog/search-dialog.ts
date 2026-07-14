import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search } from 'lucide-angular';
import { MovieService } from '../../../../core/services/Movies/movie-service';
import { MovieResultItem, PaginatedResponse } from '@lorenzopant/tmdb';
import { ScrollPanelModule } from 'primeng/scrollpanel';

@Component({
  selector: 'app-search-dialog',
  imports: [MatDialogModule, MatInputModule, FormsModule, LucideAngularModule, ScrollPanelModule],
  templateUrl: './search-dialog.html',
})
export class SearchDialog implements OnInit {
  readonly searchIcon = Search;

  private movieService = inject(MovieService);

  popularMovies = signal<PaginatedResponse<MovieResultItem> | null>(null);

  async ngOnInit() {
    await this.getPopularMovies();
  }

  async getPopularMovies(page: number = 1) {
    this.popularMovies.set(await this.movieService.getPopularMovies(page));
  }
}
