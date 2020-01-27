export function Clamp(arg: number, min: number, max: number): number {
    return Math.min(Math.max(arg, min), max);
}
