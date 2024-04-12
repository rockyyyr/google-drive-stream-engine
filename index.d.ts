/**
 * Start the stream server
 *
 * @param {number} port
 */
export function start(port: number): void;
/**
 * Stop the stream server
 */
export function stop(): void;


declare const _exports: typeof import("./src/server");
export = _exports;
