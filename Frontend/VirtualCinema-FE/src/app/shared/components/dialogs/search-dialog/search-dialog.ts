import { Component, computed, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule, Search } from 'lucide-angular';
import { MovieService } from '../../../../core/services/Movies/movie-service';
import { GenresResponse, MovieResultItem, PaginatedResponse } from '@lorenzopant/tmdb';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-dialog',
  imports: [
    MatDialogModule,
    MatInputModule,
    FormsModule,
    LucideAngularModule,
    ScrollPanelModule,
    ReactiveFormsModule,
  ],
  templateUrl: './search-dialog.html',
})
export class SearchDialog implements OnInit {
  readonly searchIcon = Search;

  private readonly movieService = inject(MovieService);
  private readonly router = inject(Router);
  private readonly dialogRef = inject(MatDialogRef<SearchDialog>);

  popularMovies = signal<PaginatedResponse<MovieResultItem> | null>(null);
  movieGenres = signal<GenresResponse | null>(null);
  selectedGenreIds = signal<number[]>([]);

  filteredMovies = computed(() => {
    const response = this.popularMovies();
    if (!response) {
      return [];
    }

    const selected = this.selectedGenreIds();

    if (selected.length === 0) {
      return response.results;
    }

    return response.results.filter((movie) => selected.some((id) => movie.genre_ids.includes(id)));
  });

  searchControl = new FormControl('');

  async ngOnInit() {
    await this.getPopularMovies();
    await this.getMovieGenres();

    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value) => {
          if (!value?.trim()) {
            return this.movieService.getPopularMovies();
          }

          return this.movieService.searchMovieByTitle({ querry: value });
        }),
      )
      .subscribe((movies) => {
        this.popularMovies.set(movies);
      });
  }

  async getPopularMovies(page: number = 1) {
    this.popularMovies.set(await this.movieService.getPopularMovies(page));
  }

  async getMovieGenres() {
    this.movieGenres.set(await this.movieService.getMovieGenres());
  }

  toggleGenre(genreId: number) {
    this.selectedGenreIds.update((ids) =>
      ids.includes(genreId) ? ids.filter((id) => id !== genreId) : [...ids, genreId],
    );
  }

  selectMovie(id: number, title: string) {
    const slug = title.toLocaleLowerCase().replaceAll(' ', '-');
    this.router.navigate(['/movie', id, slug]);
    this.dialogRef.close();
  }
}
