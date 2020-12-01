import { Donator } from "./types";

const svgNS = "http://www.w3.org/2000/svg";

// these are initialized in generateScene()
const SCENE: Size = {
  w: 0,
  h: 0,
};
export const BUBBLE_RADIUS = 40;

export const enum Color {
  primary = "var(--color-primary)",
  black = "#000000",
  white = "#ffffff",
}

export function generateName(data: Donator) {
  const group = document.createElementNS(svgNS, "g");
  const text_group = document.createElementNS(svgNS, "g");
  text_group.setAttributeNS(null, "class", "texts");
  text_group.setAttributeNS(null, "opacity", "0");

  const circle = drawCircle({
    cx: 0,
    cy: 0,
    r: BUBBLE_RADIUS,
    fill: Color.white,
  });
  circle.setAttributeNS(null, "stroke", Color.primary);
  circle.setAttributeNS(null, "stroke-width", "5");

  const nume = drawText(data.nume, {
    fill: Color.black,
    size: 11,
    x: 0,
    y: 5,
    valign: "baseline",
  });
  nume.setAttributeNS(null, "opacity", "0.5");

  const suma = drawText(formatNumber(data.suma), {
    fill: Color.black,
    size: 16,
    x: 0,
    y: 5,
    valign: "hanging",
  });

  // texts are placed inside another group, to animate them easier
  text_group.appendChild(nume);
  text_group.appendChild(suma);

  group.appendChild(circle);
  group.appendChild(text_group);

  return group;
}

export function generateScene(width: number, height: number) {
  SCENE.w = width;
  SCENE.h = height;

  const svg = document.createElementNS(svgNS, "svg");
  svg.style.display = "block";
  svg.style.maxHeight = "100vh";
  svg.setAttributeNS(null, "viewBox", `0 0 ${width} ${height}`);
  svg.setAttributeNS(null, "x", `0px`);
  svg.setAttributeNS(null, "y", `0px`);
  return svg;
}

function getPathCoords(start: Point, end: Point) {
  const inflexion_count = getRandom(10, 5);
  const amplitude = getRandomAmplitude();
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

  let bezier = `M ${start.x} ${start.y} Q ${control_point.x} ${control_point.y}, ${inflexion_points[0].x} ${inflexion_points[0].y}`;
  for (let i = 1; i < inflexion_points.length; i++) {
    bezier += ` T ${inflexion_points[i].x} ${inflexion_points[i].y}`;
  }
  bezier += ` T ${end.x} ${end.y}`;

  return bezier;
}

export function createPath(start: Point, end: Point) {
  const path = document.createElementNS(svgNS, "path");
  path.setAttributeNS(null, "fill", "none");
  path.setAttributeNS(null, "stroke", "none");
  path.setAttributeNS(null, "d", getPathCoords(start, end));

  return path;
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

export function createGroup() {
  return document.createElementNS(svgNS, "g");
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

export function drawText(
  value: string,
  attrs: {
    x: number;
    y: number;
    size: number;
    fill: Color;
    valign?: "hanging" | "middle" | "baseline";
  }
) {
  const { fill, x, y, size, valign = "middle" } = attrs;

  let offset_y = 0;

  switch (valign) {
    case "baseline":
      offset_y = -size / 2 - 5;
      break;
    case "hanging":
      offset_y = size / 2 + 5;
      break;
  }

  const text = document.createElementNS(svgNS, "text");
  text.setAttributeNS(null, "text-anchor", "middle");
  // this is not fully supported
  // text.setAttributeNS(null, "alignment-baseline", valign);
  text.setAttributeNS(null, "font-size", `${size}`);
  text.setAttributeNS(null, "font-family", `Montserrat`);
  text.setAttributeNS(null, "fill", fill);
  text.setAttributeNS(null, "x", `${x}`);
  text.setAttributeNS(null, "y", `${y}`);
  text.setAttributeNS(null, "transform", `translate(0, ${offset_y})`);
  text.textContent = value;

  return text;
}

export function formatNumber(value: number) {
  return Intl.NumberFormat("ro", {}).format(value);
}

function getRandomAmplitude() {
  const amplitude = getRandom(30, 20);
  if (getRandom(1) === 1) {
    return amplitude;
  }
  return -amplitude;
}

type Point = {
  x: number;
  y: number;
};

type Size = {
  w: number;
  h: number;
};
