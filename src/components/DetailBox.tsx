import { MdDelete } from 'react-icons/md'
import { Size } from '../models/IGraphic';
import { Graphic } from '../models/Graphic';
import { Wall } from '../models/Wall';
import { Finish } from '../models/Finish';

interface props {
    operation: number,
    selectedGraphic: Graphic | null,
    removeClicked(): void,
    setSize(_: Size): void,
    size: Size
}

export const DetailBox = ({ operation, selectedGraphic, removeClicked, setSize, size }: props) => {
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
        <div className="card right">
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
                    </div> 
                    :
                    <div>
                        <h3 className="headerPrim">Vytváříte: {operationToText(operation)}</h3>
                        {
                        operation === 1 ?
                            <div className='column'>
                                <div className='row horizontal-center'>
                                    <label className='input-text'>Šířka:</label>
                                    <input className='input' value={size.width} min={10} max={100} type="number"
                                        onChange={(event) =>
                                            setSize({ width: Number(event.target.value), height: size.height })
                                        } />
                                </div>
                                <div className='row horizontal-center'>
                                    <label className='input-text'>Výška:</label>
                                    <input className='input' value={size.height} min={10} max={1300} type="number"
                                        onChange={(event) =>
                                            setSize({ width: size.width, height: Number(event.target.value) })
                                        } />
                                </div>
                            </div> :
                            null
                        }
                    </div>
                }
        </div>
    )
}