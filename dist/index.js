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
  let total = 0;
  let suma = 0;
  let donatori = 0;
  function animate() {
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
      suma = data.total_strans;
      donatori = data.donatori;
      const progress_amount = suma > 0 ? (total * 100) / suma : 0;
      console.log({ progress_amount });
      const size = data.element.getBoundingClientRect();
      const progress_radius = progress_amount / 2;
      // const progress_radius = 50;
      console.log({ progress_radius });
      // store scene reference
      scene = generateScene(size.width, size.width);
      data.element.appendChild(scene);
      const { x, y } = getCenter();
      const target = drawCircle({ cx: x, cy: y, r: x, fill: "#FF0202" /* primary */ });
      scene.appendChild(target);
      const progress = drawCircle({
          cx: x,
          cy: y,
          r: progress_radius,
          fill: "#ffffff" /* white */,
      });
      scene.appendChild(progress);
      const title_y = (y - progress_radius) / 2;
      console.log({ y, progress_radius, title_y });
      const title1 = drawText("Necesar", {
          fill: "#ffffff" /* white */,
          size: 18,
          x,
          y: title_y - getScaled(5),
          valign: "baseline",
      });
      scene.appendChild(title1);
      const title2 = drawText(formatNumber(total), {
          fill: "#ffffff" /* white */,
          size: 37,
          x,
          y: title_y + getScaled(5),
          valign: "hanging",
      });
      scene.appendChild(title2);
  }
  function updateProgress(data) {
      const { total_strans, donatori } = data;
      console.log("setData()", { total_strans, donatori });
  }
  function animateBubble(data = { nume: "", suma: 0 }) {
      const { nume, suma } = data;
      console.log("animateBubble()", { nume, suma });
      animate();
  }

  exports.animateBubble = animateBubble;
  exports.init = init;
  exports.updateProgress = updateProgress;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

}({}, anime));
