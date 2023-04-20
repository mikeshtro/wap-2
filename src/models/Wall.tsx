import { Graphic } from "./Graphic";
import { Position, Size } from "./IGraphic";
import { GraphicType } from "./enums";
/**
 * Wall
 * @category Models
 * @alias Wall
 * @class 
 * @extends Graphic
 */
export class Wall extends Graphic {
    constructor(position : Position, size : Size, ctx: CanvasRenderingContext2D | undefined = undefined){
        super(position, size, GraphicType.Wall, ctx);
        this.draw();
    }

    /**
     * Draws a Wall
     * @exports Wall
     * @function draw
     * @returns void
     */
    draw(){
        if (!this.ctx) return;
        this.ctx.fillStyle = "#202124";
        this.ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
    }

    /**
     * Set size of a Wall
     * @exports Wall
     * @function setSize
     * @property {Size} size Size to be set
     * @returns void
     */
    setSize(size:Size){
        this.size = size;
        this.recalculateBoundingRect();
    }
}