import { ConfettiConfig } from "./Config";
import Particle from "./Particle";
import Renderer from "./Renderer";
import Vector2D from "./Vector2D";

export default class Engine {
    private particles: Particle[] = [];
    private renderer: Renderer;

    private boundUpdate: (time: number) => void;
    private lastTime: number = 0;
    private rafId: number = 0;

    private static sharedEngine: Engine | null = null;

    private constructor() {
        this.renderer = new Renderer();
        this.boundUpdate = this.update.bind(this);
        this.rafId = window.requestAnimationFrame(this.boundUpdate);
    }

    private update(time: number): void {
        const delta = Math.min((time - this.lastTime) / 1000, 0.064);
        this.lastTime = time;

        if (this.particles.length === 0) {
            this.cleanup();
            return;
        }

        this.renderer.clear();

        let write = 0;
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update(delta);
            if (!this.particles[i].cull(this.renderer)) {
                this.particles[i].draw(this.renderer);
                this.particles[write++] = this.particles[i];
            }
        }
        this.particles.length = write;

        this.rafId = window.requestAnimationFrame(this.boundUpdate);
    }

    private cleanup(): void {
        if(this.rafId) window.cancelAnimationFrame(this.rafId);
        this.renderer.cleanup();
        Engine.sharedEngine = null;
    }

    trigger(config: ConfettiConfig): void {
        const position = new Vector2D(config.position.x, config.position.y);
        for (let i = 0; i < config.count; i++) {
            this.particles.push(new Particle(position, config));
        }
    }

    static acquire(): Engine {
        if (!Engine.sharedEngine) {
            Engine.sharedEngine = new Engine();
        }
        return Engine.sharedEngine;
    }
}