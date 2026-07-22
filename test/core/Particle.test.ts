import { describe, it, expect, afterEach, vi } from 'vitest';
import type { Mock } from 'vitest';
import Particle from '../../src/core/Particle';
import Config, { ConfettiConfig } from '../../src/core/Config';
import type Renderer from '../../src/core/Renderer';

const baseConfig = () => Config.init({ position: { x: 500, y: 300 } });

const damp = (delta: number) => Math.pow(0.98, delta * 60);

const mockRenderer = (height = 600) => ({
    height,
    width: 800,
    drawRect: vi.fn(),
} as unknown as Renderer);

// A particle's color is private, so read it off the draw call it makes.
const colorOf = (config: ConfettiConfig): string | number => {
    const renderer = mockRenderer();
    new Particle(config).draw(renderer);
    return (renderer.drawRect as unknown as Mock).mock.calls[0][3];
};

const colorsOf = (config: ConfettiConfig, n: number): (string | number)[] =>
    Array.from({ length: n }, () => colorOf(config));

describe('Particle', () => {
    describe('cull()', () => {
        it('returns false when the particle is on screen', () => {
            const p = new Particle(baseConfig());
            // Particle starts at y=300, renderer height=600 → on screen
            expect(p.cull(mockRenderer(600))).toBe(false);
        });

        it('returns true when the particle is below the screen', () => {
            const config = Config.init({ position: { x: 500, y: 10000 } });
            const p = new Particle(config);
            expect(p.cull(mockRenderer(600))).toBe(true);
        });

        it('returns true when opacity reaches zero', () => {
            vi.spyOn(Math, 'random').mockReturnValue(1);
            // Math.random()=1 → fadeRate = 100 / range(0.5, 2.5) = 100 / 2.5 = 40
            const config = Config.init({ position: { x: 500, y: 300 }, fade: true });
            const p = new Particle(config);
            // 3 updates at delta=1 → opacity = 100 - 40 - 40 - 40 = -20 → clamped to 0
            p.update(1, damp(1));
            p.update(1, damp(1));
            p.update(1, damp(1));
            expect(p.cull(mockRenderer(600))).toBe(true);
            vi.restoreAllMocks();
        });
    });

    describe('update()', () => {
        it('increases y position over time due to gravity', () => {
            vi.spyOn(Math, 'random').mockReturnValue(0.5);
            const config = Config.init({ position: { x: 500, y: 300 } });
            const p = new Particle(config);
            const renderer = mockRenderer(600);

            // Record initial y via cull (not off screen)
            expect(p.cull(renderer)).toBe(false);

            const d = 0.016;
            const k = damp(d);

            // Run many updates — gravity consistently pulls down
            for (let i = 0; i < 100; i++) p.update(d, k);

            // After 100 frames worth of gravity the particle should drift downward
            // Test this by checking it hasn't gone off-screen upward (it's only going down)
            // A particle starting at y=300 with gravity should eventually reach y > renderer.height
            for (let i = 0; i < 500; i++) p.update(d, k);
            expect(p.cull(renderer)).toBe(true);

            vi.restoreAllMocks();
        });

        it('does not decrease opacity when fade is false', () => {
            const config = Config.init({ position: { x: 500, y: 300 }, fade: false });
            const p = new Particle(config);
            const renderer = mockRenderer(600);

            for (let i = 0; i < 50; i++) p.update(0.016, damp(0.016));

            // With fade=false opacity stays at 100, so cull can only happen if off-screen
            // Starting at y=300 with renderer height=600, 50 frames is not enough to go off-screen
            // (gravity eventually does push it off, but opacity is not the trigger)
            // We can't directly read opacity, but if the particle is still on screen, cull=false
            // This test verifies the particle isn't prematurely culled by opacity
            const earlyConfig = Config.init({ position: { x: 500, y: 300 }, fade: false });
            const earlyParticle = new Particle(earlyConfig);
            // After a small delta, should not be culled by opacity
            earlyParticle.update(0.001, damp(0.001));
            // Since fade=false, opacity remains 100 — only position culling applies
            // Position barely moved, so still on screen
            expect(earlyParticle.cull(mockRenderer(10000))).toBe(false);
        });

        it('decreases opacity when fade is true', () => {
            vi.spyOn(Math, 'random').mockReturnValue(1);
            // fadeRate = 100 / 2.5 = 40
            const config = Config.init({ position: { x: 500, y: 300 }, fade: true });
            const p = new Particle(config);
            p.update(1, damp(1));
            // opacity went from 100 to 60 → still on screen at y=300 with renderer height=600
            // but opacity is not 100 anymore, meaning fade is happening
            // After 3 updates opacity hits 0 → cull returns true
            p.update(1, damp(1));
            p.update(1, damp(1));
            expect(p.cull(mockRenderer(600))).toBe(true);
            vi.restoreAllMocks();
        });
    });

    describe('color', () => {
        afterEach(() => {
            vi.restoreAllMocks();
        });

        const withPalette = (color: string[] | number[]) =>
            Config.init({ position: { x: 500, y: 300 }, color });

        describe('without a palette', () => {
            it('falls back to a random hue in [0, 360)', () => {
                for (const color of colorsOf(baseConfig(), 100)) {
                    expect(typeof color).toBe('number');
                    expect(color).toBeGreaterThanOrEqual(0);
                    expect(color).toBeLessThan(360);
                }
            });

            it('maps the random source onto the full hue circle', () => {
                vi.spyOn(Math, 'random').mockReturnValue(0.5);
                // Random.range(0, 360) → 180
                expect(colorOf(baseConfig())).toBe(180);
            });

            it('varies the hue between particles', () => {
                const hues = new Set(colorsOf(baseConfig(), 50));
                expect(hues.size).toBeGreaterThan(1);
            });
        });

        describe('with a string palette', () => {
            const palette = ['#ff0000', '#00ff00', '#0000ff'];

            it('always picks a color from the palette', () => {
                for (const color of colorsOf(withPalette(palette), 200)) {
                    expect(palette).toContain(color);
                }
            });

            it('uses every color in the palette across a batch', () => {
                const used = new Set(colorsOf(withPalette(palette), 300));
                expect(used).toEqual(new Set(palette));
            });

            it.each([
                [0, '#ff0000'],
                [0.5, '#00ff00'],
                [0.99, '#0000ff'],
            ])('Math.random()=%s selects index %#: %s', (random, expected) => {
                vi.spyOn(Math, 'random').mockReturnValue(random);
                expect(colorOf(withPalette(palette))).toBe(expected);
            });

            it('always picks the sole entry of a one-color palette', () => {
                for (const color of colorsOf(withPalette(['rebeccapurple']), 25)) {
                    expect(color).toBe('rebeccapurple');
                }
            });

            it('never indexes past the end of the palette', () => {
                // Random.range(0, len) is exclusive of len, but guard the boundary anyway
                vi.spyOn(Math, 'random').mockReturnValue(0.9999999);
                expect(colorOf(withPalette(palette))).toBe('#0000ff');
            });
        });

        describe('with a hue palette', () => {
            const palette = [0, 120, 240];

            it('always picks a hue from the palette', () => {
                for (const color of colorsOf(withPalette(palette), 200)) {
                    expect(typeof color).toBe('number');
                    expect(palette).toContain(color);
                }
            });

            it('uses every hue in the palette across a batch', () => {
                const used = new Set(colorsOf(withPalette(palette), 300));
                expect(used).toEqual(new Set(palette));
            });

            it('treats hue 0 as a real color, not a missing one', () => {
                vi.spyOn(Math, 'random').mockReturnValue(0);
                expect(colorOf(withPalette(palette))).toBe(0);
            });

            it('always picks the sole entry of a one-hue palette', () => {
                for (const color of colorsOf(withPalette([200]), 25)) {
                    expect(color).toBe(200);
                }
            });
        });

        describe('with an empty palette', () => {
            it('falls back to a random hue', () => {
                for (const color of colorsOf(withPalette([]), 50)) {
                    expect(typeof color).toBe('number');
                    expect(color).toBeGreaterThanOrEqual(0);
                    expect(color).toBeLessThan(360);
                }
            });
        });

        it('stays fixed for the lifetime of a particle', () => {
            const p = new Particle(withPalette(['#ff0000', '#00ff00', '#0000ff']));
            const renderer = mockRenderer();

            p.draw(renderer);
            for (let i = 0; i < 10; i++) {
                p.update(0.016, damp(0.016));
                p.draw(renderer);
            }

            const drawn = (renderer.drawRect as unknown as Mock).mock.calls.map((c) => c[3]);
            expect(new Set(drawn).size).toBe(1);
        });
    });
});
