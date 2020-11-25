import { Init, Progres, Donator } from "./types";
export declare function init(data: Init): void;
export declare function update(data: Progres): void;
export declare function animate(data?: Donator): Promise<void>;
