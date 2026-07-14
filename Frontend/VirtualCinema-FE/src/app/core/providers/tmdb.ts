import { TMDB } from '@lorenzopant/tmdb';

export const tmdb = new TMDB(import.meta.env['NG_APP_TMDB_BEARER_TOKEN']);
