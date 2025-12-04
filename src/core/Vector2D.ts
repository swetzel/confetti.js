export default class Vector2D {
    x: number;
    y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    copy() {
        return new Vector2D(this.x, this.y);
    }

    magnitude(): number {
        return Math.hypot(this.x, this.y);
    }

    normalize(): Vector2D {
        const mag = this.magnitude();
        if (mag === 0) return new Vector2D(0, 0);
        const inv = 1 / mag;
        return new Vector2D(this.x * inv, this.y * inv);
    }

    normalizeInPlace(): this {
        const mag = this.magnitude();
        if (mag === 0) {
            this.x = 0;
            this.y = 0;
            return this;
        }
        const inv = 1 / mag;
        this.x *= inv;
        this.y *= inv;
        return this;
    }

    add(v: Vector2D): Vector2D {
        return new Vector2D(this.x + v.x, this.y + v.y);
    }

    sub(v: Vector2D): Vector2D {
        return new Vector2D(this.x - v.x, this.y - v.y);
    }

    scale(s: number): Vector2D {
        return new Vector2D(this.x * s, this.y * s);
    }

    dot(v: Vector2D): number {
        return this.x * v.x + this.y * v.y;
    }
}
