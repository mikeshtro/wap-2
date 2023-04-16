import { ctx, graphics, setGraphics } from "../components/Canvas";
import { Finish } from "../models/Finish";
import { Graphic } from "../models/Graphic";
import { IGraphicSave } from "../models/IGraphic";
import { Robot } from "../models/Robot";
import { Wall } from "../models/Wall";
import { GraphicType } from "../models/enums";
import { redraw } from "./GraphicsLogic";
import { Error, Success } from "./Messages";

export function saveData(id : number){
    const data : IGraphicSave[] = graphics.map(g => 
        {
            if (g instanceof Wall) {
                return ({type: GraphicType.Wall, size: g.size, position: g.position});
            }
            else if (g instanceof Finish) {
                return ({type: GraphicType.Finish, position: g.position});
            }
            else {
                return ({type: GraphicType.Robot, position: g.position});
            }
        });
    localStorage.setItem(id.toString(), JSON.stringify(data));
    Success('Mapa byla uložena.');
}

export function loadData(id : number){
    const data = localStorage.getItem(id.toString());
    if (!data || data === ""){
        Error('Žádná data nejsou uložena!');
        return;
    }
    const graphicsToSave = JSON.parse(data) as IGraphicSave[];
    var finalData : Graphic[] = [];
    graphicsToSave.forEach(g => {
        switch(g.type){
            case GraphicType.Wall:
                finalData = [...finalData, new Wall(g.position, g.size ?? {width: 10, height: 10}, ctx ?? undefined)];
                break;
            case GraphicType.Finish:
                finalData = [...finalData, new Finish(g.position, ctx)];
                break;
            default:
                finalData = [...finalData, new Robot(g.position, ctx)];
                break;
        }
    })
    setGraphics(finalData);
    redraw();
    Success('Mapa byla načtena.');
}

export function removeData(id : number){
    localStorage.removeItem(id.toString());
    Success("Mapa byla smazána.")
}

export function exist(id : number) : boolean {
    const data = localStorage.getItem(id.toString());
    return (data !== null && data !== "");
}