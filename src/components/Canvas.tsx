import React, {useState} from 'react';
import { GraphicType, IGraphic } from '../Models/IGraphic';

interface props {
    remove : boolean,
    selected: OperationType,
}

interface position {
    x: number,
    y: number
}

export enum OperationType {
    Cursor,
    Wall,
    Finish,
    Robot
}

export const Canvas = ({remove, selected} : props) => {
    const [graphics, setGraphics] = useState<IGraphic[]>([])
    const [cursor, setCursor] = useState("default")
    const [startPosition, setStartPosition] = useState<position | null>(null)
    const [selectedGraphic, setSelectedGraphic] = useState<IGraphic | null>(null)

    const canvas = React.useRef<HTMLCanvasElement | null>(null);  
     
    function onClick(e : React.MouseEvent){
        if (remove){
            const clicked = detectGraphic(e.clientX, e.clientY)
            if (clicked){
                graphics.splice(graphics.indexOf(clicked), 1)
                removeGraphic(clicked)
            }
        }
        if (selected != 0) {
        const width : number = 20
        const height: number = 50
        const graphic : IGraphic = {
            x: e.clientX, 
            y: e.clientY, 
            width: width, 
            height: height, 
            type: selected - 1, 
            boundingRect : {x1: e.clientX, x2: e.clientX + width, y1: e.clientY, y2: e.clientY + height}}
        addGraphic(graphic)
        }       
    }

    function detectGraphic(x: number, y: number) : IGraphic | undefined {
        return graphics.find(g => 
            (g.boundingRect.x1 <= x && x <= g.boundingRect.x2) && 
            (g.boundingRect.y1 <= y && y <= g.boundingRect.y2))
    }

    function removeGraphic(graphic : IGraphic){
        if (canvas.current){
            const context = canvas.current.getContext('2d');
            context?.clearRect(graphic.x, graphic.y, graphic.width, graphic.height)
        }
    }

    function addGraphic(graphic : IGraphic){
        setGraphics([...graphics, graphic])
        drawGraphic(graphic)
    }

    function drawGraphic(graphic: IGraphic){
        if (canvas.current){
            const context = canvas.current.getContext('2d');
            if (!context) return
            switch(graphic.type){
                case GraphicType.Wall:
                    context.fillStyle = "grey"
                    break
                case GraphicType.Finish:
                    context.fillStyle = "green"
                    break
                default:
                    context.fillStyle = "red"
                    break
            }
            context.fillRect(graphic.x, graphic.y, graphic.width, graphic.height)
        }
    }

    function dragMouseDown(e : React.MouseEvent){
        if(selected != OperationType.Cursor) return
        const clicked = detectGraphic(e.clientX, e.clientY)
        if (clicked) {
            setStartPosition({x: e.clientX, y: e.clientY})
            setSelectedGraphic(clicked)
            setCursor("move")
        }
    }

    function dragUpDown(e : React.MouseEvent){
        console.log(e)
        if (startPosition && selectedGraphic){
            const newX = selectedGraphic.x + e.clientX - startPosition.x 
            const newY = selectedGraphic.y + e.clientY - startPosition.y

            //Remove at old position
            graphics.splice(graphics.indexOf(selectedGraphic), 1)
            removeGraphic(selectedGraphic)

            //Add to new position
            addGraphic({
                ...selectedGraphic, 
                x: newX, 
                y: newY, 
                boundingRect: {x1: newX, x2: newX + selectedGraphic.width, y1: newY, y2: newY + selectedGraphic.height}, })
            setSelectedGraphic(null)
            setStartPosition(null)
        }
        setCursor("default")
    }
  
    return (
        <canvas onClick={onClick} onMouseDown={dragMouseDown} onMouseUp={dragUpDown}
        ref={canvas} height={600} width={1200} style={{backgroundColor: 'white', cursor: cursor}}
        />
    );
};