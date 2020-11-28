import { Donator } from "./types";
export declare const BUBBLE_RADIUS = 40;
export declare const enum Color {
    primary = "var(--color-primary)",
    black = "#000000",
    white = "#ffffff"
}
export declare function generateName(data: Donator): SVGGElement;
export declare function generateScene(width: number, height: number): SVGSVGElement;
export declare function createPath(start: Point, end: Point): SVGPathElement;
export declare function getRandom(max: number, min?: number): number;
export declare function getCenter(): Point;
export declare function createGroup(): SVGGElement;
export declare function drawCircle(attrs: {
    /** center X */
    cx: number;
    /** center Y */
    cy: number;
    /** radius */
    r: number;
    fill: Color;
}): SVGCircleElement;
export declare function drawText(value: string, attrs: {
    x: number;
    y: number;
    size: number;
    fill: Color;
    valign?: "hanging" | "middle" | "baseline";
}): SVGTextElement;
export declare function formatNumber(value: number): string;
declare type Point = {
    x: number;
    y: number;
};
export {};
