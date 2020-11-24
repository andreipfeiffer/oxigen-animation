const svgNS = "http://www.w3.org/2000/svg";

// these are initialized in generateScene()
const SCENE: Size = {
  w: 0,
  h: 0,
};

export const enum Color {
  primary = "#FF0202",
  black = "#000000",
  white = "#ffffff",
}

export function generateName() {
  const circle = document.createElementNS(svgNS, "circle");
  circle.setAttributeNS(null, "fill", "blue");
  circle.setAttributeNS(null, "cx", "0");
  circle.setAttributeNS(null, "cy", "0");
  circle.setAttributeNS(null, "r", "10");
  return circle;
}

export function generateScene(width: number, height: number) {
  SCENE.w = width;
  SCENE.h = height;

  const svg = document.createElementNS(svgNS, "svg");
  svg.style.display = "block";
  svg.setAttributeNS(null, "width", `${width}`);
  svg.setAttributeNS(null, "height", `${height}`);
  return svg;
}

function getPathCoords(start: Point) {
  const inflexion_count = 4;
  const amplitude = 30;
  const step_x = (getCenter().x - start.x) / inflexion_count;
  const step_y = (getCenter().y - start.y) / inflexion_count;

  const inflexion_points: Point[] = Array(inflexion_count - 1)
    .fill(0)
    .map((_, index) => ({
      x: start.x + step_x * (index + 1),
      y: start.y + step_y * (index + 1),
    }));

  const control_point: Point = {
    x: start.x + step_x / 2 - amplitude,
    y: start.y + step_y / 2,
  };

  // console.log({ inflexion_points });

  return `M ${start.x} ${start.y} Q ${control_point.x} ${control_point.y}, ${
    inflexion_points[0].x
  } ${inflexion_points[0].y} T ${inflexion_points[1].x} ${
    inflexion_points[1].y
  } T ${inflexion_points[2].x} ${inflexion_points[2].y} T ${getCenter().x} ${
    getCenter().y
  }`;
  // return `M ${start.x} ${start.y} Q 52.5 100, 95 60 T ${getCenter().x} ${getCenter().y}`;
}

export function generatePath() {
  const x = getRandom(SCENE.w);
  const y = SCENE.h;
  return createPath({ x, y });
}

export function createPath(start: Point) {
  const path = document.createElementNS(svgNS, "path");
  path.setAttributeNS(null, "fill", "none");
  path.setAttributeNS(null, "stroke", "black");
  path.setAttributeNS(null, "d", getPathCoords(start));

  const svg = document.createElementNS(svgNS, "svg");
  svg.appendChild(path);

  return svg;
}

export function getRandom(max: number, min: number = 0) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getCenter(): Point {
  const center = Math.floor(SCENE.w / 2);
  return {
    x: center,
    y: center,
  };
}

export function drawCircle(attrs: {
  /** center X */
  cx: number;
  /** center Y */
  cy: number;
  /** radius */
  r: number;
  fill: Color;
}) {
  const { fill, cx, cy, r } = attrs;
  const circle = document.createElementNS(svgNS, "circle");
  circle.setAttributeNS(null, "fill", fill);
  circle.setAttributeNS(null, "cx", `${cx}`);
  circle.setAttributeNS(null, "cy", `${cy}`);
  circle.setAttributeNS(null, "r", `${r}`);
  return circle;
}

type Point = {
  x: number;
  y: number;
};

type Size = {
  w: number;
  h: number;
};
