import Point from "@/core/types/point.type"

function equalPoints(first: Point, second: Point) {
    return first.x === second.x && first.y === second.y && first.z === second.z
}

export default equalPoints
