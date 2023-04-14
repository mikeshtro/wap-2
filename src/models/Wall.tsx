import { Graphic } from "./Graphic";
import { Position, Size } from "./IGraphic";

export class Wall extends Graphic {
    constructor(position : Position, size : Size, ctx: CanvasRenderingContext2D | undefined = undefined){
        super(position, size, ctx);
        this.draw();
    }

    draw(){
        if (!this.ctx) return;
        this.ctx.fillStyle = "#202124";
        this.ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
    }
}