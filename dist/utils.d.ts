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
export declare function drawText(cx: number, cy: number, r: number, color: Color): SVGTextElement;
declare type Point = {
    x: number;
    y: number;
};
export {};
