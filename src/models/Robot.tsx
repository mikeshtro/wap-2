import { getBoundingRect } from "../utils/GraphicsLogic";
import { Graphic } from "./Graphic";
import { Position } from "./IGraphic";
import { Wall } from "./Wall";
import { Directions, GraphicType, MovementType } from "./enums";

/**
 * @category Models
 * @interface Movement
 * @property {MovementType} type Type of movement of robot
 * @property {Directions} curDirection Direction of robot
 * @property {number} dx Movement amount in x
 * @property {number} dy Movement amount in y
 */
interface Movement {
    type: MovementType,
    curDirection: Directions,
    dx: number,
    dy: number
}

const Movements = {
    [Directions.Up] : {curDirection: Directions.Up, dx: 0, dy: -2},
    [Directions.Right]: {curDirection: Directions.Right, dx: 2, dy: 0},
    [Directions.Down]: {curDirection: Directions.Down, dx: 0, dy: 2},
    [Directions.Left]: {curDirection: Directions.Left, dx: -2, dy: 0}
}
/**
 * Robot
 * @category Models
 * @alias Robot
 * @class 
 * @extends Graphic
 * @property {any} image Image of robot
 * @property {Movement} movement Movement of robot
 */
export class Robot extends Graphic {
    image : any;
    movement : Movement;

    constructor(position : Position, ctx : CanvasRenderingContext2D, moveType : MovementType = MovementType.Random){
        super(position, {width: 32, height: 32}, GraphicType.Robot, ctx);
        const image = new Image();
        image.src = "/assets/robot.png";
        image.onload = function () {
            ctx.drawImage(image, position.x, position.y);
        }
        this.image = image;

        //Defaultne pojede nahoru
        this.movement = {type: moveType, ...Movements[Directions.Up]};
    }

    /**
     * Set movement type of given robot
     * @exports Robot
     * @function setMovementType
     * @property {MovementType} movementType Type of movement
     * @returns void
     */
    setMovementType(movementType: MovementType) {
        this.movement.type = movementType;
        //reset pohybu pri zmeny nastaveni
        this.movement = {...this.movement, ...Movements[Directions.Up]};
    }

    /**
     * Draws a robot
     * @exports Robot
     * @function draw
     * @returns void
     */
    draw(){
        if (!this.ctx) return;
        this.ctx.drawImage(this.image, this.position.x, this.position.y);
    }
    
    /**
     * Set next random direction when robot colides
     * @exports Robot
     * @function randomMove
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
     * @exports Robot
     * @function rightHandMove
     * @returns void
     */
    rightHandMove() {
        if (this.movement.curDirection === Directions.Up) {
            this.movement = {...this.movement, ...Movements[Directions.Right]};
        } else if (this.movement.curDirection === Directions.Right) {
            this.movement = {...this.movement, ...Movements[Directions.Down]};
        } else if (this.movement.curDirection === Directions.Down) {
            this.movement = {...this.movement, ...Movements[Directions.Left]};
        } else if (this.movement.curDirection === Directions.Left) {
            this.movement = {...this.movement, ...Movements[Directions.Up]};
        }
    }

    /**
     * Turn tobot 90 degrees left when robot colides
     * @exports Robot
     * @function leftHandMove
     * @returns void
     */
    leftHandMove() {
        if (this.movement.curDirection === Directions.Up) {
            this.movement = {...this.movement, ...Movements[Directions.Left]};
        } else if (this.movement.curDirection === Directions.Right) {
            this.movement = {...this.movement, ...Movements[Directions.Up]};
        } else if (this.movement.curDirection === Directions.Down) {
            this.movement = {...this.movement, ...Movements[Directions.Right]};
        } else if (this.movement.curDirection === Directions.Left) {
            this.movement = {...this.movement, ...Movements[Directions.Down]};
        }
    }

    /**
     * Moves with robot
     * @exports Robot
     * @function move
     * @property {Wall[]} walls List of walls
     * @returns Robot
     */
    move(walls : Wall[]) : Robot {
        var newRobot = {...this, position : {x: this.position.x + this.movement.dx, y: this.position.y + this.movement.dy}};
        newRobot.boundingRect = getBoundingRect(newRobot.position, newRobot.size);
        //pokud nastane kolize, tak ho nemenim
        if (walls.some(w => this.isCollision(w,newRobot))){
            console.log(this.movement.type);
            //Urceni noveho pohybu
            if (this.movement.type === MovementType.Random) 
                this.randomMove();
            else if (this.movement.type === MovementType.RightHand) 
                this.rightHandMove();
            else  
                this.leftHandMove();
            return this;
        }
        //pokus nenastane kolize, tak ho menim
        this.position = newRobot.position;
        this.recalculateBoundingRect();
        return this;
    }

    /**
     * Checks if Robot colides with Finish
     * @exports Robot
     * @function isInFinish
     * @property {Graphic[]} finishes List of finishes
     * @returns boolean
     */
    isInFinish(finishes : Graphic[]) : boolean{
        return finishes.some(f => this.isCollision(f));
    }

    /**
     * Checks if Robot colides with graphic
     * @exports Robot
     * @function isCollision
     * @property {Graphic} graphic2 Graphic to check
     * @property {Robot} graphic1 Robot to check
     * @returns boolean
     */
    isCollision(graphic2 : Graphic, graphic1 : Robot = this){
        return !((graphic1.boundingRect.y2 < graphic2.boundingRect.y1) ||
                (graphic1.boundingRect.y1 > graphic2.boundingRect.y2) ||
                (graphic1.boundingRect.x2 < graphic2.boundingRect.x1) ||
                (graphic1.boundingRect.x1 > graphic2.boundingRect.x2));
    }
}