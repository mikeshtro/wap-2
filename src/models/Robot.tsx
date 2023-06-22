import { getBoundingRect } from "../utils/Rectangle";
import { Graphic } from "./Graphic";
import { Position } from "./IGraphic";
import { Wall } from "./Wall";
import { Directions, GraphicType, MovementType } from "./enums";

/**
 * Rozhraní jednotlivých vstupů a výstupů modelu Robot
 * @category Models
 */
interface Movement {
    /**
     * Input - Druh pohybu
     */
    type: MovementType,
    /**
     * Input - Aktuální směr pohybu
     */
    curDirection: Directions,
    /**
     * Input - Posun v ose x
     */
    dx: number,
    /**
     * Input - Posun v ose y
     */
    dy: number
}

const Movements = {
    [Directions.Up] : {curDirection: Directions.Up, dx: 0, dy: -2},
    [Directions.Right]: {curDirection: Directions.Right, dx: 2, dy: 0},
    [Directions.Down]: {curDirection: Directions.Down, dx: 0, dy: 2},
    [Directions.Left]: {curDirection: Directions.Left, dx: -2, dy: 0}
}

export class Robot extends Graphic {
    image : HTMLImageElement | undefined;
    movement : Movement;

    /**
     * Vytvoří grafiku, které nastaví výchozí hodnoty velikosti a přednačte si obrázek, který zobrazuje robota. Následně grafiku i vykreslí
     * @constructs
     * @param position {Position} Pozice kam vložit grafiku
     * @param moveType {MovementType} Způsb pohybu robota
     * 
     * @category Models
     * @extends Graphic
     * @classdesc Grafika znázorňující cíl
     * 
     * @property {HTMLImageElement} image Obrázek robota
     * @property {Movement} movement Druh pohybu
     */
    constructor(position : Position, moveType : MovementType = MovementType.Random){
        super(position, {width: 32, height: 32}, GraphicType.Robot);

        this.movement = {type: moveType, ...Movements[Directions.Up]};
    }

    /**
     * Nastaví druh pohybu robota
     * @param {MovementType} movementType Druh pohybu robota
     * @returns {void}
     */
    setMovementType(movementType: MovementType) {
        this.movement.type = movementType;
        //reset pohybu pri zmeny nastaveni
        this.movement = {...this.movement, ...Movements[Directions.Up]};
    }

    /**
     * Nakreslí robota na plátno
     * @param ctx {CanvasRenderingContext2D} Kontext plátna pro vykreslení
     * @returns {void}
     */
    draw(ctx: CanvasRenderingContext2D){
        if (this.image == null) {
            const image = new Image();
            image.src = "/assets/robot.png";
            image.onload = () => {
                ctx.drawImage(image, this.position.x, this.position.y);
            }
            this.image = image;
        } else {
            ctx.drawImage(this.image, this.position.x, this.position.y);
        }
    }
    
    /**
     * Nastaví náhodně nový směr pohybu
     * @returns {void}
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
     * Otočí robota o 90 stupňů doprava
     * @returns {void}
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
     * Otočí robota o 90 stupňů doleva
     * @returns {void}
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

    /**
     * Posune robota správným směrem, který byl dříve nastaven
     * @returns {void}
     */
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
     * Provede posun daného robota podle jeho směru pohybu, v případě kolize změní směr dle vybrané strategie
     * @param {Wall[]} walls Seznam zdí na mapě
     * @returns {Robot} Robot s novou pozicí
     */
    move(walls : Wall[]) : Robot {
        console.log(this.movement.dx, this.movement.dy);
        let newRobot = {...this, position : {x: this.position.x + this.movement.dx, y: this.position.y + this.movement.dy}};
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
     * Nastaví nový směr robota
     * @param {Directions} direction Nový směr 
     * @returns {void}
     */
    setDirection(direction: Directions) {
        this.movement.curDirection = direction;
        this.movement = {...this.movement, ...Movements[direction]};
    }

    /**
     * Kontroluje, zda robot dorazil do cíle
     * @param {Graphic[]} finishes Seznam cílů na mapě
     * @returns {boolean} True pokud je v cíli
     */
    isInFinish(finishes : Graphic[]) : boolean{
        return finishes.some(f => this.isCollision(f));
    }

    /**
     * Kontroluje zda robot nenarazil do překážky
     * @param {Graphic} graphic2 Grafika pro porovnání
     * @param {Robot} graphic1 Zkoumaný robot
     * @returns {boolean} True pokud narazil
     */
    isCollision(graphic2 : Graphic, graphic1 : Robot = this){
        return !((graphic1.boundingRect.y2 < graphic2.boundingRect.y1) ||
                (graphic1.boundingRect.y1 > graphic2.boundingRect.y2) ||
                (graphic1.boundingRect.x2 < graphic2.boundingRect.x1) ||
                (graphic1.boundingRect.x1 > graphic2.boundingRect.x2));
    }
}