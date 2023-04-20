import { Graphic } from "./Graphic";
import { Position, Size } from "./IGraphic";
import { GraphicType } from "./enums";

export class Selected extends Graphic {
   /**
    * Vybraná grafika
    * @constructs
    * @param position {Position} Pozice kam vložit grafiku
    * @param size {Size} Velikost grafiky
    * @param ctx {CanvasRenderingContext2D} Kontext plátna pro vykreslení
    * 
    * @category Models
    * @extends Graphic
    * @classdesc Vybraná grafika 
    */
    constructor(position : Position, size : Size, ctx: CanvasRenderingContext2D){
        super(position, size, GraphicType.Selected, ctx);
        this.draw();
    }

    /**
     * Vykreslí daný objekt na plátno
     * @returns {void}
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