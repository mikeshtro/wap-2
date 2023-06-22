/**
 * Obsahuje veškerou logiku jednotlivých (nejobecnějších grafik)
 * @module GraphicsLogic
 * @category Utils
 */

import { canvasSize } from "../components/Canvas";
import { Graphic } from "../models/Graphic";
import { Position} from "../models/IGraphic";
import { Selected } from "../models/Selected";
import { Wall } from "../models/Wall";


/**
 * Detekuje grafiku dle pozice
 * @category Utils
 * @param position {Position} Na jaké pozici nás zajímá
 * @param graphics {Graphic[]} seznam všech grafik
 * @returns {Graphic | undefined} Kterou grafiku jsme případně našli
 */
export function detectGraphic(position : Position, graphics: Graphic[]) : Graphic | undefined {
    return graphics.find(g => 
        (g.boundingRect.x1 <= position.x && position.x <= g.boundingRect.x2) && 
        (g.boundingRect.y1 <= position.y && position.y <= g.boundingRect.y2))
}

/**
 * Vytvoří implicitní zdi kolem zobrazovacího plátna
 * @category Utils
 * @returns {Graphic[]} Seznam vytvořených zdí
 */
export function createBarrier() : Graphic[]{
    return [
        new Wall({x: -1, y: 0}, {width: 1, height: canvasSize.height}),
        new Wall({x: 0, y: -1}, {width: canvasSize.width, height: 1}),
        new Wall({x: canvasSize.width + 1, y : 0}, {width: 1, height: canvasSize.height}),
        new Wall({x: 0, y: canvasSize.height + 1}, {width: canvasSize.width, height: 1})
    ];
}

/**
 * Překreslí celé plátno dle aktuálních grafik
 * @category Utils
 * @param graphics {Graphic[]} seznam všech grafik pro vykreslení
 * @param ctx {CanvasRenderingContext2D} context, který se má překresit
 */
export function redraw(graphics: Graphic[], ctx: CanvasRenderingContext2D){
    ctx.clearRect(0,0,canvasSize.width, canvasSize.height);
    graphics.forEach(g => g.draw(ctx))
}

/**
 * Vykreslí ohraničení vybrané grafiky
 * @category Utils
 * @param graphic {Graphic} Grafika, která je vybrána
 * @param ctx {CanvasRenderingContext2D} context, který se má překresit
 */
export function drawSelected(graphic : Graphic, ctx: CanvasRenderingContext2D){
    new Selected(graphic.position, graphic.size).draw(ctx);
}

