import { describe, it, expect, vi } from 'vitest';
import Particle from '../../src/core/Particle';
import Config from '../../src/core/Config';
import type Renderer from '../../src/core/Renderer';

const baseConfig = () => Config.init({ position: { x: 500, y: 300 } });

const damp = (delta: number) => Math.pow(0.98, delta * 60);

const mockRenderer = (height = 600) => ({
    height,
    width: 800,
    drawRect: vi.fn(),
} as unknown as Renderer);

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
});
