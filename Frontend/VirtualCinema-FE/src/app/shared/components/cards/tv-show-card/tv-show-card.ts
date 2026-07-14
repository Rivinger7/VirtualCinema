import { Component, input } from '@angular/core';
import { TVSeriesResultItem } from '@lorenzopant/tmdb';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Play } from 'lucide-angular';

@Component({
  selector: 'app-tv-show-card',
  imports: [RatingModule, FormsModule, LucideAngularModule],
  templateUrl: './tv-show-card.html',
})
export class TvShowCard {
  tvShow = input.required<TVSeriesResultItem>();

  playIcon = Play;
}
