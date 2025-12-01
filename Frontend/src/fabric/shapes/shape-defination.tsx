import React from "react";
import fabric  from "fabric";

interface ShapeDefinition {
  type: string;
  label: string;
  defaultProps: Record<string, any>;
  thumbnail: (fabric: any, canvas: fabric.Canvas | fabric.StaticCanvas) => void;
}

export const shapeDefinitions: Record<string, ShapeDefinition> = {
  rectangle: {
    type: "rect",
    label: "Rectangle",
    defaultProps: {
      width: 100,
      height: 60,
      fill: "#000000",
    },
    thumbnail: (fabric: any, canvas: fabric.Canvas | fabric.StaticCanvas) => {
      const rect = new fabric.Rect({
        left: 15,
        top: 35,
        width: 70,
        height: 35,
        fill: "#000000",
      });
      canvas.add(rect);
    },
  },

  square: {
    type: "square",
    label: "Square",
    defaultProps: {
      width: 60,
      height: 60,
      fill: "#000000",
    },
    thumbnail: (fabric: any, canvas: fabric.Canvas | fabric.StaticCanvas) => {
      const square = new fabric.Rect({
        left: 20,
        top: 20,
        width: 60,
        height: 60,
        fill: "#000000",
      });
      canvas.add(square);
    },
  },

  circle: {
    type: "circle",
    label: "Circle",
    defaultProps: {
      radius: 30,
      fill: "#000000",
    },
    thumbnail: (fabric: any, canvas: fabric.Canvas | fabric.StaticCanvas) => {
      const circle = new fabric.Circle({
        left: 25,
        top: 25,
        radius: 30,
        fill: "#000000",
      });
      canvas.add(circle);
    },
  },

  ellipse: {
    type: "ellipse",
    label: "Ellipse",
    defaultProps: {
      rx: 40,
      ry: 25,
      fill: "#000000",
    },
    thumbnail: (fabric: any, canvas: fabric.Canvas | fabric.StaticCanvas) => {
      const ellipse = new fabric.Ellipse({
        left: 20,
        top: 30,
        rx: 35,
        ry: 20,
        fill: "#000000",
      });
      canvas.add(ellipse);
    },
  },

  triangle: {
    type: "triangle",
    label: "Triangle",
    defaultProps: {
      width: 70,
      height: 60,
      fill: "#000000",
    },
    thumbnail: (fabric: any, canvas: fabric.Canvas | fabric.StaticCanvas) => {
      const tri = new fabric.Triangle({
        left: 20,
        top: 25,
        width: 60,
        height: 50,
        fill: "#000000",
      });
      canvas.add(tri);
    },
  },

  pentagon: {
    type: "polygon",
    label: "Pentagon",
    defaultProps: {
      fill: "#000000",
    },
    thumbnail: (fabric: any, canvas: fabric.Canvas | fabric.StaticCanvas) => {
      const points = [
        { x: 50, y: 10 },
        { x: 90, y: 35 },
        { x: 75, y: 80 },
        { x: 25, y: 80 },
        { x: 10, y: 35 },
      ];
      const pentagon = new fabric.Polygon(points, {
        fill: "#000000",
        left: 10,
        top: 10,
      });
      canvas.add(pentagon);
    },
  },

  hexagon: {
    type: "polygon",
    label: "Hexagon",
    defaultProps: {
      fill: "#000000",
    },
    thumbnail: (fabric: any, canvas: fabric.Canvas | fabric.StaticCanvas) => {
      const points = [
        { x: 50, y: 10 },
        { x: 85, y: 30 },
        { x: 85, y: 70 },
        { x: 50, y: 90 },
        { x: 15, y: 70 },
        { x: 15, y: 30 },
      ];
      const hexagon = new fabric.Polygon(points, {
        fill: "#000000",
        left: 10,
        top: 10,
      });
      canvas.add(hexagon);
    },
  },
};
