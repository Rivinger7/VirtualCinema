import { Injectable } from '@angular/core';
import { tmdb } from '../../../core/providers/tmdb';
import {
  TVAppendToResponseNamespace,
  TVDetailsWithAppends,
  TVSeriesDetails,
} from '@lorenzopant/tmdb';

@Injectable({
  providedIn: 'root',
})
export class TVShowService {
  async getTVShowGenres() {
    return await tmdb.genres.tv_list();
  }

  async getTVShowDetails(tvShowId: number): Promise<TVSeriesDetails> {
    return await tmdb.tv_series.details({ series_id: tvShowId });
  }

  async getTVShowDetailsWithAppendResponseNamespace<
    AppendResponses extends TVAppendToResponseNamespace[],
  >(
    tvShowId: number,
    appendResponse: AppendResponses,
  ): Promise<TVDetailsWithAppends<AppendResponses>> {
    return (await tmdb.tv_series.details({
      series_id: tvShowId,
      append_to_response: appendResponse,
    })) as TVDetailsWithAppends<AppendResponses>;
  }

  async getTVShowsByGenre(genreId: number, page: number = 1) {
    return await tmdb.discover.tv({
      with_genres: genreId,
      page,
    });
  }
}
