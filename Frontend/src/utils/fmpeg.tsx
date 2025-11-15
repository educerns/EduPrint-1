import { fetchFile } from "@ffmpeg/util";
import { getFFmpeg } from "../utils/ffmpegClient";

export const convertWebmToMp4 = async (webmBlob) => {
  const ffmpeg = await getFFmpeg();

  // Write input WebM file
  await ffmpeg.writeFile("input.webm", await fetchFile(webmBlob));

  // Run conversion
  await ffmpeg.exec([
    "-i", "input.webm",
    "-c:v", "libx264",
    "-preset", "veryfast",
    "output.mp4"
  ]);

  // Read output MP4
  const data = await ffmpeg.readFile("output.mp4");

  return new Blob([data.buffer], { type: "video/mp4" });
};
