import Config, { ConfettiConfig } from "./core/Config";
import Engine from "./core/Engine";

export default function confetti(c: Partial<ConfettiConfig>): void {
    const config = Config.init(c);
    const engine = Engine.acquire();
    engine.trigger(config);
}