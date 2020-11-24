import anime from 'animejs';

const svgNS = "http://www.w3.org/2000/svg";
const SCENE_COORDS = {
    x: window.innerWidth - 20,
    y: Math.floor(window.innerHeight / 2),
};
const TARGET_COORDS = {
    x: Math.floor(SCENE_COORDS.x / 2),
    y: 50,
};
function generateName() {
    const circle = document.createElementNS(svgNS, "circle");
    circle.setAttributeNS(null, "fill", "blue");
    circle.setAttributeNS(null, "cx", "0");
    circle.setAttributeNS(null, "cy", "0");
    circle.setAttributeNS(null, "r", "10");
    return circle;
}
function generateScene(coords = SCENE_COORDS) {
    const svg = document.createElementNS(svgNS, "svg");
    svg.style.border = "1px black solid";
    svg.setAttributeNS(null, "width", `${coords.x}`);
    svg.setAttributeNS(null, "height", `${coords.y}`);
    return svg;
}
function drawTarget(coords = SCENE_COORDS) {
    const circle = document.createElementNS(svgNS, "circle");
    circle.setAttributeNS(null, "fill", "red");
    circle.setAttributeNS(null, "cx", `${TARGET_COORDS.x}`);
    circle.setAttributeNS(null, "cy", `${TARGET_COORDS.y}`);
    circle.setAttributeNS(null, "r", "2");
    return circle;
}
function getPathCoords(start) {
    const inflexion_count = 4;
    const amplitude = 30;
    const step_x = (TARGET_COORDS.x - start.x) / inflexion_count;
    const step_y = (TARGET_COORDS.y - start.y) / inflexion_count;
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
    console.log({ inflexion_points });
    return `M ${start.x} ${start.y} Q ${control_point.x} ${control_point.y}, ${inflexion_points[0].x} ${inflexion_points[0].y} T ${inflexion_points[1].x} ${inflexion_points[1].y} T ${inflexion_points[2].x} ${inflexion_points[2].y} T ${TARGET_COORDS.x} ${TARGET_COORDS.y}`;
    // return `M ${start.x} ${start.y} Q 52.5 100, 95 60 T ${TARGET_COORDS.x} ${TARGET_COORDS.y}`;
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
