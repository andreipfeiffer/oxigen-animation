var oxygen_animation = (function (exports, anime) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var anime__default = /*#__PURE__*/_interopDefaultLegacy(anime);

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    const svgNS = "http://www.w3.org/2000/svg";
    // these are initialized in generateScene()
    const SCENE = {
        w: 0,
        h: 0,
    };
    const BUBBLE_RADIUS = 40;
    function generateName(data) {
        const group = document.createElementNS(svgNS, "g");
        const text_group = document.createElementNS(svgNS, "g");
        text_group.setAttributeNS(null, "class", "texts");
        text_group.setAttributeNS(null, "opacity", "0");
        const circle = drawCircle({
            cx: 0,
            cy: 0,
            r: BUBBLE_RADIUS,
            fill: "#ffffff" /* white */,
        });
        circle.setAttributeNS(null, "stroke", "#FF0202" /* primary */);
        circle.setAttributeNS(null, "stroke-width", "6");
        const nume = drawText(data.nume, {
            fill: "#000000" /* black */,
            size: 11,
            x: 0,
            y: 0,
            valign: "baseline",
        });
        nume.setAttributeNS(null, "transform", `translate(0, -5)`);
        nume.setAttributeNS(null, "opacity", "0.5");
        const suma = drawText(formatNumber(data.suma), {
            fill: "#000000" /* black */,
            size: 16,
            x: 0,
            y: 0,
            valign: "hanging",
        });
        suma.setAttributeNS(null, "transform", `translate(0, 5)`);
        // texts are placed inside another group, to animate them easier
        text_group.appendChild(nume);
        text_group.appendChild(suma);
        group.appendChild(circle);
        group.appendChild(text_group);
        return group;
    }
    function generateScene(width, height) {
        SCENE.w = width;
        SCENE.h = height;
        const svg = document.createElementNS(svgNS, "svg");
        svg.style.display = "block";
        svg.setAttributeNS(null, "viewBox", `0 0 ${width} ${height}`);
        svg.setAttributeNS(null, "x", `0px`);
        svg.setAttributeNS(null, "y", `0px`);
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
        const y = SCENE.h - BUBBLE_RADIUS / 2;
        return createPath({ x, y });
    }
    function createPath(start) {
        const path = document.createElementNS(svgNS, "path");
        path.setAttributeNS(null, "fill", "none");
        path.setAttributeNS(null, "stroke", "none");
        path.setAttributeNS(null, "d", getPathCoords(start));
        return path;
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
    function createGroup() {
        return document.createElementNS(svgNS, "g");
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
        const text = document.createElementNS(svgNS, "text");
        text.setAttributeNS(null, "text-anchor", "middle");
        text.setAttributeNS(null, "alignment-baseline", valign);
        text.setAttributeNS(null, "font-size", `${size}`);
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

    let scene = null;
    let bubbles_container = null;
    let total_circle = null;
    let text_necesar = null;
    let text_necesar_val = null;
    let text_strans = null;
    let text_strans_val = null;
    let text_donatori = null;
    let text_donatori_val = null;
    let progress_circle = null;
    const WIDTH = 650;
    let total = 0;
    let suma = 0;
    let donatori = 0;
    function init(data) {
        if (scene) {
            scene.parentNode.removeChild(scene);
        }
        total = data.total_necesar;
        // store scene reference
        scene = generateScene(WIDTH, WIDTH + 200);
        data.element.appendChild(scene);
        renderScene();
    }
    function update(data) {
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
        // renderScene();
    }
    function animate(data = { nume: "", suma: 0 }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!scene) {
                throw new Error("Not initialized! Call .init() first");
            }
            // @todo randomize this
            const total_duration = 6000;
            // outside
            const small_duration = 500;
            const path = generatePath();
            bubbles_container.appendChild(path);
            const name = generateName(data);
            bubbles_container.appendChild(name);
            var p = anime__default['default'].path(path);
            const path_motion = anime__default['default']({
                targets: name,
                translateX: p("x"),
                translateY: p("y"),
                easing: "easeInOutSine",
                duration: total_duration,
                complete: function () {
                    bubbles_container.removeChild(path);
                },
            });
            const transition_in = anime__default['default']({
                targets: name.querySelector("circle"),
                opacity: [0, 1],
                r: [0, BUBBLE_RADIUS / 2],
                easing: "easeOutBounce",
                duration: 1200,
            });
            yield transition_in.finished;
            const grow_in = anime__default['default']({
                targets: name.querySelector("circle"),
                r: BUBBLE_RADIUS,
                easing: "easeOutBounce",
                duration: 1200,
                delay: small_duration,
            });
            anime__default['default']({
                targets: name.querySelector(".texts"),
                opacity: 1,
                scale: [0, 1],
                easing: "easeOutBounce",
                duration: 1200,
                delay: small_duration,
            });
            yield grow_in.finished;
            anime__default['default']({
                targets: name.querySelector("circle"),
                strokeWidth: 0,
                duration: 500,
                easing: "linear",
            });
            anime__default['default']({
                targets: [name.querySelector("circle"), name.querySelector(".texts")],
                scale: 0,
                opacity: 0,
                duration: 1200,
                easing: "linear",
                delay: 2000,
            });
            yield path_motion.finished;
            // @todo do something with the inner circle, ie: small pulse
        });
    }
    function renderScene() {
        const { x, y } = getCenter();
        const progress_width = getProgressWidth();
        total_circle = drawCircle({ cx: x, cy: y, r: x, fill: "#FF0202" /* primary */ });
        scene.appendChild(total_circle);
        bubbles_container = createGroup();
        scene.appendChild(bubbles_container);
        progress_circle = drawCircle({
            cx: x,
            cy: y,
            r: progress_width / 2,
            fill: "#ffffff" /* white */,
        });
        scene.appendChild(progress_circle);
        const title_y = getTitleY();
        text_necesar = drawText("Necesar", {
            fill: "#ffffff" /* white */,
            size: 18,
            x,
            y: title_y,
            valign: "baseline",
        });
        text_necesar.setAttributeNS(null, "transform", `translate(0, -5)`);
        scene.appendChild(text_necesar);
        text_necesar_val = drawText(formatNumber(total), {
            fill: "#ffffff" /* white */,
            size: 37,
            x,
            y: title_y,
            valign: "hanging",
        });
        text_necesar_val.setAttributeNS(null, "transform", `translate(0, 5)`);
        scene.appendChild(text_necesar_val);
        const inner_text_offset = getInnerTextOffset();
        text_strans = drawText("Suma stransa", {
            fill: "#000000" /* black */,
            size: 18,
            x,
            y: y - inner_text_offset,
            valign: "baseline",
        });
        text_strans.setAttributeNS(null, "transform", `translate(0, -5)`);
        scene.appendChild(text_strans);
        text_strans_val = drawText(formatNumber(suma), {
            fill: "#000000" /* black */,
            size: 38,
            x,
            y: y - inner_text_offset,
            valign: "hanging",
        });
        text_strans_val.setAttributeNS(null, "transform", `translate(0, 5)`);
        scene.appendChild(text_strans_val);
        text_donatori = drawText("Donatori", {
            fill: "#000000" /* black */,
            size: 18,
            x,
            y: y + inner_text_offset,
            valign: "baseline",
        });
        text_donatori.setAttributeNS(null, "transform", `translate(0, -5)`);
        scene.appendChild(text_donatori);
        text_donatori_val = drawText(String(donatori), {
            fill: "#000000" /* black */,
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

    exports.animate = animate;
    exports.init = init;
    exports.update = update;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

}({}, anime));
