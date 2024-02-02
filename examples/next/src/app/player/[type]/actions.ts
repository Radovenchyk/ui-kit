"use server";

import { ClipPayload } from "livepeer/dist/models/components";
import { livepeer } from "../../livepeer";

export const createClip = async (opts: ClipPayload) => {
  try {
    const result = await livepeer.stream.createClip({
      ...opts,
    });

    if (!result.object?.asset?.playbackId) {
      return { success: false, error: "PLAYBACK_ID_MISSING" } as const;
    }

    return {
      success: true,
      playbackId: result.object?.asset?.playbackId,
    } as const;
  } catch (e) {
    console.error(e);

    return { success: false, error: "CLIP_ERROR" } as const;
  }
};