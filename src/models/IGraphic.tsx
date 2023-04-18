import { GraphicType, MovementType } from "./enums"

export interface Size {
    width: number,
    height: number
}

export interface Position {
    x: number,
    y: number
}

export interface BoundingRect {
    x1: number,
    x2: number,
    y1: number,
    y2: number
}

export interface IGraphicSave {
    position: Position,
    size?: Size,
    type: GraphicType,
    movementType?: MovementType
}

