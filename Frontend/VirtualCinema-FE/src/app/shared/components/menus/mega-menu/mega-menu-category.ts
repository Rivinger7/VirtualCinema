import { Component, computed, inject, input, OnInit, output } from '@angular/core';
import { Genre } from '@lorenzopant/tmdb';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mega-menu-category',
  imports: [],
  templateUrl: './mega-menu-category.html',
})
export class MegaMenuCategory implements OnInit {
  genres = input.required<Genre[]>();
  routerCategoryName = input.required<string>();

  ngOnInit() {}

  private readonly router = inject(Router);
  selectGenre(genreName: string) {
    const slug = genreName.toLocaleLowerCase().replaceAll(' ', '-');
    this.router.navigate([this.routerCategoryName(), slug]);
  }
}
