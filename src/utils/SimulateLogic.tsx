import { graphics } from "../components/Canvas";
import { Directions, MovementType } from "../models/enums";
import { Finish } from "../models/Finish";
import { Graphic } from "../models/Graphic";
import { Robot } from "../models/Robot";
import { Wall } from "../models/Wall";

export function simulateStep() : Graphic[]{
    const robots = graphics.filter(g => g instanceof Robot) as Robot[];
    robots.forEach(r => graphics.splice(graphics.indexOf(r), 1));
    const walls = graphics.filter(g => g instanceof Wall) as Wall[];
    const finishes = graphics.filter(g => g instanceof Finish) as Finish[];
    const robotsNextStep = robots.map(r => r.isInFinish(finishes) ? r : r.move(walls));
    return [...graphics, ...robotsNextStep];
}

export function someCollision() : boolean {
    const robots = graphics.filter(g => g instanceof Robot) as Robot[];
    const walls = graphics.filter(g => g instanceof Wall) as Wall[];
    return robots.some(r => walls.some(w => r.isCollision(w)));
}

export function isAllDone() : boolean {
    const robots = graphics.filter(g => g instanceof Robot) as Robot[];
    const finishes = graphics.filter(g => g instanceof Finish) as Finish[];
    return robots.every(r => r.isInFinish(finishes));
}

export function turning(key : string) {
    const robots = graphics.filter(g => g instanceof Robot && g.movement.type === MovementType.Custom) as Robot[];
    robots.forEach(r => r.setDirection(key as Directions));
}