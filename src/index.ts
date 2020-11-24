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

function animate() {
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

  const { element, total_necesar, total_strans, donatori } = data;
  const progress_amount = (total_strans * 100) / total_necesar;
  console.log({ progress_amount });

  console.log("init()", { element, total_necesar, total_strans, donatori });

  const size = element.getBoundingClientRect();
  // const progress_radius = progress_amount / 2;
  const progress_radius = 50;
  console.log({ progress_radius });

  scene = generateScene(size.width, size.width);
  element.appendChild(scene);

  const { x, y } = getCenter();

  const target = drawCircle({ cx: x, cy: y, r: x, fill: Color.primary });
  scene.appendChild(target);

  const progress = drawCircle({
    cx: x,
    cy: y,
    r: progress_radius,
    fill: Color.white,
  });
  scene.appendChild(progress);

  const title_y = (y - progress_radius) / 2;
  console.log({ y, progress_radius, title_y });

  const title1 = drawText("Necesar", {
    fill: Color.white,
    size: 18,
    x,
    y: title_y - getScaled(5),
    valign: "baseline",
  });
  scene.appendChild(title1);

  const title2 = drawText(formatNumber(total_necesar), {
    fill: Color.white,
    size: 37,
    x,
    y: title_y + getScaled(5),
    valign: "hanging",
  });
  scene.appendChild(title2);
}

export function updateProgress(data: Progres) {
  const { total_strans, donatori } = data;
  console.log("setData()", { total_strans, donatori });
}

export function animateBubble(data: Donator = { nume: "", suma: 0 }) {
  const { nume, suma } = data;
  console.log("animateBubble()", { nume, suma });

  animate();
}

type Init = {
  element: HTMLElement;
  total_necesar: number;
} & Progres;

type Progres = {
  total_strans: number;
  donatori: number;
};

type Donator = {
  nume: string;
  suma: number;
};
