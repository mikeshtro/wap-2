import { getBoundingRect } from "../utils/GraphicsLogic";
import { Graphic } from "./Graphic";
import { Position } from "./IGraphic";
import { Wall } from "./Wall";
import { Directions, GraphicType, MovementType } from "./enums";

/**
 * Pohyb robota
 * @category Models
 * @interface
 * @property {MovementType} type Type of movement of robot
 * @property {Directions} curDirection Direction of robot
 * @property {number} dx Movement amount in x
 * @property {number} dy Movement amount in y
 */
interface Movement {
    /**
     * Druh pohybu
     */
    type: MovementType,
    /**
     * Aktuální směr pohybu
     */
    curDirection: Directions,
    /**
     * Posun v ose x
     */
    dx: number,
    /**
     * Posun v ose y
     */
    dy: number
}

const Movements = {
    [Directions.Up] : {curDirection: Directions.Up, dx: 0, dy: -2},
    [Directions.Right]: {curDirection: Directions.Right, dx: 2, dy: 0},
    [Directions.Down]: {curDirection: Directions.Down, dx: 0, dy: 2},
    [Directions.Left]: {curDirection: Directions.Left, dx: -2, dy: 0}
}
/**
 * Grafika znázorňující robota
 * @category Models
 * @alias Robot
 * @class 
 * @extends Graphic
 * @property {HTMLImageElement} image Obrázek robota
 * @property {Movement} movement Pohyb robota
 */
export class Robot extends Graphic {
    image : HTMLImageElement;
    movement : Movement;

    /**
     * Vytvoří grafiku, které nastaví výchozí hodnoty velikosti a přednačte si obrázek, který zobrazuje robota. Následně grafiku i vykreslí
     * @param position {Position} Pozice kam vložit grafiku
     * @param ctx {CanvasRenderingContext2D} Kontext plátna pro vykreslení
     * @param moveType {MovementType} Způsb pohybu robota
     */
    constructor(position : Position, ctx : CanvasRenderingContext2D, moveType : MovementType = MovementType.Random){
        super(position, {width: 32, height: 32}, GraphicType.Robot, ctx);
        const image = new Image();
        image.src = "/assets/robot.png";
        image.onload = function () {
            ctx.drawImage(image, position.x, position.y);
        }
        this.image = image;

        this.movement = {type: moveType, ...Movements[Directions.Up]};
    }

    /**
     * Set movement type of given robot
     * @param {MovementType} movementType Type of movement
     * @returns void
     */
    setMovementType(movementType: MovementType) {
        this.movement.type = movementType;
        //reset pohybu pri zmeny nastaveni
        this.movement = {...this.movement, ...Movements[Directions.Up]};
    }

    /**
     * Draws a robot
     * @returns void
     */
    draw(){
        if (!this.ctx) return;
        this.ctx.drawImage(this.image, this.position.x, this.position.y);
    }
    
    /**
     * Set next random direction when robot colides
     * @returns void
     */
    randomMove() {
        const index = Math.floor(Math.random() * 4);
        switch (index) {
            case 0:
                this.movement = {...this.movement, ...Movements[Directions.Up]};
                break;
            case 1:
                this.movement = {...this.movement, ...Movements[Directions.Right]};
                break;
            case 2:
                this.movement = {...this.movement, ...Movements[Directions.Down]};
                break;
            case 3:
                this.movement = {...this.movement, ...Movements[Directions.Left]};
                break;
        }
    }

    /**
     * Turn tobot 90 degrees right when robot colides
     * @returns void
     */
    rightHandMove() {
        switch (this.movement.curDirection) {
            case Directions.Up:
                this.movement = {...this.movement, ...Movements[Directions.Right]};
                break;
            case Directions.Right:
                this.movement = {...this.movement, ...Movements[Directions.Down]};
                break;
            case Directions.Down:
                this.movement = {...this.movement, ...Movements[Directions.Left]};
                break;
            case Directions.Left:
                this.movement = {...this.movement, ...Movements[Directions.Up]};
                break;
        }
    }

    /**
     * Turn tobot 90 degrees left when robot colides
     * @returns void
     */
    leftHandMove() {
        switch (this.movement.curDirection) {
            case Directions.Up:
                this.movement = {...this.movement, ...Movements[Directions.Left]};
                break;
            case Directions.Right:
                this.movement = {...this.movement, ...Movements[Directions.Up]};
                break;
            case Directions.Down:
                this.movement = {...this.movement, ...Movements[Directions.Right]};
                break;
            case Directions.Left:
                this.movement = {...this.movement, ...Movements[Directions.Down]};
                break;
        }
    }

    customMove() {
        switch (this.movement.curDirection) {
            case Directions.Up:
                this.movement = {...this.movement, ...Movements[Directions.Up]};
                break;
            case Directions.Right:
                this.movement = {...this.movement, ...Movements[Directions.Right]};
                break;
            case Directions.Down:
                this.movement = {...this.movement, ...Movements[Directions.Down]};
                break;
            case Directions.Left:
                this.movement = {...this.movement, ...Movements[Directions.Left]};
                break;
        }
    }

    /**
     * Moves with robot
     * @param {Wall[]} walls List of walls
     * @returns Robot
     */
    move(walls : Wall[]) : Robot {
        var newRobot = {...this, position : {x: this.position.x + this.movement.dx, y: this.position.y + this.movement.dy}};
        newRobot.boundingRect = getBoundingRect(newRobot.position, newRobot.size);
        //pokud nastane kolize, tak ho nemenim
        if (walls.some(w => this.isCollision(w,newRobot))){
            //Urceni noveho pohybu
            switch (this.movement.type) {
                case MovementType.Random: 
                    this.randomMove(); 
                    break;
                case MovementType.RightHand: 
                    this.rightHandMove(); 
                    break;
                case MovementType.LeftHand: 
                    this.leftHandMove(); 
                    break;
                default:
                    this.customMove();
                    break;
            }
            return this;
        }
        //pokus nenastane kolize, tak ho menim
        this.position = newRobot.position;
        this.recalculateBoundingRect();
        return this;
    }

    /**
     * Checks if Robot colides with Finish
     * @param {Graphic[]} finishes List of finishes
     * @returns boolean
     */
    isInFinish(finishes : Graphic[]) : boolean{
        return finishes.some(f => this.isCollision(f));
    }

    /**
     * Checks if Robot colides with graphic
     * @param {Graphic} graphic2 Graphic to check
     * @param {Robot} graphic1 Robot to check
     * @returns boolean
     */
    isCollision(graphic2 : Graphic, graphic1 : Robot = this){
        return !((graphic1.boundingRect.y2 < graphic2.boundingRect.y1) ||
                (graphic1.boundingRect.y1 > graphic2.boundingRect.y2) ||
                (graphic1.boundingRect.x2 < graphic2.boundingRect.x1) ||
                (graphic1.boundingRect.x1 > graphic2.boundingRect.x2));
    }
}