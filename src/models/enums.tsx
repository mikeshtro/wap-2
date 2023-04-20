/**
 * Type of operation
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
 * Type of graphic
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
 * Type of movement
 * @category Models
 * @enum {number}
 */
export enum MovementType {
    Random = "Random",
    RightHand = "Right Hand",
    LeftHand = "Left Hand"
}

/**
 * Direction of movement
 * @category Models
 * @enum {number}
 */
export enum Directions {
    Up = "up",
    Right = "right",
    Down = "down",
    Left = "left"
}