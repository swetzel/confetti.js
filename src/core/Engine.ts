import { ConfettiConfig } from "./Config";
import Particle from "./Particle";
import Renderer from "./Renderer";

export default class Engine {
    private renderer: Renderer;
    private particles: Particle[];

    private lastTime: number;
    private rafId: number;
    private boundUpdate: (time: number) => void;

    private static sharedEngine: Engine | null = null;

    private constructor() {
        this.renderer = new Renderer();
        this.particles = [];

        this.boundUpdate = this.update.bind(this);
        this.lastTime = 0;
        this.rafId = window.requestAnimationFrame(this.boundUpdate);
    }

    private update(time: number): void {
        const delta = this.lastTime ? Math.min((time - this.lastTime) / 1000, 0.064) : 0;
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
        for (let i = 0; i < config.count; i++) {
            this.particles.push(new Particle(config));
        }
    }

    static acquire(): Engine {
        if (!Engine.sharedEngine) {
            Engine.sharedEngine = new Engine();
        }
        return Engine.sharedEngine;
    }
}