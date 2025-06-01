function hashStringToInt(str: string): number {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {

        hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return hash >>> 0;
}

export function getTagColor(tag: string): string {
    const hash = hashStringToInt(tag);

    const hue = hash % 360;

    return `hsl(${hue}, 60%, 50%)`;
}
