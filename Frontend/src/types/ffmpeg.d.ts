declare module "@ffmpeg/ffmpeg" {
  export function createFFmpeg(options?: any): any;
  export function fetchFile(file: string | Blob | Uint8Array): Promise<Uint8Array>;
}
