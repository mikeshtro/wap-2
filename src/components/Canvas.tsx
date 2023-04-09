import React, {useEffect, useState} from 'react';
import {IGraphic, Position } from '../models/IGraphic';
import { GraphicType, OperationType } from '../models/enums';
import { detectGraphic } from '../utils/GraphicsLogic';

interface props {
    removeTrigger : number,
    operation: OperationType,
    callSelected(graphic : IGraphic | null) : void,
    selectedOptionWidth : number,
    selectedOptionHeight : number
}

export const Canvas = ({removeTrigger, operation, callSelected, selectedOptionWidth, selectedOptionHeight} : props) => {
    const [graphics, setGraphics] = useState<IGraphic[]>([]);
    const [cursor, setCursor] = useState("default");
    const [position, setPosition] = useState<Position | null>(null);
    const [selectedGraphic, setSelectedGraphic] = useState<IGraphic | null>(null);

    const canvas = React.useRef<HTMLCanvasElement | null>(null);  
    const ctx = canvas.current?.getContext('2d');
     
    useEffect(() => {
        if (removeTrigger){
            removeGraphic();
        }
    },[removeTrigger]);


    function onClick(e : React.MouseEvent){
        const x = e.clientX - (canvas.current?.offsetLeft ?? 0);
        const y = e.clientY - (canvas.current?.offsetTop ?? 0);
        if (operation === OperationType.Cursor){
            selectGraphic(x, y);
        }
        if (operation !== 0) {
            if (selectedOptionHeight < 10 || selectedOptionWidth < 10) return;
            addGraphic({
                x: x, 
                y: y, 
                width: selectedOptionWidth, 
                height: selectedOptionHeight, 
                type: operation - 1, 
                boundingRect : {x1: x, x2: x + selectedOptionWidth, y1: y, y2: y + selectedOptionHeight}
            });
        }       
    }

    function dragMouseDown(e : React.MouseEvent){
        if(operation !== OperationType.Cursor || !selectedGraphic) return;

        const x = e.clientX - (canvas.current?.offsetLeft ?? 0);
        const y = e.clientY - (canvas.current?.offsetTop ?? 0);
        if (detectGraphic(graphics, x, y) === selectedGraphic) {
            setPosition({x, y});
            setCursor("move");
        }
    }

    function dragMouseUp(e : React.MouseEvent){
        setCursor("default");

        if (!position || !selectedGraphic) return;

        const newX = selectedGraphic.x + e.clientX - (canvas.current?.offsetLeft ?? 0)- position.x ;
        const newY = selectedGraphic.y + e.clientY - (canvas.current?.offsetTop ?? 0) - position.y;

        graphics.splice(graphics.indexOf(selectedGraphic), 1);
        addGraphic({
            ...selectedGraphic, 
            x: newX, 
            y: newY, 
            boundingRect: {x1: newX, x2: newX + selectedGraphic.width, y1: newY, y2: newY + selectedGraphic.height}
        });
        setPosition(null);
    }

    function addGraphic(graphic : IGraphic){
        setGraphics([...graphics, graphic])
        drawGraphic(graphic)
    }

    function removeGraphic(){
        if (!selectedGraphic) return;
        graphics.splice(graphics.indexOf(selectedGraphic), 1);
        redraw();
        setSelectedGraphic(null);
        callSelected(null);
    };

    function selectGraphic(x : number, y : number){
        setSelectedGraphic(null);
        redraw();
        const selected = detectGraphic(graphics, x, y);
        callSelected(selected ?? null);
        if (selected){
            setSelectedGraphic(selected);
            drawSelected(selected);
        }
    }

    function redraw(){
        if (ctx){
            ctx.clearRect(0,0,canvas?.current?.width ?? 0, canvas?.current?.height ?? 0)
            graphics.forEach(drawGraphic)
        }
    }

    function drawSelected(selected : IGraphic){
        if (ctx){
            ctx.setLineDash([6]);
            ctx.lineWidth = 2;
            ctx.strokeStyle = "red";
            ctx.strokeRect(selected.x, selected.y, selected.width, selected.height);
            ctx.lineWidth = 1;
        }
    }

    function drawGraphic(graphic: IGraphic){
        if (!ctx) return
        switch(graphic.type){
            case GraphicType.Wall:
                ctx.fillStyle = "grey"
                break
            case GraphicType.Finish:
                ctx.fillStyle = "green"
                break
            default:
                ctx.fillStyle = "red"
                break
        }
        ctx.fillRect(graphic.x, graphic.y, graphic.width, graphic.height)
    }

    return (
        <canvas onClick={onClick} onMouseDown={dragMouseDown} onMouseUp={dragMouseUp}
        ref={canvas} height={600} width={1200} style={{backgroundColor: 'white', cursor: cursor}}
        />
    );
};