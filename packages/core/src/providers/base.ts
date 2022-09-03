import fetch from 'cross-fetch';

import { HttpError } from '../errors';

import {
  Asset,
  CreateAssetArgs,
  CreateStreamArgs,
  GetAssetArgs,
  GetPlaybackInfoArgs,
  GetStreamArgs,
  GetStreamSessionArgs,
  GetStreamSessionsArgs,
  LivepeerProvider,
  LivepeerProviderConfig,
  PlaybackInfo,
  Stream,
  StreamSession,
  UpdateAssetArgs,
  UpdateStreamArgs,
} from '../types';

export type FetchOptions<P = object> = RequestInit & {
  json?: P;
};

export abstract class BaseLivepeerProvider implements LivepeerProvider {
  /** Provider base config */
  readonly _config: LivepeerProviderConfig;
  /** Data fetching library */
  readonly _fetch: typeof fetch;

  constructor(config: LivepeerProviderConfig) {
    this._fetch = fetch;

    this._config = config;
  }

  getConfig(): LivepeerProviderConfig {
    return this._config;
  }

  async _get<T>(
    url:
      | '/stream'
      | `/stream/${string}`
      | `/session/${string}`
      | `/stream/${string}/sessions`
      | '/asset'
      | `/asset/${string}`
      | `/playback/${string}`,
    options?: FetchOptions<never>,
  ): Promise<T> {
    const response = await this._fetch(`${this._config.baseUrl}${url}`, {
      method: 'GET',
      ...options,
    });

    if (!response.ok) {
      throw new HttpError(
        response.status,
        'Provider failed to get object',
        await response.json(),
      );
    }

    return response.json() as Promise<T>;
  }

  async _create<T, P>(
    url: '/stream' | '/asset/request-upload',
    options?: FetchOptions<P>,
  ): Promise<T> {
    const response = await this._fetch(`${this._config.baseUrl}${url}`, {
      method: 'POST',
      ...options,
      ...(options?.json ? { body: JSON.stringify(options.json) } : {}),
      headers: {
        ...(options?.json ? { 'content-type': 'application/json' } : {}),
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new HttpError(
        response.status,
        'Provider failed to create object',
        await response.json(),
      );
    }

    return response.json() as Promise<T>;
  }

  async _update<P>(
    url: `/stream/${string}` | `/asset/${string}`,
    options?: FetchOptions<P>,
  ): Promise<void> {
    const response = await this._fetch(`${this._config.baseUrl}${url}`, {
      method: 'PATCH',
      ...options,
      ...(options?.json ? { body: JSON.stringify(options.json) } : {}),
      headers: {
        ...(options?.json ? { 'content-type': 'application/json' } : {}),
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new HttpError(
        response.status,
        'Provider failed to update object',
        await response.json(),
      );
    }
  }

  abstract createStream(args: CreateStreamArgs): Promise<Stream>;
  abstract updateStream(args: UpdateStreamArgs): Promise<Stream>;
  abstract getStream(args: GetStreamArgs): Promise<Stream>;
  abstract getStreamSession(args: GetStreamSessionArgs): Promise<StreamSession>;
  abstract getStreamSessions(
    args: GetStreamSessionsArgs,
  ): Promise<StreamSession[]>;
  abstract createAsset(args: CreateAssetArgs): Promise<Asset>;
  abstract getAsset(args: GetAssetArgs): Promise<Asset>;
  abstract updateAsset(args: UpdateAssetArgs): Promise<Asset>;
  abstract getPlaybackInfo(args: GetPlaybackInfoArgs): Promise<PlaybackInfo>;
}

export type LivepeerProviderFn<
  TProvider extends LivepeerProvider = BaseLivepeerProvider,
> = () => TProvider;