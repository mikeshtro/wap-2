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
 * Rozhraní znázorňující pozici grafiky
 * @category Models
 * @interface
 */
export interface Position {
    /**
     * Pozice x
     */
    x: number,
    /**
     * Pozice y
     */
    y: number
}

/**
 * Ohraničení grafiky
 * @category Models
 * @interface 
 */
export interface BoundingRect {
    /**
     * Pozice x1 (začátek)
     */
    x1: number,
    /**
     * Pozice x2 (konec)
     */
    x2: number,
    /**
     * Pozice y1 (začátek)
     */
    y1: number,
    /**
     * Pozice y2 (konec)
     */
    y2: number
}

/**
 * Rozhraní pro ukládání grafik
 * @category Models
 * @interface
 */
export interface IGraphicSave {
    /**
     * Pozice grafiky
     */
    position: Position,
    /**
     * Velikost grafiky
     */
    size?: Size,
    /**
     * Typ grafiky
     */
    type: GraphicType,
    /**
     * Typ pohybu robota
     */
    movementType?: MovementType
}

