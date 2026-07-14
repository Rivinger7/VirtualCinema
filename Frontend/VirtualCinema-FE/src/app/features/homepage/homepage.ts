import { Component } from '@angular/core';
import { BannerSection } from './banner-section/banner-section';
import { NowPlayingSection } from './now-playing-section/now-playing-section';
import { PopularSection } from './popular-section/popular-section';
import { TopRatedSection } from './top-rated-section/top-rated-section';
import { UpComingSection } from './up-coming-section/up-coming-section';

@Component({
  selector: 'app-homepage',
  imports: [BannerSection, NowPlayingSection, PopularSection, TopRatedSection, UpComingSection],
  templateUrl: './homepage.html',
})
export class Homepage {}
