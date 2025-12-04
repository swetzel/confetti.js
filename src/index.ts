import Config, { ConfettiConfig } from "./core/Config";
import Particle from "./core/Particle";
import Renderer from "./core/Renderer";
import Vector2D from "./core/Vector2D";

export default function confetti(c: Partial<ConfettiConfig>): void {
    const config = Config.init(c);
    const renderer = new Renderer();

    const position = new Vector2D(config.position.x, config.position.y);
    
    let particles: Particle[] = [];
    for (let i = 0; i < config.count; i++) {
        particles.push(new Particle(position, config));
    }

    let lastTime = 0;
    let rafId = 0;

    const tick = (time: number) => {
        const delta = Math.min((time - lastTime) / 100, 0.064);
        lastTime = time;

        if (particles.length === 0) {
            if(rafId) window.cancelAnimationFrame(rafId);
            renderer.cleanup();
            return;
        }

        let write = 0;
        for (let i = 0; i < particles.length; i++) {
            particles[i].update(delta);
            if (!particles[i].cull(renderer)) {
                particles[write++] = particles[i];
            }
        }
        particles.length = write;

        renderer.clear();
        for (let i = 0; i < particles.length; i++) {
            particles[i].draw(renderer);
        }

        rafId = window.requestAnimationFrame(tick);
    };
    rafId = window.requestAnimationFrame(tick);
}
