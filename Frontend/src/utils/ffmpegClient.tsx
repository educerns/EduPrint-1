import { createFFmpeg } from '@ffmpeg/ffmpeg';

let ffmpeg: any = null;

export const getFFmpeg = async () => {
  if (!ffmpeg) {
    ffmpeg = createFFmpeg({
      log: true,
      corePath: '/ffmpeg/ffmpeg-core.js'  // local files, NOT CDN
      
    });

    await ffmpeg.load();
  }

  return ffmpeg;
};
