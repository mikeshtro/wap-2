import { Graphic } from "./Graphic";
import { Position } from "./IGraphic";
import { GraphicType } from "./enums";

export class Finish extends Graphic {
    image : HTMLImageElement | undefined;

   /**
    * Vytvoří grafiku, které nastaví výchozí hodnoty velikosti a přednačte si obrázek, který zobrazuje cíl. Následně grafiku i vykreslí
    * @constructs
    * @param position {Position} Pozice kam vložit grafiku
    * 
    * @category Models
    * @extends Graphic
    * @classdesc Grafika znázorňující cíl
    * 
    * @property {HTMLImageElement} image Obrázek cíle
    */
    constructor(position : Position){
        super(position, {width: 32, height: 32}, GraphicType.Finish);
    }

    /**
     * Vykreslí daný objekt na plátno
     * @param ctx {CanvasRenderingContext2D} Kontext plátna pro vykreslení
     * @returns {void}
     */
    draw(ctx: CanvasRenderingContext2D){
        // Pri prvnim renderu vytvorim image
        // Teoreticky muze byt problem, kdyby se zavolal render znovu driv
        // nez se naloaduje obrazek
        if (this.image == null) {
            const image = new Image();
            image.src = "/assets/finish.png";
            image.onload = () => {
                ctx.drawImage(image, this.position.x, this.position.y);
            }
            this.image = image;
        } else {
            ctx.drawImage(this.image, this.position.x, this.position.y);
        }
    }
}