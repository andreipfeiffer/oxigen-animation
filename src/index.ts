import anime from "animejs";
import { Init, Progres, Donator } from "./types";
import {
  generateName,
  generateScene,
  createPath,
  drawCircle,
  drawText,
  createGroup,
  getCenter,
  formatNumber,
  Color,
  BUBBLE_RADIUS,
  getRandom,
} from "./utils";

let scene: SVGSVGElement = null;
let bubbles_container: SVGGElement = null;

let total_circle: SVGCircleElement = null;
let text_necesar: SVGTextElement = null;
let text_necesar_val: SVGTextElement = null;

let text_strans: SVGTextElement = null;
let text_strans_val: SVGTextElement = null;

let text_donatori: SVGTextElement = null;
let text_donatori_val: SVGTextElement = null;

let progress_circle: SVGCircleElement = null;

const WIDTH = 650;
const HEIGHT = WIDTH + 200;
let total = 0;
let suma = 0;
let donatori = 0;

export function init(data: Init) {
  if (scene) {
    scene.parentNode.removeChild(scene);
  }

  total = data.total_necesar;

  // store scene reference
  scene = generateScene(WIDTH, HEIGHT);
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
  progress_circle.setAttributeNS(null, "r", `${progress_size / 2}`);

  const title_y = getTitleY();
  text_necesar.setAttributeNS(null, "y", `${title_y}`);
  text_necesar_val.setAttributeNS(null, "y", `${title_y}`);

  const { y } = getCenter();
  const inner_offset = getInnerTextOffset();
  text_strans.setAttributeNS(null, "y", `${y - inner_offset}`);
  text_strans_val.setAttributeNS(null, "y", `${y - inner_offset}`);
  text_strans_val.textContent = formatNumber(suma);

  text_donatori.setAttributeNS(null, "y", `${y + inner_offset}`);
  text_donatori_val.setAttributeNS(null, "y", `${y + inner_offset}`);
  text_donatori_val.textContent = String(donatori);
}

export async function animate(data: Donator = { nume: "", suma: 0 }) {
  if (!scene) {
    throw new Error("Not initialized! Call .init() first");
  }

  let merged = false;

  const total_duration = getTotalDuration();

  // outside
  const small_duration = 1000;

  const start_x = getRandomPointX();
  const start_y = HEIGHT - BUBBLE_RADIUS;
  const end_x = start_x;
  const end_y = WIDTH / 2;

  const path = createPath({ x: start_x, y: start_y }, { x: end_x, y: end_y });
  bubbles_container.appendChild(path);

  const name = generateName(data);
  bubbles_container.appendChild(name);

  var p = anime.path(path);

  anime({
    targets: name,
    translateX: p("x"),
    translateY: p("y"),
    easing: "easeInSine",
    duration: total_duration,
    complete: function () {
      bubbles_container.removeChild(path);
      bubbles_container.removeChild(name);
    },
    update: function () {
      const str = name.style.transform;
      const pos_start = str.indexOf("translateY") + "translateY".length + 1;
      const pos_end = str.indexOf(")", pos_start);
      const y = parseInt(str.substring(pos_start, pos_end));

      const progress_bottom =
        WIDTH / 2 + getProgressWidth() / 2 + BUBBLE_RADIUS / 2;

      if (!merged && y <= progress_bottom) {
        merged = true;

        const radius = +progress_circle.getAttributeNS(null, "r");

        anime({
          targets: progress_circle,
          keyframes: [
            { r: radius + 3, easing: "easeInQuad", duration: 100 },
            { r: radius, easing: "spring(1, 100, 10, 0)", duration: 300 },
          ],
        });
      }
    },
  });

  const transition_in = anime({
    targets: name.querySelector("circle"),
    opacity: [0, 1],
    r: [0, BUBBLE_RADIUS / 2],
    easing: "spring(1, 80, 10, 10)",
    duration: 1200,
  });

  await transition_in.finished;

  const grow_in = anime({
    targets: name.querySelector("circle"),
    r: BUBBLE_RADIUS,
    easing: "spring(1, 100, 10, 0)",
    duration: 1200,
    delay: small_duration,
  });
  anime({
    targets: name.querySelector(".texts"),
    opacity: 1,
    scale: [0, 1],
    easing: "spring(1, 100, 10, 0)",
    duration: 1200,
    delay: small_duration,
  });
}

function renderScene() {
  const { x, y } = getCenter();
  const progress_width = getProgressWidth();

  total_circle = drawCircle({ cx: x, cy: y, r: x, fill: Color.primary });
  scene.appendChild(total_circle);

  bubbles_container = createGroup();
  scene.appendChild(bubbles_container);

  progress_circle = drawCircle({
    cx: x,
    cy: y,
    r: progress_width / 2,
    fill: Color.white,
  });
  scene.appendChild(progress_circle);

  const title_y = getTitleY();

  text_necesar = drawText("Necesar", {
    fill: Color.white,
    size: 18,
    x,
    y: title_y,
    valign: "baseline",
  });
  text_necesar.setAttributeNS(null, "transform", `translate(0, -5)`);
  scene.appendChild(text_necesar);

  text_necesar_val = drawText(formatNumber(total), {
    fill: Color.white,
    size: 37,
    x,
    y: title_y,
    valign: "hanging",
  });
  text_necesar_val.setAttributeNS(null, "transform", `translate(0, 5)`);
  scene.appendChild(text_necesar_val);

  const inner_text_offset = getInnerTextOffset();

  text_strans = drawText("Suma stransa", {
    fill: Color.black,
    size: 18,
    x,
    y: y - inner_text_offset,
    valign: "baseline",
  });
  text_strans.setAttributeNS(null, "transform", `translate(0, -5)`);
  scene.appendChild(text_strans);

  text_strans_val = drawText(formatNumber(suma), {
    fill: Color.black,
    size: 38,
    x,
    y: y - inner_text_offset,
    valign: "hanging",
  });
  text_strans_val.setAttributeNS(null, "transform", `translate(0, 5)`);
  scene.appendChild(text_strans_val);

  text_donatori = drawText("Donatori", {
    fill: Color.black,
    size: 18,
    x,
    y: y + inner_text_offset,
    valign: "baseline",
  });
  text_donatori.setAttributeNS(null, "transform", `translate(0, -5)`);
  scene.appendChild(text_donatori);

  text_donatori_val = drawText(String(donatori), {
    fill: Color.black,
    size: 40,
    x,
    y: y + inner_text_offset,
    valign: "hanging",
  });
  text_donatori_val.setAttributeNS(null, "transform", `translate(0, 5)`);
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

function getTotalDuration() {
  const progress_ratio = WIDTH / getProgressWidth();

  // the larger the inner circle
  // the smaller the distance
  // so we need a longer period to display the name
  return 8000 + 3000 / progress_ratio;
}

function getRandomPointX() {
  const progress_width = getProgressWidth();
  const min_x = WIDTH / 2 - progress_width / 2 + BUBBLE_RADIUS;
  const max_x = WIDTH / 2 + progress_width / 2 - BUBBLE_RADIUS;
  return getRandom(max_x, min_x);
}
