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
        this.rotation_speed = Random.range(-50, 50);
        this.hue = Random.range(0, 360);
        this.opacity = 100;
        this.fadeRate = 100 / Random.range(0.5, 2.5);
    }

    initSize() {
        const x = Random.range(2, 10) * this.config.size;
        const y = Random.range(2, 4) * this.config.size;
        return new Vector2D(x, y);
    }

    initVelocity() {
        const x = Random.range(-0.5, 0.5);
        const y = Random.range(-0.75, 0.25);
        const direction = new Vector2D(x, y).normalizeInPlace();
        direction.x *= Math.random() * this.config.velocity;
        direction.y *= Math.random() * this.config.velocity;
        return direction;
    }

    getArea() {
        return this.size.x * this.size.y;
    }

    update(delta: number) {
        this.velocity.x += Random.range(-15, 15) * delta;
        this.velocity.y += 50 * (this.size.y / (10 * this.config.size)) * delta;

        this.velocity.x *= 0.98;
        this.velocity.y *= 0.98;

        this.position.x += this.velocity.x * delta;
        this.position.y += this.velocity.y * delta;

        this.rotation += this.rotation_speed * delta;

        if (this.config.fade) {
            this.opacity -= this.fadeRate * delta;
            if (this.opacity < 0) this.opacity = 0;
        }
    }

    draw(renderer: Renderer) {
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
