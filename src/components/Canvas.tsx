import React, {useEffect, useState} from 'react';
import { Position, Size } from '../models/IGraphic';
import {  OperationType } from '../models/enums';
import { detectGraphic, isAllDone, simulateStep } from '../utils/GraphicsLogic';
import { Graphic } from '../models/Graphic';
import {Wall} from '../models/Wall';
import { Finish } from '../models/Finish';
import { Robot } from '../models/Robot';
import { Selected } from '../models/Selected';

interface props {
    removeTrigger : boolean,
    operation: OperationType,
    callSelected(graphic : Graphic | null) : void,
    selectedSize: Size,
    status: boolean,
    setStatus(_ : boolean) : void
}

var playStatus = false;
var dragStartPosition : Position | null = null;
var graphics : Graphic[] = [];
var selectedGraphic : Graphic | null = null;

export const Canvas = ({removeTrigger, operation, callSelected, selectedSize, status, setStatus} : props) => {
    const [cursor, setCursor] = useState("default");

    const canvas = React.useRef<HTMLCanvasElement | null>(null);  
    const ctx = canvas.current?.getContext('2d');

    //Remove 
    useEffect(() => {
        if (!selectedGraphic) return;
        graphics.splice(graphics.indexOf(selectedGraphic), 1);
        redraw(graphics);
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
        if (operation !== OperationType.Cursor){
            unselectGraphic();
        }
    // eslint-disable-next-line
    },[operation])

    async function simulate(){
        var data = graphics;
        while (!isAllDone(data) && playStatus){
            data = simulateStep(data);
            redraw(data);
            await new Promise(res => setTimeout(res, 25));
        }
        graphics = data;
        //finished
        if (isAllDone(data)){
            setStatus(false);
        }
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
                if (selectedSize.height < 10 || selectedSize.width < 10) return;
                graphics = [...graphics, new Wall(position, selectedSize, ctx)];
                break;
            case OperationType.Finish:
                graphics = [...graphics, new Finish(position, ctx)];
                break;
            default:
                graphics = [...graphics, new Robot(position, ctx)];
                break;
        }     
    }

    function dragMouseDown(e : React.MouseEvent){
        if(operation !== OperationType.Cursor || !selectedGraphic) return;
        const position = getPosition(e)
        if (detectGraphic(graphics, position) === selectedGraphic) {
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
        redraw(graphics);
        callSelected(null);
    }

    function selectGraphic(position : Position){
        unselectGraphic();
        const selected = detectGraphic(graphics, position);
        callSelected(selected ?? null);
        if (selected){
            selectedGraphic = selected;
            if (ctx)
                new Selected(selected.position, selected.size, ctx);
        }
    }

    function redraw(graphics : Graphic[]){
        if (ctx){
            ctx.clearRect(0,0,canvas?.current?.width ?? 0, canvas?.current?.height ?? 0)
            graphics.forEach(g => g.draw(ctx))
        }
    }

    return (
        <canvas onClick={onClick} onMouseDown={dragMouseDown} onMouseUp={dragMouseUp}
        ref={canvas} height={700} width={1100} style={{backgroundColor: 'white', cursor: cursor}}
        />
    );
};