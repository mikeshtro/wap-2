import { getBoundingRect } from "../utils/GraphicsLogic";
import { Graphic } from "./Graphic";
import { Position } from "./IGraphic";
import { Wall } from "./Wall";
import { Directions, GraphicType, MovementType } from "./enums";

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
 * Class description
 * @category Models
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

    setDirection(direction: Directions) {
        this.movement.curDirection = direction;
        this.movement = {...this.movement, ...Movements[direction]};
    }

    setMovementType(movementType: MovementType) {
        this.movement.type = movementType;
        //reset pohybu pri zmeny nastaveni
        this.movement = {...this.movement, ...Movements[Directions.Up]};
    }

    draw(){
        if (!this.ctx) return;
        this.ctx.drawImage(this.image, this.position.x, this.position.y);
    }
    
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

    isInFinish(finishes : Graphic[]){
        return finishes.some(f => this.isCollision(f));
    }

    isCollision(graphic2 : Graphic, graphic1 : Robot = this){
        return !((graphic1.boundingRect.y2 < graphic2.boundingRect.y1) ||
                (graphic1.boundingRect.y1 > graphic2.boundingRect.y2) ||
                (graphic1.boundingRect.x2 < graphic2.boundingRect.x1) ||
                (graphic1.boundingRect.x1 > graphic2.boundingRect.x2));
    }
}