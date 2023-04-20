import { Graphic } from "./Graphic";
import { Position, Size } from "./IGraphic";
import { GraphicType } from "./enums";
/**
 * Class description
 * @category Models
 */
export class Selected extends Graphic {
    constructor(position : Position, size : Size, ctx: CanvasRenderingContext2D){
        super(position, size, GraphicType.Selected, ctx);
        this.draw();
    }

    draw(){
        if (!this.ctx) return;
        this.ctx.setLineDash([6]);
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = "red";
        this.ctx.strokeRect(this.position.x, this.position.y, this.size.width, this.size.height);
        this.ctx.lineWidth = 1;
    }
}