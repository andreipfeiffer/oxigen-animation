export declare const SCENE_COORDS: Point;
export declare function generateName(): SVGCircleElement;
export declare function generateScene(coords?: Point): SVGSVGElement;
export declare function drawTarget(coords?: Point): SVGCircleElement;
export declare function createPath(start: Point): SVGSVGElement;
export declare function getRandom(max: number, min?: number): number;
declare type Point = {
    x: number;
    y: number;
};
export {};
