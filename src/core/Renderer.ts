import Vector2D from "./Vector2D";

export default class Renderer {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private dpr: number;
    private rafId: number;;
    private resize: () => void;

    constructor() {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) {
            throw new Error("Unable to create 2d context");
        }

        this.canvas = canvas;
        this.context = context;
        this.dpr = Math.max(1, window.devicePixelRatio || 1);
        this.rafId = 0;
        this.resize = this.handleResize.bind(this);

        this.handleResize();
        window.addEventListener("resize", this.resize);

        canvas.style.position = "fixed";
        canvas.style.top = "0";
        canvas.style.left = "0";
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.margin = "0";
        canvas.style.padding = "0";
        canvas.style.zIndex = "999999999";
        canvas.style.pointerEvents = "none";

        document.body.appendChild(canvas);

        this.context.imageSmoothingEnabled = true;
    }

    private handleResize(): void {
        if (this.rafId) cancelAnimationFrame(this.rafId);
        this.rafId = requestAnimationFrame(() => {
            const { innerWidth, innerHeight } = window;
            this.canvas.width = Math.round(innerWidth * this.dpr);
            this.canvas.height = Math.round(innerHeight * this.dpr);
            this.canvas.style.width = `${innerWidth}px`;
            this.canvas.style.height = `${innerHeight}px`;
            this.context.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
            this.rafId = 0;
        });
    }

    get width(): number {
        return this.canvas.width / this.dpr;
    }

    get height(): number {
        return this.canvas.height / this.dpr;
    }

    clear(): void {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawRect(p: Vector2D, s: Vector2D, r: number, c: number, o: number): void {
        const rad = (r * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        const width = s.x * this.dpr;
        const height = s.y * this.dpr;
        this.context.setTransform(cos, sin, -sin, cos, p.x * this.dpr, p.y * this.dpr);
        this.context.beginPath();
        this.context.rect(-width / 2, -height / 2, width, height);
        this.context.fillStyle = `oklch(0.85 0.25 ${c}deg / ${o}%)`;
        this.context.fill();
        this.context.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }

    cleanup(): void {
        window.removeEventListener("resize", this.resize);
        if (this.rafId) cancelAnimationFrame(this.rafId);
        this.canvas.remove();
    }
}
