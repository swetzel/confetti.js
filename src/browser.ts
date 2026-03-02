import confetti from "./index";

declare global {
    interface Window {
        confetti: typeof confetti;
    }
}

window.confetti = confetti;
