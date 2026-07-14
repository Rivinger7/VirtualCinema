import { Component, inject, input, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LucideAngularModule, Search } from 'lucide-angular';
import { SearchDialog } from '../../shared/components/dialogs/search-dialog/search-dialog';
import { ViewEncapsulation } from '@angular/core';
import { LoginDialog } from '../../core/authentication/login/login-dialog';
import { MovieService } from '../../core/services/Movies/movie-service';
import { TVShowService } from '../../core/services/TVShows/tvshow-service';
import { MegaMenuCategory } from '../../shared/components/menus/mega-menu/mega-menu-category';
import { Genre } from '@lorenzopant/tmdb';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [LucideAngularModule, MegaMenuCategory, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
  encapsulation: ViewEncapsulation.None,
})
export class Header implements OnInit {
  readonly searchIcon = Search;

  private readonly dialog = inject(MatDialog);

  private movieService = inject(MovieService);
  private tvShowService = inject(TVShowService);

  async ngOnInit() {
    await this.loadMenuCategories();
  }

  openSearchDialog(): void {
    this.dialog.open(SearchDialog, {
      width: '700px',
      maxWidth: '90vw',
      position: { top: '100px' },
      panelClass: 'search-dialog',
      backdropClass: 'search-dialog-backdrop',
    });
  }

  openLoginDialog(): void {
    this.dialog.open(LoginDialog, {
      width: '500px',
      height: '580px',
      position: { top: '120px' },
      panelClass: 'login-dialog',
      backdropClass: 'login-dialog-backdrop',
    });
  }

  private async getMovieGenres() {
    const response = await this.movieService.getMovieGenres();
    return response.genres;
  }

  private async getTVShowGenres() {
    const response = await this.tvShowService.getTVShowGenres();
    return response.genres;
  }

  moviveGenres = signal<Genre[]>([]);
  tvShowGenres = signal<Genre[]>([]);
  private async loadMenuCategories(): Promise<void> {
    const [movieGenres, tvGenres] = await Promise.all([
      this.getMovieGenres(),
      this.getTVShowGenres(),
    ]);

    this.moviveGenres.set(movieGenres);
    this.tvShowGenres.set(tvGenres);
  }
}
