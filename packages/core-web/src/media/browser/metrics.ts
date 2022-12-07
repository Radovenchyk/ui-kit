import { createControllerStore } from '@livepeer/core/media';

import {
  MediaMetrics,
  addEventListeners,
  addMediaMetricsToInitializedStore,
  getDeviceInfo,
} from './controls';

/**
 * Gather playback metrics from a generic HTML5 video/audio element and
 * report them to a websocket. Automatically handles a redirect to get the
 * metrics endpoint.
 *
 * @param element Element to capture playback metrics from.
 * @param sourceUrl Source URL for the player.
 * @param onError Callback when an error with metrics occurs.

 * @returns A callback for destroying the store and metrics.
 */
export function addMediaMetrics<TElement extends HTMLMediaElement>(
  element: TElement | undefined | null,
  sourceUrl: string | undefined | null,
  onError?: (error: unknown) => void,
): MediaMetrics<TElement> {
  const store = createControllerStore<TElement>({
    element: element ?? null,
    device: getDeviceInfo(),
  });

  const { destroy: destroyListeners } = addEventListeners(store, {
    hotkeys: false,
    autohide: 0,
  });

  const { metrics, destroy: destroyMetrics } =
    addMediaMetricsToInitializedStore(store, sourceUrl, onError);

  return {
    metrics,
    destroy: () => {
      destroyListeners?.();
      destroyMetrics?.();
      store?.destroy?.();
    },
  };
}