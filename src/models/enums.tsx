/**
 * Možné operace, které si může uživatel zvolit
 * @category Models
 * @enum {number}
 */
export enum OperationType {
    Cursor,
    Wall,
    Finish,
    Robot
}

/**
 * Typ grafiky
 * @category Models
 * @enum {number}
 */
export enum GraphicType {
    Wall,
    Finish,
    Robot,
    Selected
}

/**
 * Typ pohybu robota
 * @category Models
 * @enum {string}
 */
export enum MovementType {
    Random = "Random",
    RightHand = "Right Hand",
    LeftHand = "Left Hand",
    Custom = "Custom"
}

/**
 * Směr pohybu robota
 * @category Models
 * @enum {string}
 */
export enum Directions {
    Up = "ArrowUp",
    Right = "ArrowRight",
    Down = "ArrowDown",
    Left = "ArrowLeft"
}