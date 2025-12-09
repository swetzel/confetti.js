import { ConfettiConfig } from "./Config";
import Random from "./Random";
import Renderer from "./Renderer";
import Vector2D from "./Vector2D";

export default class Particle {
    private config: ConfettiConfig;
    private position: Vector2D;
    private size: Vector2D;
    private velocity: Vector2D;
    private rotation: number;
    private rotation_speed: number;
    private hue: number;
    private opacity: number;
    private fadeRate: number;

    constructor(position: Vector2D, config: ConfettiConfig) {
        this.config = config;
        this.position = position.copy();
        this.size = this.initSize();
        this.velocity = this.initVelocity();
        this.rotation = Random.range(0, 360);
        this.rotation_speed = Random.range(-250, 250);
        this.hue = Random.range(0, 360);
        this.opacity = 100;
        this.fadeRate = 100 / Random.range(0.5, 2.5);
    }

    private initSize(): Vector2D {
        const x = Random.range(2, 10) * this.config.size;
        const y = Random.range(2, 4) * this.config.size;
        return new Vector2D(x, y);
    }

    private initVelocity(): Vector2D {
        const x = Random.range(-0.5, 0.5);
        const y = Random.range(-0.75, 0.25);
        const direction = new Vector2D(x, y).normalize();
        direction.x *= Math.random() * this.config.velocity * 3.75;
        direction.y *= Math.random() * this.config.velocity * 3.75;
        return direction;
    }

    update(delta: number): void {
        this.velocity.x += Random.range(-350, 350) * delta;
        this.velocity.y += 750 * (this.size.y / (10 * this.config.size)) * delta;

        const damping = Math.pow(0.98, delta * 60);
        this.velocity.scale(damping);

        this.position.x += this.velocity.x * delta;
        this.position.y += this.velocity.y * delta;

        this.rotation += this.rotation_speed * delta;

        if (this.config.fade) {
            this.opacity -= this.fadeRate * delta;
            if (this.opacity < 0) this.opacity = 0;
        }
    }

    draw(renderer: Renderer): void {
        renderer.drawRect(
            this.position,
            this.size,
            this.rotation,
            this.hue,
            this.opacity
        );
    }

    cull(renderer: Renderer) {
        const padding = Math.max(this.size.x, this.size.y) * 2;
        const offScreen = this.position.y > renderer.height + padding;
        return offScreen || this.opacity <= 0;
    }
}
