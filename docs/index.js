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
        circle.setAttributeNS(null, "stroke-width", "5");
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
        svg.style.maxHeight = "100vh";
        svg.setAttributeNS(null, "viewBox", `0 0 ${width} ${height}`);
        svg.setAttributeNS(null, "x", `0px`);
        svg.setAttributeNS(null, "y", `0px`);
        return svg;
    }
    function getPathCoords(start, end) {
        const inflexion_count = 4;
        const amplitude = getRandomAmplitude();
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
        return `M ${start.x} ${start.y} Q ${control_point.x} ${control_point.y}, ${inflexion_points[0].x} ${inflexion_points[0].y} T ${inflexion_points[1].x} ${inflexion_points[1].y} T ${inflexion_points[2].x} ${inflexion_points[2].y} T ${end.x} ${end.y}`;
    }
    function createPath(start, end) {
        const path = document.createElementNS(svgNS, "path");
        path.setAttributeNS(null, "fill", "none");
        path.setAttributeNS(null, "stroke", "none");
        path.setAttributeNS(null, "d", getPathCoords(start, end));
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
    function getRandomAmplitude() {
        const amplitude = getRandom(35, 25);
        if (getRandom(1) === 1) {
            return amplitude;
        }
        return -amplitude;
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
    const HEIGHT = WIDTH + 300;
    let total = 0;
    let suma = 0;
    let donatori = 0;
    function init(data) {
        if (scene) {
            scene.parentNode.removeChild(scene);
        }
        total = data.total_necesar;
        // store scene reference
        scene = generateScene(WIDTH, HEIGHT);
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
        anime__default['default']({
            targets: progress_circle,
            r: progress_size / 2,
            easing: "spring(1, 100, 10, 0)",
            duration: 1000,
        });
        const title_y = getTitleY();
        anime__default['default']({
            targets: [text_necesar, text_necesar_val],
            y: title_y,
            easing: "easeOutQuart",
            duration: 1000,
        });
        const title_color = isTitleInside(title_y) ? "#FF0202" /* primary */ : "#ffffff" /* white */;
        text_necesar.setAttributeNS(null, "fill", `${title_color}`);
        text_necesar_val.setAttributeNS(null, "fill", `${title_color}`);
        text_strans_val.textContent = formatNumber(suma);
        text_donatori_val.textContent = String(donatori);
    }
    function animate(data = { nume: "", suma: 0 }) {
        return __awaiter(this, void 0, void 0, function* () {
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
            var p = anime__default['default'].path(path);
            anime__default['default']({
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
                    const progress_bottom = WIDTH / 2 + getProgressWidth() / 2 + BUBBLE_RADIUS / 2;
                    if (!merged && y <= progress_bottom) {
                        merged = true;
                        const radius = +progress_circle.getAttributeNS(null, "r");
                        anime__default['default']({
                            targets: progress_circle,
                            keyframes: [
                                { r: radius + 3, easing: "easeInQuad", duration: 100 },
                                { r: radius, easing: "spring(1, 100, 10, 0)", duration: 300 },
                            ],
                        });
                    }
                },
            });
            const transition_in = anime__default['default']({
                targets: name.querySelector("circle"),
                opacity: [0, 1],
                r: [0, BUBBLE_RADIUS / 2],
                easing: "spring(1, 80, 10, 10)",
                duration: 1200,
            });
            yield transition_in.finished;
            anime__default['default']({
                targets: name.querySelector("circle"),
                r: BUBBLE_RADIUS,
                easing: "spring(1, 100, 10, 0)",
                duration: 1200,
                delay: small_duration,
            });
            anime__default['default']({
                targets: name.querySelector(".texts"),
                opacity: 1,
                scale: [0, 1],
                easing: "spring(1, 100, 10, 0)",
                duration: 1200,
                delay: small_duration,
            });
        });
    }
    function renderScene() {
        const { x, y } = getCenter();
        total_circle = drawCircle({ cx: x, cy: y, r: x, fill: "#FF0202" /* primary */ });
        scene.appendChild(total_circle);
        anime__default['default']({
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
            y: y - inner_text_offset - 5,
            valign: "baseline",
        });
        scene.appendChild(text_strans);
        text_strans_val = drawText(formatNumber(suma), {
            fill: "#000000" /* black */,
            size: 38,
            x,
            y: y - inner_text_offset + 5,
            valign: "hanging",
        });
        scene.appendChild(text_strans_val);
        text_donatori = drawText("Donatori", {
            fill: "#000000" /* black */,
            size: 18,
            x,
            y: y + inner_text_offset - 5,
            valign: "baseline",
        });
        scene.appendChild(text_donatori);
        text_donatori_val = drawText(String(donatori), {
            fill: "#000000" /* black */,
            size: 40,
            x,
            y: y + inner_text_offset + 5,
            valign: "hanging",
        });
        scene.appendChild(text_donatori_val);
        anime__default['default']({
            targets: [text_strans, text_strans_val],
            opacity: [0, 1],
            translateY: [20, 0],
            easing: "easeOutQuart",
            duration: 2000,
            delay: 500,
        });
        anime__default['default']({
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
    function isTitleInside(value) {
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

    exports.animate = animate;
    exports.init = init;
    exports.update = update;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

}({}, anime));
