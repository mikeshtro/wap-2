import { MdDelete } from 'react-icons/md'
import { Size } from '../models/IGraphic';
import { Graphic } from '../models/Graphic';
import { Wall } from '../models/Wall';
import { Finish } from '../models/Finish';
import { EditBox } from './EditBox';
import { FaSave } from 'react-icons/fa';

interface props {
    operation: number,
    selectedGraphic: Graphic | null,
    removeClicked(): void,
    saveClicked(): void,
    setSize(_: Size): void,
    size: Size
}

export const DetailBox = ({ operation, selectedGraphic, removeClicked, saveClicked,setSize, size }: props) => {
    function graphicToText(graphic: Graphic | null): String {
        if (!graphic) return "---";
        switch (graphic.constructor) {
            case Wall: return "Zeď";
            case Finish: return "Cíl";
            default: return "Robot";
        }
    }

    function operationToText(operation: Number): String {
        //0 kurzor
        switch (operation) {
            case 1: return "Zeď";
            case 2: return "Cíl";
            default: return "Robot";
        }
    }

    return (
        <div className="card">
                {
                operation === 0 ?
                    <div>
                        <h3 className={selectedGraphic ? "headerPrim" : "header"}>
                            Označeno: {graphicToText(selectedGraphic)}
                        </h3>
                        <button className="dltButton" onClick={removeClicked} disabled={!selectedGraphic}>
                            <div className="row horizontal-center center">
                                <h3>Smazat</h3>
                                <MdDelete size={25}/>
                                </div>
                        </button>
                        {
                            selectedGraphic instanceof Wall ? 
                            <div>
                                <EditBox
                                    size={size}
                                    setSize={setSize}
                                /> 

                                <button className="dltButton" onClick={saveClicked} disabled={!selectedGraphic}>
                                    <div className="row horizontal-center center">
                                        <h3>Uložit</h3>
                                        <FaSave size={25}/>
                                        </div>
                                </button>
                            </div>
                            : null

                        }
                    </div> 
                    :
                    <div>
                        <h3 className="headerPrim">Vytváříte: {operationToText(operation)}</h3>
                        {
                        operation === 1 ?
                            <EditBox
                                size={size}
                                setSize={setSize}
                            /> : null
                        }
                    </div>
                }
        </div>
    )
}