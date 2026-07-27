import { Component, input } from '@angular/core';
import { MovieResultItem } from '@lorenzopant/tmdb';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Play } from 'lucide-angular';

@Component({
  selector: 'app-movie-card',
  imports: [RatingModule, FormsModule, LucideAngularModule],
  templateUrl: './movie-card.html',
})
export class MovieCard {
  movie =
    input.required<
      Pick<MovieResultItem, 'id' | 'title' | 'poster_path' | 'backdrop_path' | 'vote_average'>
    >();

  playIcon = Play;
}
