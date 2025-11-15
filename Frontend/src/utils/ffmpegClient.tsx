// src/utils/ffmpegClient.js

import { FFmpeg } from '@ffmpeg/ffmpeg';

let ffmpeg;

export const getFFmpeg = async () => {
  if (!ffmpeg) {
    ffmpeg = new FFmpeg();

    await ffmpeg.load({
      coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.3/dist/ffmpeg-core.js',
      wasmURL: 'https://unpkg.com/@ffmpeg/core@0.12.3/dist/ffmpeg-core.wasm'
    });
  }

  return ffmpeg;
};
