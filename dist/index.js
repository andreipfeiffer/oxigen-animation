var oxygen_animation = (function (exports, anime) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var anime__default = /*#__PURE__*/_interopDefaultLegacy(anime);

  const svgNS = "http://www.w3.org/2000/svg";
  // these are initialized in generateScene()
  const SCENE = {
      w: 0,
      h: 0,
  };
  function generateName() {
      const circle = document.createElementNS(svgNS, "circle");
      circle.setAttributeNS(null, "fill", "blue");
      circle.setAttributeNS(null, "cx", "0");
      circle.setAttributeNS(null, "cy", "0");
      circle.setAttributeNS(null, "r", "10");
      return circle;
  }
  function generateScene(width, height) {
      SCENE.w = width;
      SCENE.h = height;
      const svg = document.createElementNS(svgNS, "svg");
      svg.style.display = "block";
      svg.setAttributeNS(null, "width", `${width}`);
      svg.setAttributeNS(null, "height", `${height}`);
      return svg;
  }
  function getPathCoords(start) {
      const inflexion_count = 4;
      const amplitude = 30;
      const step_x = (getCenter().x - start.x) / inflexion_count;
      const step_y = (getCenter().y - start.y) / inflexion_count;
      const inflexion_points = Array(inflexion_count - 1)
          .fill(0)
          .map((_, index) => ({
          x: start.x + step_x * (index + 1),
          y: start.y + step_y * (index + 1),
      }));
      const control_point = {
          x: start.x + step_x / 2 - amplitude,
          y: start.y + step_y / 2,
      };
      // console.log({ inflexion_points });
      return `M ${start.x} ${start.y} Q ${control_point.x} ${control_point.y}, ${inflexion_points[0].x} ${inflexion_points[0].y} T ${inflexion_points[1].x} ${inflexion_points[1].y} T ${inflexion_points[2].x} ${inflexion_points[2].y} T ${getCenter().x} ${getCenter().y}`;
      // return `M ${start.x} ${start.y} Q 52.5 100, 95 60 T ${getCenter().x} ${getCenter().y}`;
  }
  function generatePath() {
      const x = getRandom(SCENE.w);
      const y = SCENE.h;
      return createPath({ x, y });
  }
  function createPath(start) {
      const path = document.createElementNS(svgNS, "path");
      path.setAttributeNS(null, "fill", "none");
      path.setAttributeNS(null, "stroke", "black");
      path.setAttributeNS(null, "d", getPathCoords(start));
      const svg = document.createElementNS(svgNS, "svg");
      svg.appendChild(path);
      return svg;
  }
  function getRandom(max, min = 0) {
      return Math.floor(Math.random() * (max - min + 1) + min);
  }
  function getCenter() {
      const center = Math.floor(SCENE.w / 2);
      return {
          x: center,
          y: center,
      };
  }
  function drawCircle(attrs) {
      const { fill, cx, cy, r } = attrs;
      const circle = document.createElementNS(svgNS, "circle");
      circle.setAttributeNS(null, "fill", fill);
      circle.setAttributeNS(null, "cx", `${cx}`);
      circle.setAttributeNS(null, "cy", `${cy}`);
      circle.setAttributeNS(null, "r", `${r}`);
      return circle;
  }
  function drawText(value, attrs) {
      const { fill, x, y, size, valign = "middle" } = attrs;
      const ratio = getRatio();
      const text = document.createElementNS(svgNS, "text");
      text.setAttributeNS(null, "text-anchor", "middle");
      text.setAttributeNS(null, "alignment-baseline", valign);
      text.setAttributeNS(null, "font-size", `${size * ratio}`);
      text.setAttributeNS(null, "font-family", `Montserrat`);
      text.setAttributeNS(null, "fill", fill);
      text.setAttributeNS(null, "x", `${x}`);
      text.setAttributeNS(null, "y", `${y}`);
      text.textContent = value;
      return text;
  }
  function formatNumber(value) {
      return Intl.NumberFormat("ro", {}).format(value);
  }
  function getRatio() {
      return SCENE.w / 650;
  }
  function getScaled(val) {
      return val * getRatio();
  }

  let scene = null;
  let total_circle = null;
  let text_necesar = null;
  let text_necesar_suma = null;
  let progress_circle = null;
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
      var p = anime__default['default'].path(path.querySelector("path"));
      anime__default['default']({
          targets: name,
          translateX: p("x"),
          translateY: p("y"),
          rotate: p("angle"),
          easing: "easeInOutSine",
          duration: 1000,
          complete: function ( /*anim*/) {
              scene.removeChild(name);
              scene.removeChild(path);
          },
      });
  }
  function init(data) {
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
  function updateProgress(data) {
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
  function animateBubble(data = { nume: "", suma: 0 }) {
      const { nume, suma } = data;
      console.log("animateBubble()", { nume, suma });
      animate();
  }
  function renderScene() {
      const { x, y } = getCenter();
      const progress_width = getProgressWidth();
      total_circle = drawCircle({ cx: x, cy: y, r: x, fill: "#FF0202" /* primary */ });
      scene.appendChild(total_circle);
      progress_circle = drawCircle({
          cx: x,
          cy: y,
          r: progress_width / 2,
          fill: "#ffffff" /* white */,
      });
      scene.appendChild(progress_circle);
      const title_y = getTitleY();
      // console.log({ y, progress_radius, title_y });
      text_necesar = drawText("Necesar", {
          fill: "#ffffff" /* white */,
          size: 18,
          x,
          y: title_y,
          valign: "baseline",
      });
      text_necesar.setAttribute("transform", `translate(0, -${getScaled(5)})`);
      scene.appendChild(text_necesar);
      text_necesar_suma = drawText(formatNumber(total), {
          fill: "#ffffff" /* white */,
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

  exports.animateBubble = animateBubble;
  exports.init = init;
  exports.updateProgress = updateProgress;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

}({}, anime));
