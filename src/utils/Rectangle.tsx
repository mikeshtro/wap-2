import { BoundingRect, Position, Size } from "../models/IGraphic";

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