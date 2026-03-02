import { describe, it, expect } from 'vitest';
import Vector2D from '../../src/core/Vector2D';

describe('Vector2D', () => {
    it('defaults to (0, 0)', () => {
        const v = new Vector2D();
        expect(v.x).toBe(0);
        expect(v.y).toBe(0);
    });

    it('stores given x and y', () => {
        const v = new Vector2D(3, 4);
        expect(v.x).toBe(3);
        expect(v.y).toBe(4);
    });

    describe('copy()', () => {
        it('returns a new instance with the same values', () => {
            const v = new Vector2D(3, 4);
            const c = v.copy();
            expect(c).not.toBe(v);
            expect(c.x).toBe(3);
            expect(c.y).toBe(4);
        });

        it('copy is independent of original', () => {
            const v = new Vector2D(3, 4);
            const c = v.copy();
            c.x = 99;
            expect(v.x).toBe(3);
        });
    });

    describe('magnitude()', () => {
        it('computes the correct magnitude', () => {
            expect(new Vector2D(3, 4).magnitude()).toBe(5);
        });

        it('returns 0 for zero vector', () => {
            expect(new Vector2D(0, 0).magnitude()).toBe(0);
        });
    });

    describe('normalize()', () => {
        it('produces a unit vector', () => {
            const v = new Vector2D(3, 4).normalize();
            expect(v.magnitude()).toBeCloseTo(1);
        });

        it('returns this for chaining', () => {
            const v = new Vector2D(1, 0);
            expect(v.normalize()).toBe(v);
        });

        it('leaves zero vector as zero', () => {
            const v = new Vector2D(0, 0).normalize();
            expect(v.x).toBe(0);
            expect(v.y).toBe(0);
        });
    });

    describe('scale()', () => {
        it('multiplies x and y by the scalar', () => {
            const v = new Vector2D(3, 4).scale(2);
            expect(v.x).toBe(6);
            expect(v.y).toBe(8);
        });

        it('returns this for chaining', () => {
            const v = new Vector2D(1, 1);
            expect(v.scale(3)).toBe(v);
        });

        it('scales by zero', () => {
            const v = new Vector2D(5, 5).scale(0);
            expect(v.x).toBe(0);
            expect(v.y).toBe(0);
        });
    });

    it('supports method chaining', () => {
        const mag = new Vector2D(6, 8).normalize().scale(10).magnitude();
        expect(mag).toBeCloseTo(10);
    });
});
