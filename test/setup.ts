import { vi } from 'vitest';

const mockContext = {
    clearRect: vi.fn(),
    setTransform: vi.fn(),
    beginPath: vi.fn(),
    rect: vi.fn(),
    fill: vi.fn(),
    arc: vi.fn(),
    lineTo: vi.fn(),
    moveTo: vi.fn(),
    closePath: vi.fn(),
    bezierCurveTo: vi.fn(),
    imageSmoothingEnabled: false,
    fillStyle: '',
};

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    value: vi.fn(() => mockContext),
    writable: true,
});
