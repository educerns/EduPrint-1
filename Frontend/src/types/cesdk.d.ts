// ✅ 1️⃣ Declare the CDN-based CreativeEngine module (for direct URL imports)
declare module 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.63.0/index.js' {
  const CreativeEngine: any;
  export default CreativeEngine;
}

// ✅ 2️⃣ Extend @cesdk/cesdk-js types to allow 'video' and other custom block types
declare module '@cesdk/cesdk-js' {
  export interface BlockAPI {
    create(type: 'video' | string): any;
    setString?(block: any, property: string, value: string): void;
    setColor?(block: any, property: string, value: any): void;
    appendChild?(parent: any, child: any): void;
    exportVideo?(block: any, options: any): Promise<Blob>;
  }

  export interface SceneAPI {
    createVideo?(): any;
  }

  const CreativeEditorSDK: any;
  export default CreativeEditorSDK;
}
