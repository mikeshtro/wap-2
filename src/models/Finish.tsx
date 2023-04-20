import { Graphic } from "./Graphic";
import { Position } from "./IGraphic";
import { GraphicType } from "./enums";

/**
 * Grafika znázorňující cíl
 * @category Models
 * @extends Graphic
 */
export class Finish extends Graphic {
    /**
     * Obrázek grafiky
     */
    image : HTMLImageElement;

    /**
     * Vytvoří grafiku, které nastaví výchozí hodnoty velikosti a přednačte si obrázek, který zobrazuje cíl. Následně grafiku i vykreslí
     * @param position {Position} Pozice kam vložit grafiku
     * @param ctx {CanvasRenderingContext2D} Kontext plátna pro vykreslení
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
     */
    draw(){
        if (!this.ctx) return;
        this.ctx.drawImage(this.image, this.position.x, this.position.y);
    }
}