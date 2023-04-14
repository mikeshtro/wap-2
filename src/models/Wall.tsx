import { Graphic } from "./Graphic";
import { Position, Size } from "./IGraphic";

export class Wall extends Graphic {
    constructor(position : Position, size : Size, ctx: CanvasRenderingContext2D){
        super(position, size, ctx);
        this.draw();
    }

    draw(){
        this.ctx.fillStyle = "#202124";
        this.ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
    }

    setSize(size:Size){
        this.size = size;
        this.recalculateBoundingRect();
    }
}