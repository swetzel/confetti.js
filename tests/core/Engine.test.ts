import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Engine from '../../src/core/Engine';
import Config from '../../src/core/Config';

beforeEach(() => {
    vi.useFakeTimers();
});

afterEach(() => {
    (Engine as any).sharedEngine = null;
    vi.useRealTimers();
});

describe('Engine', () => {
    describe('acquire()', () => {
        it('returns an Engine instance', () => {
            const engine = Engine.acquire();
            expect(engine).toBeInstanceOf(Engine);
        });

        it('returns the same instance on repeated calls (singleton)', () => {
            const a = Engine.acquire();
            const b = Engine.acquire();
            expect(a).toBe(b);
        });

        it('creates a new instance after the previous one is cleaned up', () => {
            const a = Engine.acquire();
            (Engine as any).sharedEngine = null;
            const b = Engine.acquire();
            expect(a).not.toBe(b);
        });
    });

    describe('trigger()', () => {
        it('adds particles matching the count in config', () => {
            const engine = Engine.acquire();
            const config = Config.init({ count: 10 });
            engine.trigger(config);
            expect((engine as any).particles.length).toBe(10);
        });

        it('accumulates particles across multiple triggers', () => {
            const engine = Engine.acquire();
            engine.trigger(Config.init({ count: 5 }));
            engine.trigger(Config.init({ count: 3 }));
            expect((engine as any).particles.length).toBe(8);
        });
    });
});
