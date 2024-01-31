"use client";

import * as Assets from "@livepeer/react/assets";
import * as Broadcast from "@livepeer/react/broadcast";

import { useState } from "react";
import { Settings } from "./Settings";

export function BroadcastWithControls() {
  const [streamKey, setStreamKey] = useState<string | null>(
    "398d-5x6h-0yy6-zhq2",
  );

  return (
    <div className="w-full max-w-2xl gap-4 flex flex-col items-center mx-auto">
      <div className="flex flex-col items-center gap-1">
        <label className="text-xs text-white/80" htmlFor="streamKey">
          Stream Key
        </label>
        <input
          name="streamKey"
          type="text"
          className="focus:outline-none font-light text-white/90 text-sm focus:ring-1 focus:ring-white/30 px-1 rounded-sm bg-white/5"
          onChange={(e) => setStreamKey(e.target.value)}
          value={streamKey ?? undefined}
        />
      </div>
      {streamKey && (streamKey?.length ?? 0) === 19 ? (
        <>
          <Broadcast.Root aspectRatio={16 / 9} streamKey={streamKey}>
            <Broadcast.Container className="w-full h-full overflow-hidden rounded-sm bg-gray-950">
              <Broadcast.Video title="Live stream" className="w-full h-full" />

              <Broadcast.LoadingIndicator className="w-full relative h-full">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Assets.LoadingIcon className="w-8 h-8 animate-spin" />
                </div>
                <BroadcastLoading />
              </Broadcast.LoadingIndicator>

              <Broadcast.ErrorIndicator
                matcher="all"
                className="absolute select-none inset-0 text-center bg-gray-950 flex flex-col items-center justify-center gap-4 duration-1000 data-[visible=true]:animate-in data-[visible=false]:animate-out data-[visible=false]:fade-out-0 data-[visible=true]:fade-in-0"
              >
                <Assets.OfflineErrorIcon className="h-[120px] w-full sm:flex hidden" />
                <div className="flex flex-col gap-1">
                  <div className="text-2xl font-bold">Broadcast failed</div>
                  <div className="text-sm text-gray-100">
                    There was an error with broadcasting - it is retrying in the
                    background.
                  </div>
                </div>
              </Broadcast.ErrorIndicator>

              <Broadcast.Controls className="bg-gradient-to-b gap-1 px-3 md:px-3 py-1.5 flex-col-reverse flex from-black/20 via-80% via-black/30 duration-1000 to-black/60 data-[visible=true]:animate-in data-[visible=false]:animate-out data-[visible=false]:fade-out-0 data-[visible=true]:fade-in-0">
                <div className="flex justify-between gap-4">
                  <div className="flex flex-1 items-center gap-3">
                    <Broadcast.VideoEnabledTrigger className="w-6 h-6 hover:scale-110 transition-all flex-shrink-0">
                      <Broadcast.VideoEnabledIndicator asChild matcher={false}>
                        <Assets.DisableVideoIcon className="w-full h-full" />
                      </Broadcast.VideoEnabledIndicator>
                      <Broadcast.VideoEnabledIndicator asChild matcher={true}>
                        <Assets.EnableVideoIcon className="w-full h-full" />
                      </Broadcast.VideoEnabledIndicator>
                    </Broadcast.VideoEnabledTrigger>
                    <Broadcast.AudioEnabledTrigger className="w-6 h-6 hover:scale-110 transition-all flex-shrink-0">
                      <Broadcast.AudioEnabledIndicator asChild matcher={false}>
                        <Assets.DisableAudioIcon className="w-full h-full" />
                      </Broadcast.AudioEnabledIndicator>
                      <Broadcast.AudioEnabledIndicator asChild matcher={true}>
                        <Assets.EnableAudioIcon className="w-full h-full" />
                      </Broadcast.AudioEnabledIndicator>
                    </Broadcast.AudioEnabledTrigger>
                  </div>
                  <div className="flex sm:flex-1 md:flex-[1.5] justify-end items-center gap-2.5">
                    <Settings className="w-6 h-6 transition-all flex-shrink-0" />

                    <Broadcast.ScreenshareTrigger className="w-6 h-6 hover:scale-110 transition-all flex-shrink-0">
                      <Broadcast.ScreenshareIndicator asChild>
                        <Assets.StopScreenshareIcon className="w-full h-full" />
                      </Broadcast.ScreenshareIndicator>

                      <Broadcast.ScreenshareIndicator matcher={false} asChild>
                        <Assets.StartScreenshareIcon className="w-full h-full" />
                      </Broadcast.ScreenshareIndicator>
                    </Broadcast.ScreenshareTrigger>

                    <Broadcast.PictureInPictureTrigger className="w-6 h-6 hover:scale-110 transition-all flex-shrink-0">
                      <Assets.PictureInPictureIcon className="w-full h-full" />
                    </Broadcast.PictureInPictureTrigger>

                    <Broadcast.FullscreenTrigger className="w-6 h-6 hover:scale-110 transition-all flex-shrink-0">
                      <Broadcast.FullscreenIndicator asChild>
                        <Assets.ExitFullscreenIcon className="w-full h-full" />
                      </Broadcast.FullscreenIndicator>

                      <Broadcast.FullscreenIndicator matcher={false} asChild>
                        <Assets.EnterFullscreenIcon className="w-full h-full" />
                      </Broadcast.FullscreenIndicator>
                    </Broadcast.FullscreenTrigger>
                  </div>
                </div>
              </Broadcast.Controls>

              <Broadcast.LoadingIndicator asChild matcher={false}>
                <div className="absolute overflow-hidden py-1 px-2 rounded-full top-1 left-1 bg-black/50 flex items-center backdrop-blur">
                  <Broadcast.EnabledIndicator
                    matcher={true}
                    className="flex gap-2 items-center"
                  >
                    <div className="bg-red-500 animate-pulse h-1.5 w-1.5 rounded-full" />
                    <span className="text-xs select-none">LIVE</span>
                  </Broadcast.EnabledIndicator>

                  <Broadcast.EnabledIndicator
                    className="flex gap-2 items-center"
                    matcher={false}
                  >
                    <div className="bg-white/80 h-1.5 w-1.5 rounded-full" />
                    <span className="text-xs select-none">PREVIEW</span>
                  </Broadcast.EnabledIndicator>
                </div>
              </Broadcast.LoadingIndicator>
            </Broadcast.Container>

            <Broadcast.LoadingIndicator matcher={false}>
              <Broadcast.EnabledTrigger className="rounded-md px-4 py-2 bg-white/5 hover:bg-white/10">
                <Broadcast.EnabledIndicator
                  className="gap-1 flex items-center justify-center"
                  matcher={false}
                >
                  <Assets.EnableVideoIcon className="w-7 h-7" />
                  <span className="text-sm">Start broadcast</span>
                </Broadcast.EnabledIndicator>
                <Broadcast.EnabledIndicator
                  className="gap-1 flex items-center justify-center"
                  matcher={true}
                >
                  <Assets.StopIcon className="w-7 h-7" />
                  <span className="text-sm">Stop broadcast</span>
                </Broadcast.EnabledIndicator>
              </Broadcast.EnabledTrigger>

              <div className="w-full flex flex-col sm:flex-row gap-4 items-center justify-center">
                <Settings />
              </div>
            </Broadcast.LoadingIndicator>
          </Broadcast.Root>
        </>
      ) : (
        <BroadcastLoading />
      )}
    </div>
  );
}

export const BroadcastLoading = () => (
  <div className="w-full px-3 md:px-3 py-3 gap-3 flex-col-reverse flex aspect-video max-w-2xl mx-auto animate-pulse bg-white/10 overflow-hidden rounded-sm">
    <div className="flex justify-between">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 animate-pulse bg-white/5 overflow-hidden rounded-lg" />
        <div className="w-16 h-6 md:w-20 md:h-7 animate-pulse bg-white/5 overflow-hidden rounded-lg" />
      </div>

      <div className="flex items-center gap-2">
        <div className="w-6 h-6 animate-pulse bg-white/5 overflow-hidden rounded-lg" />
        <div className="w-6 h-6 animate-pulse bg-white/5 overflow-hidden rounded-lg" />
      </div>
    </div>
    <div className="w-full h-2 animate-pulse bg-white/5 overflow-hidden rounded-lg" />
  </div>
);