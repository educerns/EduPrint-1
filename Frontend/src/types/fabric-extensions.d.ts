import * as fabric from "fabric";

declare module "fabric" {
  interface Canvas {
    sendToBack(object: fabric.Object): void;
    bringToFront(object: fabric.Object): void;
  }

  interface Image {
    // MUST match Fabric’s type EXACTLY
    filters: fabric.filters.BaseFilter<
      string,
      Record<string, any>,
      Record<string, any>
    >[];

    applyFilters(): void;
  }
}
