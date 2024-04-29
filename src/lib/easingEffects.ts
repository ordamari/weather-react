import Effect from "@/core/types/effect.type"

function easingEffects(x: number, effect: Effect) {
    switch (effect) {
        case 'ease-in':
            return x ** 2
        case 'ease-out':
            return 1 - (1 - x) ** 2
        case 'ease-in-out':
            return x < 0.5
                ? 16 * x * x * x * x * x
                : 1 - Math.pow(-2 * x + 2, 5) / 2
        case 'linear':
        default:
            return x
    }
}

export default easingEffects
