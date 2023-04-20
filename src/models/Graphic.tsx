import { getBoundingRect } from "../utils/GraphicsLogic";
import { BoundingRect, Position, Size } from "./IGraphic";
import { GraphicType } from "./enums";

export abstract class Graphic {
    position : Position;
    size : Size;
    boundingRect : BoundingRect;
    ctx?: CanvasRenderingContext2D;
    type: GraphicType;

    /**
     * Abstraktní metoda pro vykreslení grafiky
     * @returns {void}
     */
    abstract draw() : void;

   /**
    * Abstraktní třída Grafiky, definuje abstraktní metodu draw 
    * @constructs
    * @param position {Position} Pozice kam vložit grafiku
    * @param size {Size} Velikost grafického prvku
    * @param type {GraphicType} Typ grafického prvku
    * @param ctx {CanvasRenderingContext2D} Kontext plátna pro vykreslení
    * 
    * @category Models
    * @abstract
    * @classdesc Abstraktní třída Grafika
    * 
    * @property {Position} position Pozice kam vložit grafiku
    * @property {Size} size Velikost grafického prvku
    * @property {BoundingRect} boundingRect Obrázek cíle
    * @property {CanvasRenderingContext2D} ctx Kontext plátna pro vykreslení
    * @property {GraphicType} type Typ grafického prvku
    */
    constructor(position : Position, size : Size, type: GraphicType, ctx : CanvasRenderingContext2D | undefined = undefined){
        this.position = position;
        this.size = size;
        this.boundingRect = getBoundingRect(this.position, this.size);
        this.ctx = ctx;
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