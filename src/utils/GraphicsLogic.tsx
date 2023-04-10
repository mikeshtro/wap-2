import { IGraphic } from "../models/IGraphic";
import { GraphicType } from "../models/enums";

export function detectGraphic(graphics : IGraphic[],x: number, y: number) : IGraphic | undefined {
    return graphics.find(g => 
        (g.boundingRect.x1 <= x && x <= g.boundingRect.x2) && 
        (g.boundingRect.y1 <= y && y <= g.boundingRect.y2))
}

export function recalculateBoundingRect(graphic : IGraphic){
    return ({
        ...graphic,
        boundingRect : {x1: graphic.x, x2: graphic.x + graphic.width, y1: graphic.y, y2: graphic.y + graphic.height}
    })
}

export function simulateStep(graphics : IGraphic[]) : IGraphic[]{
    const robots = graphics.filter(g => g.type === GraphicType.Robot);
    robots.forEach(r => graphics.splice(graphics.indexOf(r), 1));
    const walls = graphics.filter(g => g.type === GraphicType.Wall);
    const robotsNextStep = robots.map(r => nextRobotPosition(r, walls));
    return [...graphics, ...robotsNextStep];
}


export function isAllDone(graphics : IGraphic[]){
    const robots = graphics.filter(g => g.type === GraphicType.Robot);
    const finishes = graphics.filter(g => g.type === GraphicType.Finish);
    return robots.every(r => isInFinish(r, finishes));
}

function nextRobotPosition(robot : IGraphic, graphics : IGraphic[]) : IGraphic{
    if (!robot.move){
        return {...robot, move: {dx: 0, dy: -5}};
    }
    var newRobot = {...robot, x: robot.x + robot.move?.dx, y: robot.y + robot.move?.dy}
    newRobot = recalculateBoundingRect(newRobot);
    if (graphics.some(g => isCollision(newRobot, g))){
        return {...robot, move: {dx: robot.move.dy, dy: robot.move.dx}}
    }
    return newRobot;
}

function isInFinish(robot : IGraphic, finishes : IGraphic[]){
    return finishes.some(f => isCollision(robot, f));
}

function isCollision(graphic1 : IGraphic, graphic2 : IGraphic){
    return !((graphic1.boundingRect.y2 < graphic2.boundingRect.y1) ||
            (graphic1.boundingRect.y1 > graphic2.boundingRect.y2) ||
            (graphic1.boundingRect.x2 < graphic2.boundingRect.x1) ||
            (graphic1.boundingRect.x1 > graphic2.boundingRect.x2));
}