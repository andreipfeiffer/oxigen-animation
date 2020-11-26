import { Donator } from "./types";

const svgNS = "http://www.w3.org/2000/svg";

// these are initialized in generateScene()
const SCENE: Size = {
  w: 0,
  h: 0,
};
export const BUBBLE_RADIUS = 40;

export const enum Color {
  primary = "#FF0202",
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
  circle.setAttributeNS(null, "stroke-width", "6");

  const nume = drawText(data.nume, {
    fill: Color.black,
    size: 11,
    x: 0,
    y: 0,
    valign: "baseline",
  });
  nume.setAttributeNS(null, "transform", `translate(0, -5)`);
  nume.setAttributeNS(null, "opacity", "0.5");

  const suma = drawText(formatNumber(data.suma), {
    fill: Color.black,
    size: 16,
    x: 0,
    y: 0,
    valign: "hanging",
  });
  suma.setAttributeNS(null, "transform", `translate(0, 5)`);

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
  svg.setAttributeNS(null, "viewBox", `0 0 ${width} ${height}`);
  svg.setAttributeNS(null, "x", `0px`);
  svg.setAttributeNS(null, "y", `0px`);
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
  const y = SCENE.h - BUBBLE_RADIUS / 2;
  return createPath({ x, y });
}

export function createPath(start: Point) {
  const path = document.createElementNS(svgNS, "path");
  path.setAttributeNS(null, "fill", "none");
  path.setAttributeNS(null, "stroke", "none");
  path.setAttributeNS(null, "d", getPathCoords(start));

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

  const text = document.createElementNS(svgNS, "text");
  text.setAttributeNS(null, "text-anchor", "middle");
  text.setAttributeNS(null, "alignment-baseline", valign);
  text.setAttributeNS(null, "font-size", `${size}`);
  text.setAttributeNS(null, "font-family", `Montserrat`);
  text.setAttributeNS(null, "fill", fill);
  text.setAttributeNS(null, "x", `${x}`);
  text.setAttributeNS(null, "y", `${y}`);
  text.textContent = value;

  return text;
}

export function formatNumber(value: number) {
  return Intl.NumberFormat("ro", {}).format(value);
}

type Point = {
  x: number;
  y: number;
};

type Size = {
  w: number;
  h: number;
};
