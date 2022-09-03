import { QueryClient } from '@tanstack/react-query';
import {
  RenderHookOptions,
  renderHook as defaultRenderHook,
  waitFor,
} from '@testing-library/react';
import {
  StudioLivepeerProvider,
  studioProvider,
} from 'livepeer/providers/studio';

import * as React from 'react';

import { LivepeerConfig } from '../src';
import { Client, createReactClient } from '../src/client';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Prevent Jest from garbage collecting cache
      cacheTime: Infinity,
      // Turn off retries to prevent timeouts
      retry: false,
    },
  },
  logger: {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    error: () => {},
    log: console.log,
    warn: console.warn,
  },
});

type Props = { client?: Client<StudioLivepeerProvider> } & {
  children?:
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactNode;
};
export function wrapper({
  client = createReactClient({
    provider: studioProvider({
      apiKey:
        process.env.STUDIO_API_KEY ?? 'a2f68bb3-02df-4ef8-9142-adef671988ca',
    }),
    queryClient,
  }),
  ...rest
}: Props = {}) {
  return <LivepeerConfig client={client} {...rest} />;
}

export function renderHook<TResult, TProps>(
  hook: (props: TProps) => TResult,
  {
    wrapper: wrapper_,
    ...options_
  }:
    | RenderHookOptions<TProps & { client?: Client<StudioLivepeerProvider> }>
    | undefined = {},
) {
  const options: RenderHookOptions<
    TProps & { client?: Client<StudioLivepeerProvider> }
  > = {
    ...(wrapper_
      ? { wrapper: wrapper_ }
      : {
          wrapper: (props) => wrapper({ ...props, ...options_?.initialProps }),
        }),
    ...options_,
  };

  queryClient.clear();

  const utils = defaultRenderHook<TResult, TProps>(hook, options);
  return {
    ...utils,
    waitFor: (utils as { waitFor?: typeof waitFor })?.waitFor ?? waitFor,
  };
}

export { act, cleanup } from '@testing-library/react';

export { getSampleVideo, getSigners } from '../../core/test';