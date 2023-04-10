import React, {useEffect, useState} from 'react';
import {IGraphic, Position, Size } from '../models/IGraphic';
import { GraphicType, OperationType } from '../models/enums';
import { detectGraphic, isAllDone, simulateStep } from '../utils/GraphicsLogic';

interface props {
    removeTrigger : boolean,
    operation: OperationType,
    callSelected(graphic : IGraphic | null) : void,
    selectedSize: Size,
    status: boolean,
}

var globalStatus = false;
var graphics : IGraphic[] = [];

export const Canvas = ({removeTrigger, operation, callSelected, selectedSize, status} : props) => {
    const [cursor, setCursor] = useState("default");
    const [position, setPosition] = useState<Position | null>(null);
    const [selectedGraphic, setSelectedGraphic] = useState<IGraphic | null>(null);

    const canvas = React.useRef<HTMLCanvasElement | null>(null);  
    const ctx = canvas.current?.getContext('2d');

    
     
    useEffect(() => {
        removeGraphic();
    },[removeTrigger]);

    useEffect(() => {
        async function play() {
            var data = graphics;
            while (!isAllDone(data) && globalStatus){
                data = simulateStep(data);
                redraw1(data);
                await new Promise(res => setTimeout(res, 200));
            }
            graphics = data;
        }
        globalStatus = status;
        if (globalStatus)
            play();
    }, [status])

    function onClick(e : React.MouseEvent){
        const x = e.clientX - (canvas.current?.offsetLeft ?? 0);
        const y = e.clientY - (canvas.current?.offsetTop ?? 0);
        if (operation === OperationType.Cursor){
            selectGraphic(x, y);
        }
        if (operation !== 0) {
            if (selectedSize.height < 10 || selectedSize.width < 10) return;
            addGraphic({
                x: x, 
                y: y, 
                width: selectedSize.width, 
                height: selectedSize.height, 
                type: operation - 1, 
                boundingRect : {x1: x, x2: x + selectedSize.width, y1: y, y2: y + selectedSize.height}
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
        graphics = [...graphics, graphic];
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

    function redraw1(graphics : IGraphic[]){
        if (ctx){
            ctx.clearRect(0,0,canvas?.current?.width ?? 0, canvas?.current?.height ?? 0)
            graphics.forEach(drawGraphic)
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
                ctx.fillStyle = "#202124";
                ctx.fillRect(graphic.x, graphic.y, graphic.width, graphic.height);
                break
            case GraphicType.Finish:
                const finish = new Image();
                finish.src = "/assets/finish.png";
                finish.onload = function () {ctx.drawImage(finish, graphic.x, graphic.y);};
                break
            default:
                const robot = new Image();
                robot.src = "/assets/robot.png";
                robot.onload = function () {ctx.drawImage(robot, graphic.x, graphic.y);};
                break
        }
        
    }

    return (
        <canvas onClick={onClick} onMouseDown={dragMouseDown} onMouseUp={dragMouseUp}
        ref={canvas} height={600} width={1200} style={{backgroundColor: 'white', cursor: cursor}}
        />
    );
};