import { GraphicType, MovementType } from "./enums"
/**
 * @category Models
 * @interface Size
 * @property {number} width 
 * @property {number} height 
 */
export interface Size {
    width: number,
    height: number
}
/**
 * @category Models
 * @interface Position
 * @property {number} x Position x
 * @property {number} y Position y
 */
export interface Position {
    x: number,
    y: number
}
/**
 * @category Models
 * @interface BoundingRect
 * @property {number} x1 Position x1
 * @property {number} y1 Position y1
 * @property {number} x2 Position x2
 * @property {number} y2 Position y2
 */
export interface BoundingRect {
    x1: number,
    x2: number,
    y1: number,
    y2: number
}
/**
 * @category Models
 * @interface IGraphicSave
 * @property {Position} position Position of graphic
 * @property {Size} size Size of graphic
 * @property {GraphicType} type Type of graphic
 * @property {MovementType} movementType Movement type of Robot
 */
export interface IGraphicSave {
    position: Position,
    size?: Size,
    type: GraphicType,
    movementType?: MovementType
}

