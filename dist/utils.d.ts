export declare const enum Color {
    primary = "#FF0202",
    black = "#000000",
    white = "#ffffff"
}
export declare function generateName(): SVGCircleElement;
export declare function generateScene(width: number, height: number): SVGSVGElement;
export declare function generatePath(): SVGSVGElement;
export declare function createPath(start: Point): SVGSVGElement;
export declare function getRandom(max: number, min?: number): number;
export declare function getCenter(): Point;
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
export declare function getScaled(val: number): number;
declare type Point = {
    x: number;
    y: number;
};
export {};
