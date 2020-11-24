import anime from "animejs";
import {
  generateName,
  generateScene,
  generatePath,
  drawCircle,
  getCenter,
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
    complete: function (anim) {
      scene.removeChild(name);
      scene.removeChild(path);
    },
  });
}

export function init(data: Init) {
  const { element, total_necesar, total_strans, donatori } = data;

  console.log("init()", { element, total_necesar, total_strans, donatori });

  const dimensions = element.getBoundingClientRect();

  scene = generateScene(dimensions.width, dimensions.width);
  element.appendChild(scene);

  const { x, y } = getCenter();

  const target = drawCircle({ cx: x, cy: y, r: x, fill: Color.primary });
  scene.appendChild(target);

  const progress = drawCircle({ cx: x, cy: y, r: x / 2, fill: Color.white });
  scene.appendChild(progress);
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
