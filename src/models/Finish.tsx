import { Graphic } from "./Graphic";
import { Position } from "./IGraphic";

export class Finish extends Graphic {
    image : HTMLImageElement;

    constructor(position : Position, ctx : CanvasRenderingContext2D){
        super(position, {width: 32, height: 32}, ctx);
        const image = new Image();
        image.src = "/assets/finish.png";
        image.onload = function () {
            ctx.drawImage(image, position.x, position.y);
        }
        this.image = image;
    }

    draw(){
        this.ctx.drawImage(this.image, this.position.x, this.position.y);
    }

    move(){

    }


}