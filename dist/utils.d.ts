export declare function generateName(): SVGCircleElement;
export declare function generateScene(width: number, height: number): SVGSVGElement;
export declare function drawTarget(): SVGCircleElement;
export declare function generatePath(): SVGSVGElement;
export declare function createPath(start: Point): SVGSVGElement;
export declare function getRandom(max: number, min?: number): number;
declare type Point = {
    x: number;
    y: number;
};
export {};
