import { getBoundingRect } from "../utils/Rectangle";
import { BoundingRect, Position, Size } from "./IGraphic";
import { GraphicType } from "./enums";

export abstract class Graphic {
    position : Position;
    size : Size;
    boundingRect : BoundingRect;
    type: GraphicType;

    /**
     * Abstraktní metoda pro vykreslení grafiky
     * @returns {void}
     */
    abstract draw(ctx: CanvasRenderingContext2D) : void;

   /**
    * Vytvoří základní grafiku a vypočíta její ohraničení
    * @constructs
    * @param position {Position} Pozice kam vložit grafiku
    * @param size {Size} Velikost grafického prvku
    * @param type {GraphicType} Typ grafického prvku
    * 
    * @category Models
    * @abstract
    * @classdesc Abstraktní třída Grafika
    * 
    * @property {Position} position Pozice kam vložit grafiku
    * @property {Size} size Velikost grafického prvku
    * @property {BoundingRect} boundingRect Ohraničení obrázku
    * @property {CanvasRenderingContext2D} ctx Kontext plátna pro vykreslení
    * @property {GraphicType} type Typ grafického prvku
    */
    constructor(position : Position, size : Size, type: GraphicType) {
        this.position = position;
        this.size = size;
        this.boundingRect = getBoundingRect(this.position, this.size);
        this.type = type;
    }

    /**
     * Přepočítá bounding rectangle grafiky
     * @returns {void}
     */
    recalculateBoundingRect() : void {
        this.boundingRect = getBoundingRect(this.position, this.size);
    }
}