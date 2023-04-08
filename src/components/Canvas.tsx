import React, {useState} from 'react';
import { GraphicType, IGraphic } from '../Models/IGraphic';

interface props {
    remove : boolean,
    selected: GraphicType
}

export const Canvas = ({remove, selected} : props) => {
    const [graphics, setGraphics] = useState<IGraphic[]>([])

    const canvas = React.useRef<HTMLCanvasElement | null>(null);  
  
    function onClick(e : React.MouseEvent){
        if (remove){
            console.log(graphics)
            console.log(e.clientX, e.clientY)
            const clicked = graphics.find(g => 
                (g.boundingRect.x1 <= e.clientX && e.clientX <= g.boundingRect.x2) && 
                (g.boundingRect.y1 <= e.clientY && e.clientY <= g.boundingRect.y2))
            console.log(clicked)
            if (clicked){
                graphics.splice(graphics.indexOf(clicked), 1)
                removeGraphic(clicked)
            }
        }
        else {
        const width : number = 20
        const height: number = 50
        const graphic : IGraphic = {
            x: e.clientX, 
            y: e.clientY, 
            width: width, 
            height: height, 
            type: selected, 
            boundingRect : {x1: e.clientX, x2: e.clientX + width, y1: e.clientY, y2: e.clientY + height}}
        addGraphic(graphic)
        }       
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
  
    return (
        <canvas onClick={onClick}
        ref={canvas} height={600} width={1200} style={{backgroundColor: 'white'}}
        />
    );
};