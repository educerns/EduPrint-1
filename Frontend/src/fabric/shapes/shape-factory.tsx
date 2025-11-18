import { shapeDefinitions } from "./shape-defination";

// ✅ Create a Fabric object based on shape type
export const createShape = (
  fabric: any,
  type: string,
  shapeDefinitions: Record<string, any>,
  customProps: Record<string, any> = {}
) => {
  const definition = shapeDefinitions[type];
  if (!definition) {
    // console.warn(`Shape definition not found for type: ${type}`);
    return null;
  }

  // Merge default + custom props
  const props = { ...definition.defaultProps, ...customProps };

  switch (definition.type) {
    // ⬛ Rectangle / Square
    case "rect":
    case "square":
      return new fabric.Rect(props);

    // ⚪ Circle
    case "circle":
      return new fabric.Circle(props);

    // 🥚 Ellipse
    case "ellipse":
      return new fabric.Ellipse(props);

    // 🔺 Triangle
    case "triangle":
      return new fabric.Triangle(props);

    // 🔷 Polygon shapes (pentagon, hexagon, star, etc.)
    case "polygon":
      // If the shapeDefinitions has custom points, use them
      if (definition.points) {
        return new fabric.Polygon(definition.points, props);
      }

      // Default fallback (e.g., pentagon)
      const defaultPoints = [
        { x: 50, y: 10 },
        { x: 90, y: 35 },
        { x: 75, y: 80 },
        { x: 25, y: 80 },
        { x: 10, y: 35 },
      ];
      return new fabric.Polygon(defaultPoints, props);

    // ➖ Line
    case "line":
      return new fabric.Line([0, 0, props.x2 || 100, props.y2 || 0], props);

    // ➡️ Arrow
    case "arrow":
      // Simple line with triangle tip
      const arrow = new fabric.Polyline(
        [
          { x: 10, y: 50 },
          { x: 80, y: 50 },
          { x: 70, y: 40 },
          { x: 80, y: 50 },
          { x: 70, y: 60 },
        ],
        props
      );
      return arrow;

    // ❤️ Heart
    case "heart":
      const path =
        "M 272.701,58.141 C 268.436,23.936 237.145,0 200,0 162.855,0 131.564,23.936 127.299,58.141 122.182,101.651 160.707,130.184 200,176.086 239.293,130.184 277.818,101.651 272.701,58.141 Z";
      return new fabric.Path(path, props);

    default:
      // console.warn(`Unsupported shape type: ${definition.type}`);
      return null;
  }
};
