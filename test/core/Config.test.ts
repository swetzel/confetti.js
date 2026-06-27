import { describe, it, expect } from 'vitest';
import Config, { ConfettiConfig } from '../../src/core/Config';

describe('Config', () => {
    describe('init()', () => {
        it('fills in all defaults when called with empty object', () => {
            const config = Config.init({});
            expect(config.count).toBe(75);
            expect(config.size).toBe(1);
            expect(config.velocity).toBe(200);
            expect(config.fade).toBe(false);
            expect(config.position).toBeDefined();
        });

        it('default position is center-ish of the window', () => {
            const config = Config.init({});
            expect(config.position.x).toBe(window.innerWidth / 2);
            expect(config.position.y).toBe(window.innerHeight / 3);
        });

        it('overrides individual fields', () => {
            const config = Config.init({ count: 50 });
            expect(config.count).toBe(50);
            expect(config.size).toBe(1);
        });

        it('overrides position', () => {
            const config = Config.init({ position: { x: 100, y: 200 } });
            expect(config.position.x).toBe(100);
            expect(config.position.y).toBe(200);
        });

        it('overrides multiple fields at once', () => {
            const config = Config.init({ count: 10, velocity: 50, fade: true });
            expect(config.count).toBe(10);
            expect(config.velocity).toBe(50);
            expect(config.fade).toBe(true);
        });

        it('returns a complete ConfettiConfig', () => {
            const config = Config.init({});
            const keys: (keyof ConfettiConfig)[] = ['position', 'count', 'size', 'velocity', 'fade'];
            for (const key of keys) {
                expect(config[key]).toBeDefined();
            }
        });

        it('accepts baseColor as a hex value', () => {
            const config = Config.init({ baseColor: '#ff0000' });
            expect(config.baseColor).toBe('#ff0000');
        });

        it('accepts baseColor as an rgb value', () => {
            const config = Config.init({ baseColor: 'rgb(255, 0, 0)' });
            expect(config.baseColor).toBe('rgb(255, 0, 0)');
        });

        it('accepts baseColor as an hsl value', () => {
            const config = Config.init({ baseColor: 'hsl(0, 100%, 50%)' });
            expect(config.baseColor).toBe('hsl(0, 100%, 50%)');
        });

        it('baseColor is undefined when not specified', () => {
            const config = Config.init({});
            expect(config.baseColor).toBeUndefined();
        });
    });
});
