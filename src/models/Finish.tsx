import { Graphic } from "./Graphic";
import { Position } from "./IGraphic";
import { GraphicType } from "./enums";


/**
 * Graphic Finish
 * @category Models
 * @class 
 * @alias Finish
 * @extends Graphic
 * @property {HTMLImageElement} image Image for Robot or Finish 
 */
export class Finish extends Graphic {
    image : HTMLImageElement;

    constructor(position : Position, ctx : CanvasRenderingContext2D){
        super(position, {width: 32, height: 32}, GraphicType.Finish, ctx);
        const image = new Image();
        image.src = "/assets/finish.png";
        image.onload = function () {
            ctx.drawImage(image, position.x, position.y);
        }
        this.image = image;
    }

    /**
     * Draws a Finish
     * @exports Finish
     * @function draw
     * @returns void
     */
    draw(){
        if (!this.ctx) return;
        this.ctx.drawImage(this.image, this.position.x, this.position.y);
    }
}