import anime from "animejs";
import {
  generateName,
  generateScene,
  generatePath,
  drawCircle,
  drawText,
  getCenter,
  getScaled,
  formatNumber,
  Color,
} from "./utils";

let scene: SVGSVGElement = null;

let total_circle: SVGCircleElement = null;
let text_necesar: SVGTextElement = null;
let text_necesar_suma: SVGTextElement = null;

let progress_circle: SVGCircleElement = null;

let width = 0;
let total = 0;
let suma = 0;
let donatori = 0;

function animate() {
  if (!scene) {
    throw new Error("Not initialized! Call .init() first");
  }

  const path = generatePath();
  scene.appendChild(path);

  const name = generateName();
  scene.appendChild(name);

  var p = anime.path(path.querySelector("path"));

  anime({
    targets: name,
    translateX: p("x"),
    translateY: p("y"),
    rotate: p("angle"),
    easing: "easeInOutSine",
    duration: 1000,
    complete: function (/*anim*/) {
      scene.removeChild(name);
      scene.removeChild(path);
    },
  });
}

export function init(data: Init) {
  if (scene) {
    scene.parentNode.removeChild(scene);
  }

  total = data.total_necesar;

  const size = data.element.getBoundingClientRect();
  width = size.width;

  // store scene reference
  scene = generateScene(width, width);
  data.element.appendChild(scene);

  renderScene();
}

export function updateProgress(data: Progres) {
  if (!scene) {
    throw new Error("Not initialized! Call .init() first");
  }

  suma = data.total_strans;
  donatori = data.donatori;

  const progress_size = getProgressWidth();
  progress_circle.setAttribute("r", `${progress_size / 2}`);

  const title_y = getTitleY();
  text_necesar.setAttribute("y", `${title_y}`);
  text_necesar_suma.setAttribute("y", `${title_y}`);
}

export function animateBubble(data: Donator = { nume: "", suma: 0 }) {
  const { nume, suma } = data;
  console.log("animateBubble()", { nume, suma });

  animate();
}

function renderScene() {
  const { x, y } = getCenter();
  const progress_width = getProgressWidth();

  total_circle = drawCircle({ cx: x, cy: y, r: x, fill: Color.primary });
  scene.appendChild(total_circle);

  progress_circle = drawCircle({
    cx: x,
    cy: y,
    r: progress_width / 2,
    fill: Color.white,
  });
  scene.appendChild(progress_circle);

  const title_y = getTitleY();
  // console.log({ y, progress_radius, title_y });

  text_necesar = drawText("Necesar", {
    fill: Color.white,
    size: 18,
    x,
    y: title_y,
    valign: "baseline",
  });
  text_necesar.setAttribute("transform", `translate(0, -${getScaled(5)})`);
  scene.appendChild(text_necesar);

  text_necesar_suma = drawText(formatNumber(total), {
    fill: Color.white,
    size: 37,
    x,
    y: title_y,
    valign: "hanging",
  });
  text_necesar_suma.setAttribute("transform", `translate(0, ${getScaled(5)})`);
  scene.appendChild(text_necesar_suma);
}

function getProgressWidth() {
  if (suma === 0) {
    return 0;
  }

  return (suma * width) / total;
}

function getTitleY() {
  const { y } = getCenter();
  // middle between the 2 circles
  return (y - getProgressWidth() / 2) / 2;
}

type Init = {
  element: HTMLElement;
  total_necesar: number;
};

type Progres = {
  total_strans: number;
  donatori: number;
};

type Donator = {
  nume: string;
  suma: number;
};
