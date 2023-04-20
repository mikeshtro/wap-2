/**
 * Obsahuje veškerou logiku jednotlivých (nejobecnějších grafik)
 * @module GraphicsLogic
 * @category Utils
 */

import { canvasSize, ctx, graphics } from "../components/Canvas";
import { Graphic } from "../models/Graphic";
import { BoundingRect, Position, Size } from "../models/IGraphic";
import { Selected } from "../models/Selected";
import { Wall } from "../models/Wall";

/**
 * Vypočítá bounding rect dle parametrů grafiky
 * @category Utils
 * @param position {Position} Jaká je aktuální pozice grafiky
 * @param size {Size} Jaká je aktuální velikost grafiky
 * @returns {BoundingRect} Bounding rect dané grafiky
 */
export function getBoundingRect(position : Position, size: Size) : BoundingRect{
    return {
        x1: position.x, 
        x2: position.x + size.width, 
        y1: position.y, 
        y2: position.y + size.height};
}

/**
 * Detekuje grafiku dle pozice
 * @category Utils
 * @param position {Position} Na jaké pozici nás zajímá
 * @returns {Graphic | undefined} Kterou grafiku jsme případně našli
 */
export function detectGraphic(position : Position) : Graphic | undefined {
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
 */
export function redraw(){
    if (ctx){
        ctx.clearRect(0,0,canvasSize.width, canvasSize.height);
        graphics.forEach(g => g.draw())
    }
}

/**
 * Vykreslí ohraničení vybrané grafiky
 * @category Utils
 * @param graphic {Graphic} Grafika, která je vybrána
 */
export function drawSelected(graphic : Graphic){
    if (ctx)
        new Selected(graphic.position, graphic.size, ctx);
}

