import { GraphicType, MovementType } from "./enums"
/**
 * Rozhraní znázorňující velikost grafiky
 * @category Models
 * @interface
 */
export interface Size {
    /**
     * Šířka
     */
    width: number,
    /**
     * Výška
     */
    height: number
}
/**
 * Class description
 * @category Models
 */
export interface Position {
    x: number,
    y: number
}
/**
 * Class description
 * @category Models
 */
export interface BoundingRect {
    x1: number,
    x2: number,
    y1: number,
    y2: number
}
/**
 * Class description
 * @category Models
 */
export interface IGraphicSave {
    position: Position,
    size?: Size,
    type: GraphicType,
    movementType?: MovementType
}

