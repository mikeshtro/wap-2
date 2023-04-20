/**
 * Obsahuje veškerou logiku pohybu robotů
 * @module SimulateLogic
 * @category Utils
 */

import { graphics } from "../components/Canvas";
import { Directions, MovementType } from "../models/enums";
import { Finish } from "../models/Finish";
import { Graphic } from "../models/Graphic";
import { Robot } from "../models/Robot";
import { Wall } from "../models/Wall";

/**
 * Provede 1 simulační krok (jednotlivý roboti se posunou o 1 krok)
 * @category Utils
 * @returns {Graphic[]} Výsledné nové grafiky (posunuté)
 */
export function simulateStep() : Graphic[]{
    const robots = graphics.filter(g => g instanceof Robot) as Robot[];
    robots.forEach(r => graphics.splice(graphics.indexOf(r), 1));
    const walls = graphics.filter(g => g instanceof Wall) as Wall[];
    const finishes = graphics.filter(g => g instanceof Finish) as Finish[];
    const robotsNextStep = robots.map(r => r.isInFinish(finishes) ? r : r.move(walls));
    return [...graphics, ...robotsNextStep];
}

/**
 * Zjistí zda aktuálně nějaký robot je v kolizi
 * @category Utils
 * @returns {boolean} True pokud je detekována nějaká kolize
 */
export function someCollision() : boolean {
    const robots = graphics.filter(g => g instanceof Robot) as Robot[];
    const walls = graphics.filter(g => g instanceof Wall) as Wall[];
    return robots.some(r => walls.some(w => r.isCollision(w)));
}

/**
 * Zjistí, zda všichni roboti jsou již v cíli
 * @category Utils
 * @returns {boolean} True pokud všichni roboti jsou již v cíli
 */
export function isAllDone() : boolean {
    const robots = graphics.filter(g => g instanceof Robot) as Robot[];
    const finishes = graphics.filter(g => g instanceof Finish) as Finish[];
    return robots.every(r => r.isInFinish(finishes));
}

/**
 * Změní směr pohybu robotů, kteří jsou ovládání pomocí klávesnice
 * @category Utils
 * @param key {string} Nový směr robota
 */
export function turning(key : string) {
    const robots = graphics.filter(g => g instanceof Robot && g.movement.type === MovementType.Custom) as Robot[];
    robots.forEach(r => r.setDirection(key as Directions));
}