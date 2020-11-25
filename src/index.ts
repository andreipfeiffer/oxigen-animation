import anime from "animejs";
import {
  generateName,
  generateScene,
  generatePath,
  drawCircle,
  drawText,
  getCenter,
  formatNumber,
  Color,
} from "./utils";

let scene: SVGSVGElement = null;

let total_circle: SVGCircleElement = null;
let text_necesar: SVGTextElement = null;
let text_necesar_val: SVGTextElement = null;

let text_strans: SVGTextElement = null;
let text_strans_val: SVGTextElement = null;

let text_donatori: SVGTextElement = null;
let text_donatori_val: SVGTextElement = null;

let progress_circle: SVGCircleElement = null;

const WIDTH = 650;
let total = 0;
let suma = 0;
let donatori = 0;

export function init(data: Init) {
  if (scene) {
    scene.parentNode.removeChild(scene);
  }

  total = data.total_necesar;

  // store scene reference
  scene = generateScene(WIDTH, WIDTH);
  data.element.appendChild(scene);

  renderScene();
}

export function update(data: Progres) {
  if (!scene) {
    throw new Error("Not initialized! Call .init() first");
  }

  suma = data.total_strans;
  donatori = data.donatori;

  const progress_size = getProgressWidth();
  progress_circle.setAttribute("r", `${progress_size / 2}`);

  const title_y = getTitleY();
  text_necesar.setAttribute("y", `${title_y}`);
  text_necesar_val.setAttribute("y", `${title_y}`);

  const { y } = getCenter();
  const inner_offset = getInnerTextOffset();
  text_strans.setAttribute("y", `${y - inner_offset}`);
  text_strans_val.setAttribute("y", `${y - inner_offset}`);
  text_strans_val.textContent = formatNumber(suma);

  text_donatori.setAttribute("y", `${y + inner_offset}`);
  text_donatori_val.setAttribute("y", `${y + inner_offset}`);
  text_donatori_val.textContent = String(donatori);

  // renderScene();
}

export function animate(data: Donator = { nume: "", suma: 0 }) {
  const { nume, suma } = data;
  console.log("animate()", { nume, suma });

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
  text_necesar.setAttribute("transform", `translate(0, -5)`);
  scene.appendChild(text_necesar);

  text_necesar_val = drawText(formatNumber(total), {
    fill: Color.white,
    size: 37,
    x,
    y: title_y,
    valign: "hanging",
  });
  text_necesar_val.setAttribute("transform", `translate(0, 5)`);
  scene.appendChild(text_necesar_val);

  const inner_text_offset = getInnerTextOffset();

  text_strans = drawText("Suma stransa", {
    fill: Color.black,
    size: 18,
    x,
    y: y - inner_text_offset,
    valign: "baseline",
  });
  text_strans.setAttribute("transform", `translate(0, -5)`);
  scene.appendChild(text_strans);

  text_strans_val = drawText(formatNumber(suma), {
    fill: Color.black,
    size: 38,
    x,
    y: y - inner_text_offset,
    valign: "hanging",
  });
  text_strans_val.setAttribute("transform", `translate(0, 5)`);
  scene.appendChild(text_strans_val);

  text_donatori = drawText("Donatori", {
    fill: Color.black,
    size: 18,
    x,
    y: y + inner_text_offset,
    valign: "baseline",
  });
  text_donatori.setAttribute("transform", `translate(0, -5)`);
  scene.appendChild(text_donatori);

  text_donatori_val = drawText(String(donatori), {
    fill: Color.black,
    size: 40,
    x,
    y: y + inner_text_offset,
    valign: "hanging",
  });
  text_donatori_val.setAttribute("transform", `translate(0, 5)`);
  scene.appendChild(text_donatori_val);
}

function getProgressWidth() {
  if (suma === 0) {
    return 0;
  }

  return (suma * WIDTH) / total;
}

function getTitleY() {
  const { y } = getCenter();
  // middle between the 2 circles
  return (y - getProgressWidth() / 2) / 2;
}

function getInnerTextOffset() {
  // at half of the inner radius
  return getProgressWidth() / 4 - 10;
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
