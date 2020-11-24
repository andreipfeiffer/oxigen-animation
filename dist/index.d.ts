export declare function init(data: Init): void;
export declare function update(data: Progres): void;
export declare function animate(data?: Donator): void;
declare type Init = {
    element: HTMLElement;
    total_necesar: number;
};
declare type Progres = {
    total_strans: number;
    donatori: number;
};
declare type Donator = {
    nume: string;
    suma: number;
};
export {};
