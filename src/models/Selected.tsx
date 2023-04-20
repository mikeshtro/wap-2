import { Graphic } from "./Graphic";
import { Position, Size } from "./IGraphic";
import { GraphicType } from "./enums";
/**
 * Selected
 * @category Models
 * @alias Selected
 * @class 
 * @extends Graphic
 */
export class Selected extends Graphic {
    constructor(position : Position, size : Size, ctx: CanvasRenderingContext2D){
        super(position, size, GraphicType.Selected, ctx);
        this.draw();
    }

    /**
     * Draws a selected graphic
     * @exports Selected
     * @function draw
     * @returns void
     */
    draw(){
        if (!this.ctx) return;
        this.ctx.setLineDash([6]);
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = "red";
        this.ctx.strokeRect(this.position.x, this.position.y, this.size.width, this.size.height);
        this.ctx.lineWidth = 1;
    }
}