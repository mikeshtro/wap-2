/**
 * Obsahuje veškerou logiku pohybu robotů
 * @module SimulateLogic
 * @category Utils
 */

import { Directions, MovementType } from "../models/enums";
import { Finish } from "../models/Finish";
import { Graphic } from "../models/Graphic";
import { Robot } from "../models/Robot";
import { Wall } from "../models/Wall";

/**
 * Provede 1 simulační krok (jednotlivý roboti se posunou o 1 krok)
 * @category Utils
 * @param graphics {Graphic[]} seznam všech grafik
 * @returns {Graphic[]} Výsledné nové grafiky (posunuté)
 */
export function simulateStep(graphics: Graphic[]) : Graphic[]{
    const robots = graphics.filter(g => g instanceof Robot) as Robot[];
    const walls = graphics.filter(g => g instanceof Wall) as Wall[];
    const finishes = graphics.filter(g => g instanceof Finish) as Finish[];
    const robotsNextStep = robots.map(r => r.isInFinish(finishes) ? r : r.move(walls));
    return graphics.filter(g => !(g instanceof Robot)).concat(robotsNextStep);
}

/**
 * Zjistí zda aktuálně nějaký robot je v kolizi
 * @category Utils
 * @param graphics {Graphic[]} seznam všech grafik
 * @returns {boolean} True pokud je detekována nějaká kolize
 */
export function someCollision(graphics: Graphic[]) : boolean {
    const robots = graphics.filter(g => g instanceof Robot) as Robot[];
    const walls = graphics.filter(g => g instanceof Wall) as Wall[];
    return robots.some(r => walls.some(w => r.isCollision(w)));
}

/**
 * Zjistí, zda všichni roboti jsou již v cíli
 * @category Utils
 * @param graphics {Graphic[]} seznam všech grafik
 * @returns {boolean} True pokud všichni roboti jsou již v cíli
 */
export function isAllDone(graphics: Graphic[]) : boolean {
    const robots = graphics.filter(g => g instanceof Robot) as Robot[];
    const finishes = graphics.filter(g => g instanceof Finish) as Finish[];
    return robots.every(r => r.isInFinish(finishes));
}

/**
 * Změní směr pohybu robotů, kteří jsou ovládání pomocí klávesnice
 * @category Utils
 * @param key {string} Nový směr robota
 * @param graphics {Graphic[]} seznam všech grafik
 * @returns {Graphic[]} Výsledné grafiky otočené
 */
export function turning(key : string, graphics: Graphic[]): Graphic[] {
    const robots = graphics.filter(g => g instanceof Robot && g.movement.type === MovementType.Custom) as Robot[];
    robots.forEach(r => r.setDirection(key as Directions));
    return robots;
}