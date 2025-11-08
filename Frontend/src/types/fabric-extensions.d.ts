import { fabric } from "fabric";

declare module "fabric" {
  interface Canvas {
    sendToBack(object: fabric.Object): void;
    bringToFront(object: fabric.Object): void;
  }
}
