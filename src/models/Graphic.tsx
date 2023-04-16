import { getBoundingRect } from "../utils/GraphicsLogic";
import { BoundingRect, Position, Size } from "./IGraphic";
import { GraphicType } from "./enums";

export abstract class Graphic {
    position : Position;
    size : Size;
    boundingRect : BoundingRect;
    ctx?: CanvasRenderingContext2D;
    type: GraphicType;

    abstract draw() : void;

    constructor(position : Position, size : Size, type: GraphicType, ctx : CanvasRenderingContext2D | undefined = undefined){
        this.position = position;
        this.size = size;
        this.boundingRect = getBoundingRect(this.position, this.size);
        this.ctx = ctx;
        this.type = type;
    }

    recalculateBoundingRect() : void {
        this.boundingRect = getBoundingRect(this.position, this.size);
    }
}