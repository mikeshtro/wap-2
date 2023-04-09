import { GraphicType } from "./enums"

export interface IGraphic {
    x: number,
    y: number,
    width: number,
    height: number,
    type: GraphicType,
    boundingRect: BoundingRect
}

export interface Position {
    x: number,
    y: number
}

interface BoundingRect {
    x1: number,
    x2: number,
    y1: number,
    y2: number,
}

