import { getBoundingRect } from "../utils/GraphicsLogic";
import { BoundingRect, Position, Size } from "./IGraphic";
import { GraphicType } from "./enums";
/**
 * Abstract Graphic
 * @category Models
 * @alias Graphic
 * @abstract 
 * @class 
 * @property {Position} position Position of graphic on canvas 
 * @property {Size} size Size of given graphic
 * @property {BoundingRect} boundingRect Bounding rect of graphic 
 * @property {CanvasRenderingContext2D | undefined} ctx Context of rendering canvas 
 * @property {GraphicType} type Type of graphic
 */
export abstract class Graphic {
    position : Position;
    size : Size;
    boundingRect : BoundingRect;
    ctx?: CanvasRenderingContext2D;
    type: GraphicType;

    /**
     * Draw method
     * @abstract
     * @returns void
     */
    abstract draw() : void;

    constructor(position : Position, size : Size, type: GraphicType, ctx : CanvasRenderingContext2D | undefined = undefined){
        this.position = position;
        this.size = size;
        this.boundingRect = getBoundingRect(this.position, this.size);
        this.ctx = ctx;
        this.type = type;
    }

    /**
     * Recalculates bounding rectangle
     * @returns void
     */
    recalculateBoundingRect() : void {
        this.boundingRect = getBoundingRect(this.position, this.size);
    }
}