import anime from "animejs";
import {
  generateName,
  generateScene,
  drawTarget,
  createPath,
  getRandom,
  SCENE_COORDS,
} from "./utils";

document
  .getElementById("generate_path")
  .addEventListener("click", generatePath, false);

const scene = generateScene();
document.body.appendChild(scene);
const target = drawTarget();
scene.appendChild(target);

function generatePath() {
  const x = getRandom(SCENE_COORDS.x);
  const y = SCENE_COORDS.y;

  const path = createPath({ x, y });
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
    // loop: true,
    complete: function (anim) {
      scene.removeChild(name);
      // scene.removeChild(path);
    },
  });
}
