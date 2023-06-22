import { Graphic } from "./Graphic";
import { Position, Size } from "./IGraphic";
import { GraphicType } from "./enums";

export class Wall extends Graphic {
   /**
    * Vytvoří grafiku stěny a vykreslí ji
    * @constructs
    * @param position {Position} Pozice kam vložit grafiku
    * @param size {Size} Velikost grafiky
    * 
    * @category Models
    * @extends Graphic
    * @classdesc Grafika znázorňující stěnu
    */
    constructor(position : Position, size : Size){
        super(position, size, GraphicType.Wall);
    }

    /**
     * Vykreslí daný objekt na plátno
     * @returns {void}
     */
    draw(ctx: CanvasRenderingContext2D){
        ctx.fillStyle = "#202124";
        ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
    }

    /**
     * Nastaví velikost stěny
     * @param {Size} size Velikost na kterou má být stěna nastavena
     * @returns {void}
     */
    setSize(size:Size){
        this.size = size;
        this.recalculateBoundingRect();
    }
}