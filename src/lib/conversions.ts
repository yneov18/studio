export type Units = {
    length: 'm' | 'ft';
    volume: 'm³' | 'bbl';
    level: 'cm' | 'in';
};

const M_TO_FT = 3.28084;
const M3_TO_BBL = 6.28981;
const CM_TO_IN = 0.393701;

// --- Length ---
export function convertLength(value: number, from: Units['length'], to: Units['length']): number {
    if (from === to) return value;
    if (from === 'm' && to === 'ft') return value * M_TO_FT;
    if (from === 'ft' && to === 'm') return value / M_TO_FT;
    return value;
}

// --- Volume ---
export function convertVolume(value: number, from: Units['volume'], to: Units['volume']): number {
    if (from === to) return value;
    if (from === 'm³' && to === 'bbl') return value * M3_TO_BBL;
    if (from === 'bbl' && to === 'm³') return value / M3_TO_BBL;
    return value;
}

// --- Level ---
export function convertLevel(value: number, from: Units['level'], to: Units['level']): number {
    if (from === to) return value;
    if (from === 'cm' && to === 'in') return value * CM_TO_IN;
    if (from === 'in' && to === 'cm') return value / CM_TO_IN;
    return value;
}
