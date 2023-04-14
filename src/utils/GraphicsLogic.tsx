import { Finish } from "../models/Finish";
import { Graphic } from "../models/Graphic";
import { BoundingRect, Position, Size } from "../models/IGraphic";
import { Robot } from "../models/Robot";
import { Wall } from "../models/Wall";

export function getBoundingRect(position : Position, size: Size) : BoundingRect{
    return {
        x1: position.x, 
        x2: position.x + size.width, 
        y1: position.y, 
        y2: position.y + size.height};
}

export function detectGraphic(graphics : Graphic[], position : Position) : Graphic | undefined {
    return graphics.find(g => 
        (g.boundingRect.x1 <= position.x && position.x <= g.boundingRect.x2) && 
        (g.boundingRect.y1 <= position.y && position.y <= g.boundingRect.y2))
}

export function simulateStep(graphics : Graphic[]) : Graphic[]{
    const robots = graphics.filter(g => g instanceof Robot) as Robot[];
    robots.forEach(r => graphics.splice(graphics.indexOf(r), 1));
    const walls = graphics.filter(g => g instanceof Wall) as Wall[];
    const finishes = graphics.filter(g => g instanceof Finish) as Finish[];
    const robotsNextStep = robots.map(r => r.isInFinish(finishes) ? r : r.move(walls));
    return [...graphics, ...robotsNextStep];
}

export function someCollision(graphics : Graphic[]) : boolean {
    const robots = graphics.filter(g => g instanceof Robot) as Robot[];
    const walls = graphics.filter(g => g instanceof Wall) as Wall[];
    return robots.some(r => walls.some(w => r.isCollision(w)));
}

export function isAllDone(graphics : Graphic[]){
    const robots = graphics.filter(g => g instanceof Robot) as Robot[];
    const finishes = graphics.filter(g => g instanceof Finish) as Finish[];
    return robots.every(r => r.isInFinish(finishes));
}

export function createBarrier(size: Size,) : Graphic[]{
    return [
        new Wall({x: -1, y: 0}, {width: 1, height: size.height}),
        new Wall({x: 0, y: -1}, {width: size.width, height: 1}),
        new Wall({x: size.width + 1, y : 0}, {width: 1, height: size.height}),
        new Wall({x: 0, y: size.height + 1}, {width: size.width, height: 1})
    ];
}