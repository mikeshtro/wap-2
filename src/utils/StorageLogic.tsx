/**
 * Obsahuje veškerou logiku ukládání map
 * @module StorageLogic
 * @category Utils
 */


import { Finish } from "../models/Finish";
import { Graphic } from "../models/Graphic";
import { IGraphicSave } from "../models/IGraphic";
import { Robot } from "../models/Robot";
import { Wall } from "../models/Wall";
import { GraphicType } from "../models/enums";
import { Error, Success } from "./Messages";

/**
 * Uloží veškerá data o mapě do slotu podle parametru
 * @category Utils
 * @param id {number} Číslo slotu
 * @param graphics {Graphic[]} Seznam grafik k uložení
 */
export function saveData(id : number, graphics: Graphic[]){
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
 * @returns Seznam načtených grafik
 */
export function loadData(id : number): Graphic[] | undefined {
    const data = localStorage.getItem(id.toString());
    if (!data || data === ""){
        Error('Žádná data nejsou uložena!');
        return undefined;
    }
    const graphicsToSave = JSON.parse(data) as IGraphicSave[];
    let finalData : Graphic[] = [];
    graphicsToSave.forEach(g => {
        switch(g.type){
            case GraphicType.Wall:
                finalData = [...finalData, new Wall(g.position, g.size ?? {width: 10, height: 10})];
                break;
            case GraphicType.Finish:
                finalData = [...finalData, new Finish(g.position)];
                break;
            default:
                finalData = [...finalData, new Robot(g.position, g.movementType)];
                break;
        }
    })
    Success('Mapa byla načtena.');
    return finalData;
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