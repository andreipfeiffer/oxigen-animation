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
      svg.style.border = "1px black solid";
      svg.setAttributeNS(null, "width", `${width}`);
      svg.setAttributeNS(null, "height", `${height}`);
      return svg;
  }
  function drawTarget() {
      const circle = document.createElementNS(svgNS, "circle");
      circle.setAttributeNS(null, "fill", "red");
      circle.setAttributeNS(null, "cx", `${getCenter().x}`);
      circle.setAttributeNS(null, "cy", `${getCenter().y}`);
      circle.setAttributeNS(null, "r", "2");
      return circle;
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

  let scene = null;
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
          complete: function (anim) {
              scene.removeChild(name);
              // scene.removeChild(path);
          },
      });
  }
  function init(data) {
      const { element, total_necesar, total_strans, donatori } = data;
      console.log("init()", { element, total_necesar, total_strans, donatori });
      const dimensions = element.getBoundingClientRect();
      scene = generateScene(dimensions.width, dimensions.width);
      element.appendChild(scene);
      const target = drawTarget();
      scene.appendChild(target);
  }
  function setData(data) {
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
  exports.setData = setData;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

}({}, anime));
