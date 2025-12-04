export interface ConfettiConfig {
    position: { x: number; y: number };
    count: number;
    size: number;
    velocity: number;
    fade: boolean;
}

const DEFAULT_CONFIG: ConfettiConfig = {
    position: { x: window.innerWidth / 2, y: window.innerHeight / 3 },
    count: 100,
    size: 1,
    velocity: 200,
    fade: false,
};

export default class Config {
    static init(config: Partial<ConfettiConfig>): ConfettiConfig {
        return { ...DEFAULT_CONFIG, ...config };
    }
}
