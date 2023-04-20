/**
 * Obsahuje veškerou logiku ukládání map
 * @module StorageLogic
 * @category Utils
 */


import { ctx, graphics, setGraphics } from "../components/Canvas";
import { Finish } from "../models/Finish";
import { Graphic } from "../models/Graphic";
import { IGraphicSave } from "../models/IGraphic";
import { Robot } from "../models/Robot";
import { Wall } from "../models/Wall";
import { GraphicType } from "../models/enums";
import { redraw } from "./GraphicsLogic";
import { Error, Success } from "./Messages";

/**
 * Uloží veškerá data o mapě do slotu podle parametru
 * @category Utils
 * @param id {number} Číslo slotu
 */
export function saveData(id : number){
    const data : IGraphicSave[] = graphics.filter(g => g.type !== GraphicType.Selected).map(g => 
        {
            if (g instanceof Wall) {
                return ({type: GraphicType.Wall, size: g.size, position: g.position});
            }
            else if (g instanceof Finish) {
                return ({type: GraphicType.Finish, position: g.position});
            }
            else {
                return ({type: GraphicType.Robot, position: g.position, movementType: (g as Robot).movement.type});
            }
        });
    localStorage.setItem(id.toString(), JSON.stringify(data));
    Success('Mapa byla uložena.');
}

/**
 * Načte veškerá data o mapě ze slotu podle parametru
 * @category Utils
 * @param id {number} Číslo slotu
 */
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
                finalData = [...finalData, new Robot(g.position, ctx, g.movementType)];
                break;
        }
    })
    setGraphics(finalData);
    redraw();
    Success('Mapa byla načtena.');
}

/**
 * Smaže veškerá data o mapě ze slotu podle parametru
 * @category Utils
 * @param id {number} Číslo slotu
 */
export function removeData(id : number){
    localStorage.removeItem(id.toString());
    Success("Mapa byla smazána.")
}

/**
 * Zjistí zda existují data ve slotu podle parametru
 * @category Utils
 * @param id {number} Číslo slotu
 * @returns {boolean} True pokud je v tomto slotu něco uloženo
 */
export function exist(id : number) : boolean {
    const data = localStorage.getItem(id.toString());
    return (data !== null && data !== "");
}