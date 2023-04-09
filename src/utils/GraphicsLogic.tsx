import { IGraphic } from "../models/IGraphic";

export function detectGraphic(graphics : IGraphic[],x: number, y: number) : IGraphic | undefined {
    return graphics.find(g => 
        (g.boundingRect.x1 <= x && x <= g.boundingRect.x2) && 
        (g.boundingRect.y1 <= y && y <= g.boundingRect.y2))
}