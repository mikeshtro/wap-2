export interface IGraphic {
    x: number,
    y: number,
    width: number,
    height: number,
    type: GraphicType,
    boundingRect: BoundingRect
}

interface BoundingRect {
    x1: number,
    x2: number,
    y1: number,
    y2: number,
}

export enum GraphicType {
    Wall,
    Finish,
    Robot
}