export function ShallowEqual(prev, next) {
    if (prev === next) return true;
    const prevKeys = Object.keys(prev);
    const nextKeys = Object.keys(next);

    if (prevKeys.length !== nextKeys.length) return false;

    return prevKeys.every((key) => {
        return prev.hasOwnProperty(key) && prev[key] === next[key];
    });
}
