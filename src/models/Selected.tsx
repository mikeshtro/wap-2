import { Graphic } from "./Graphic";
import { Position, Size } from "./IGraphic";
import { GraphicType } from "./enums";

export class Selected extends Graphic {
   /**
    * Vytvoří grafiku a vykreslí ji
    * @constructs
    * @param position {Position} Pozice kam vložit grafiku
    * @param size {Size} Velikost grafiky
    * 
    * @category Models
    * @extends Graphic
    * @classdesc Grafika znázorňující označení grafiky
    */
    constructor(position : Position, size : Size){
        super(position, size, GraphicType.Selected);
    }

    /**
     * Vykreslí daný objekt na plátno
     * @param ctx {CanvasRenderingContext2D} Kontext plátna pro vykreslení
     * @returns {void}
     */
    draw(ctx: CanvasRenderingContext2D){
        ctx.setLineDash([6]);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "red";
        ctx.strokeRect(this.position.x, this.position.y, this.size.width, this.size.height);
        ctx.lineWidth = 1;
    }
}