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
const HEIGHT = WIDTH + 300;
const OVERFLOW = 20;
let total = 0;
let suma = 0;
let donatori = 0;
let isLoopRunning = false;
let timeout = 0;

export function init(data: Init) {
  if (scene) {
    try {
      scene.remove();
    } catch (error) {
      console.warn(error);
    }
  }

  total = data.total_necesar;

  // store scene reference
  scene = generateScene(WIDTH, HEIGHT);
  data.element.appendChild(scene);

  renderScene();
  suma && update({ total_strans: suma, donatori });
}

export function update(data: Progres) {
  if (!scene) {
    throw new Error("Not initialized! Call .init() first");
  }

  suma = data.total_strans;
  donatori = data.donatori;

  const isOverflow = suma > total;
  anime({
    targets: total_circle,
    r: isOverflow ? WIDTH / 2 - OVERFLOW : WIDTH / 2,
    strokeWidth: isOverflow ? OVERFLOW : 0,
    easing: "easeOutQuart",
    duration: 1000,
  });

  const progress_size = getProgressWidth();
  anime({
    targets: progress_circle,
    r: progress_size / 2,
    easing: "spring(1, 100, 10, 0)",
    duration: 1000,
  });

  const title_y = getTitleY();
  anime({
    targets: [text_necesar, text_necesar_val],
    y: title_y,
    easing: "easeOutQuart",
    duration: 1000,
  });

  const title_color = isTitleInside(title_y) ? Color.primary : Color.white;
  text_necesar.setAttributeNS(null, "fill", `${title_color}`);
  text_necesar_val.setAttributeNS(null, "fill", `${title_color}`);

  text_strans_val.textContent = `${formatNumber(suma)} lei`;
  text_donatori_val.textContent = String(donatori);
}

export function stop() {
  timeout && clearTimeout(timeout);
  isLoopRunning = false;
}

export async function animate(data: Donator | Donator[]) {
  if (Array.isArray(data)) {
    if (!isLoopRunning) {
      isLoopRunning = true;
      animateLoop(data);
    }
  } else {
    animateOnce(data);
  }
}

async function animateOnce(data: Donator = { nume: "", suma: 0 }) {
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
      try {
        bubbles_container.removeChild(path);
        bubbles_container.removeChild(name);
      } catch (error) {}
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

  anime({
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

function animateLoop(list: Donator[] = [], index: number = 0) {
  if (!isLoopRunning) {
    return;
  }

  animateOnce(list[index]);

  let nextIndex = index + 1;
  if (nextIndex === list.length) nextIndex = 0;

  sleep(getRandom(6, 2)).then(() => animateLoop(list, nextIndex));
}

function renderScene() {
  const { x, y } = getCenter();

  total_circle = drawCircle({ cx: x, cy: y, r: x, fill: Color.primary });
  total_circle.setAttributeNS(null, "paint-order", "stroke");
  total_circle.setAttributeNS(null, "stroke", `${Color.primary}44`);
  total_circle.setAttributeNS(null, "stroke-width", "0");
  scene.appendChild(total_circle);

  anime({
    targets: total_circle,
    r: [0, x],
    easing: "easeOutQuart",
    duration: 1000,
  });

  bubbles_container = createGroup();
  scene.appendChild(bubbles_container);

  progress_circle = drawCircle({
    cx: x,
    cy: y,
    r: 0,
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

  text_necesar_val = drawText(`${formatNumber(total)} lei`, {
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
    y: y - inner_text_offset - 5,
    valign: "baseline",
  });
  scene.appendChild(text_strans);

  text_strans_val = drawText(`${formatNumber(suma)} lei`, {
    fill: Color.black,
    size: 30,
    x,
    y: y - inner_text_offset + 5,
    valign: "hanging",
  });
  scene.appendChild(text_strans_val);

  text_donatori = drawText("Donatori", {
    fill: Color.black,
    size: 18,
    x,
    y: y + inner_text_offset - 5,
    valign: "baseline",
  });
  scene.appendChild(text_donatori);

  text_donatori_val = drawText(String(donatori), {
    fill: Color.black,
    size: 40,
    x,
    y: y + inner_text_offset + 5,
    valign: "hanging",
  });
  scene.appendChild(text_donatori_val);

  anime({
    targets: [text_strans, text_strans_val],
    opacity: [0, 1],
    translateY: [20, 0],
    easing: "easeOutQuart",
    duration: 2000,
    delay: 500,
  });
  anime({
    targets: [text_donatori, text_donatori_val],
    opacity: [0, 1],
    translateY: [-20, 0],
    easing: "easeOutQuart",
    duration: 2000,
    delay: 500,
  });
}

function getProgressWidth() {
  if (suma === 0) {
    return 0;
  }

  if (suma > total) {
    return WIDTH - 2 * OVERFLOW - 10;
  }

  const progress = (suma * WIDTH) / total;
  return Math.min(progress, WIDTH - 10);
}

function getTitleY() {
  const { y } = getCenter();
  const progress_radius = getProgressWidth() / 2;

  const middle_between_circles = (y - progress_radius) / 2;

  const text_height = 18 + 37 + 10;
  if (middle_between_circles - text_height < 0) {
    return y - progress_radius + text_height;
  }

  return middle_between_circles;
}

function isTitleInside(value: number) {
  const { y } = getCenter();
  const progress_radius = getProgressWidth() / 2;

  return value > y - progress_radius;
}

function getInnerTextOffset() {
  return 40;
  // at half of the inner radius
  // return getProgressWidth() / 4 - 10;
}

function getTotalDuration() {
  const progress_ratio = WIDTH / getProgressWidth();

  // the larger the inner circle
  // the smaller the distance
  // so we need a longer period to display the name
  return 8000 + 4000 / progress_ratio;
}

function getRandomPointX() {
  const progress_width = getProgressWidth();
  const min_x = WIDTH / 2 - progress_width / 2 + BUBBLE_RADIUS;
  const max_x = WIDTH / 2 + progress_width / 2 - BUBBLE_RADIUS;
  return getRandom(max_x, min_x);
}

async function sleep(seconds: number) {
  return new Promise(
    (resolve) =>
      (timeout = window.setTimeout(
        () => requestAnimationFrame(resolve),
        seconds * 1000
      ))
  );
}
