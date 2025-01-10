import { SpotifyApi } from '@spotify/web-api-ts-sdk';

class SpotifyService {
  #api: SpotifyApi;

  constructor() {
    this.#api = SpotifyApi.withClientCredentials(
      process.env.SPOTIFY_CLIENT_ID || '',
      process.env.SPOTIFY_CLIENT_SECRET || '',
    )
  }

  public get = () => {
    return this.#api;
  }
}

export { SpotifyService };
