import { describe, it, expect, vi } from 'vitest';
import Random from '../../src/core/Random';

describe('Random', () => {
    describe('range()', () => {
        it('returns a value within [min, max)', () => {
            for (let i = 0; i < 100; i++) {
                const v = Random.range(10, 20);
                expect(v).toBeGreaterThanOrEqual(10);
                expect(v).toBeLessThan(20);
            }
        });

        it('maps Math.random() = 0 to min', () => {
            vi.spyOn(Math, 'random').mockReturnValue(0);
            expect(Random.range(5, 15)).toBe(5);
            vi.restoreAllMocks();
        });

        it('maps Math.random() approaching 1 to approaching max', () => {
            vi.spyOn(Math, 'random').mockReturnValue(0.9999);
            expect(Random.range(0, 10)).toBeCloseTo(10, 2);
            vi.restoreAllMocks();
        });

        it('works with negative ranges', () => {
            for (let i = 0; i < 50; i++) {
                const v = Random.range(-10, -5);
                expect(v).toBeGreaterThanOrEqual(-10);
                expect(v).toBeLessThan(-5);
            }
        });
    });
});
