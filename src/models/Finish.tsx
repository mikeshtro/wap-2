import { Graphic } from "./Graphic";
import { Position } from "./IGraphic";
import { GraphicType } from "./enums";

export class Finish extends Graphic {
    image : HTMLImageElement;

   /**
    * Vytvoří grafiku, které nastaví výchozí hodnoty velikosti a přednačte si obrázek, který zobrazuje cíl. Následně grafiku i vykreslí
    * @constructs
    * @param position {Position} Pozice kam vložit grafiku
    * @param ctx {CanvasRenderingContext2D} Kontext plátna pro vykreslení
    * 
    * @category Models
    * @extends Graphic
    * @classdesc Grafika znázorňující cíl
    * 
    * @property {HTMLImageElement} image Obrázek cíle
    */
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
     * Vykreslí daný objekt na plátno
     * @returns {void}
     */
    draw(){
        if (!this.ctx) return;
        this.ctx.drawImage(this.image, this.position.x, this.position.y);
    }
}