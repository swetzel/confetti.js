export interface ConfettiConfig {
    position: { x: number; y: number };
    count: number;
    size: number;
    velocity: number;
    fade: boolean;
    baseColor?: string;
}

const DEFAULT_CONFIG = {
    count: 75,
    size: 1,
    velocity: 200,
    fade: false,
};

export default class Config {
    static init(config: Partial<ConfettiConfig>): ConfettiConfig {
        return {
            position: { x: window.innerWidth / 2, y: window.innerHeight / 3 },
            ...DEFAULT_CONFIG,
            ...config,
        };
    }
}
