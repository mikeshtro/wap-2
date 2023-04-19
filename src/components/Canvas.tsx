import React, {useEffect, useState} from 'react';
import { Position, Size } from '../models/IGraphic';
import {  Directions, MovementType, OperationType } from '../models/enums';
import { createBarrier, detectGraphic, drawSelected, redraw } from '../utils/GraphicsLogic';
import { Graphic } from '../models/Graphic';
import {Wall} from '../models/Wall';
import { Finish } from '../models/Finish';
import { Robot } from '../models/Robot';
import { Error, Success, Warning } from '../utils/Messages';
import { isAllDone, simulateStep, someCollision, turning } from '../utils/SimulateLogic';

interface props {
    removeTrigger : boolean,
    operation: OperationType,
    callSelected(graphic : Graphic | null) : void,
    selectedSize: Size,
    status: boolean,
    setStatus(_ : boolean) : void,
    movementType: MovementType
}

export var ctx : CanvasRenderingContext2D;
const ratio = 16/9;
const width = Math.min(1200, window.innerWidth - 30);
export const canvasSize : Size = {width: width, height: width/ratio};
export var graphics : Graphic[] = [];
export function setGraphics(g : Graphic[]){
    graphics = g;
}

const keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]

var playStatus = false;
var dragStartPosition : Position | null = null;
var selectedGraphic : Graphic | null = null;

export const Canvas = ({removeTrigger, operation, callSelected, selectedSize, status, setStatus, movementType} : props) => {
    const [cursor, setCursor] = useState("default");
    const canvas = React.useRef<HTMLCanvasElement | null>(null);     

    const handler = (e: KeyboardEvent) => {
        if (playStatus && keys.some(k => k === e.key)) {
            turning(e.key);
        }
    };

    //On component mounted
    useEffect(() => {
        const _ctx = canvas.current?.getContext('2d');
        if (_ctx){
            ctx = _ctx;
            graphics = createBarrier();
        }
        window.addEventListener('keydown', handler, false);
    }, [canvas])

    
    //Remove 
    useEffect(() => {
        if (!selectedGraphic) return;
        graphics.splice(graphics.indexOf(selectedGraphic), 1);
        redraw();
        selectedGraphic = null;
        callSelected(null);
    // eslint-disable-next-line
    },[removeTrigger]);

    //Simulate
    useEffect(() => {
        playStatus = status;
        if (playStatus){
            unselectGraphic();
            simulate();
        }
    // eslint-disable-next-line
    }, [status])

    //Unselect graphic
    useEffect(() => {
        if (operation !== OperationType.Cursor) unselectGraphic();
    // eslint-disable-next-line
    },[operation])



    async function simulate(){
        if (!correct()) return;
        if (someCollision()){
            Warning('Výchozí pozice robota koliduje se zdí.');
        }
        while (!isAllDone() && playStatus){
            graphics = simulateStep();
            redraw();
            await new Promise(res => setTimeout(res, 25));
        }
        //finished
        if (isAllDone()){
            setStatus(false);
            Success('Všichni roboti dotazili do cíle.')
        }
    }

    function correct() : boolean {
        if (! graphics.some(g => g instanceof Robot)){
            Error('Není vložen žádný robot!');
            setStatus(false);
            return false;
        }
        if (! graphics.some(g => g instanceof Finish)){
            Error('Není vložen žádný cíl!');
            setStatus(false);
            return false;
        }
        return true;
    }

    function getPosition(e : React.MouseEvent) : Position {
        return {x: (e.clientX - (canvas.current?.offsetLeft ?? 0)),y : (e.clientY - (canvas.current?.offsetTop ?? 0))};;
    }

    function onClick(e : React.MouseEvent){
        const position = getPosition(e);
        if (!ctx) return;
        switch (operation){
            case OperationType.Cursor:
                selectGraphic(position);
                break;
            case OperationType.Wall:
                if (selectedSize.height < 10 || selectedSize.width < 10){
                    Error('Zeď musí mít minimální výšku a šířku 10');
                    return;
                } 
                graphics = [...graphics, new Wall(position, selectedSize, ctx)];
                break;
            case OperationType.Finish:
                graphics = [...graphics, new Finish(position, ctx)];
                break;
            default:
                graphics = [...graphics, new Robot(position, ctx, movementType)];
                break;
        }     
    }

    function dragMouseDown(e : React.MouseEvent){
        if(operation !== OperationType.Cursor || !selectedGraphic) return;
        const position = getPosition(e)
        if (detectGraphic(position) === selectedGraphic) {
            dragStartPosition = position;
            setCursor("move");
        }
    }

    function dragMouseUp(e : React.MouseEvent){
        setCursor("default");

        if (!dragStartPosition || !selectedGraphic) return;
        graphics.splice(graphics.indexOf(selectedGraphic), 1);
        const position = getPosition(e);
        const newPosition = {
            x: selectedGraphic.position.x + position.x - dragStartPosition.x, 
            y: selectedGraphic.position.y + position.y - dragStartPosition.y
        };
        selectedGraphic.position = newPosition;
        selectedGraphic.recalculateBoundingRect();
        graphics = [...graphics, selectedGraphic];
        dragStartPosition = null;
    }

    function unselectGraphic(){
        selectedGraphic = null;
        redraw();
        callSelected(null);
    }

    function selectGraphic(position : Position){
        unselectGraphic();
        if (playStatus) return;
        const selected = detectGraphic(position);
        callSelected(selected ?? null);
        if (selected){
            selectedGraphic = selected;
            drawSelected(selectedGraphic);
        }
    }

    return (
        <div>
            <canvas onClick={onClick} onMouseDown={dragMouseDown} onMouseUp={dragMouseUp}
            ref={canvas} height={canvasSize.height} width={canvasSize.width} style={{backgroundColor: 'white', cursor: cursor}}/>
        </div>
    );
}