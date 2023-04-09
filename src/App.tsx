import { useState } from 'react';
import './styles/App.css';
import { Canvas } from './components/Canvas';

import { IGraphic } from './models/IGraphic';
import { SelectBox } from './components/SelectBox';
import {MdDelete} from 'react-icons/md'


function App() {

    function graphicToText(graphic : IGraphic | null) : String{
        if (!graphic) return "---";
        switch(graphic.type){
            case 0: return "Zeď";
            case 1 : return "Cíl";
            default: return "Robot";

        }
    }

    function operationToText(operation : Number) : String{
        //0 kurzor
        switch(operation){
            case 1: return "Zeď";
            case 2 : return "Cíl";
            default: return "Robot";
        }
    }

    function operationChanged(operation : number) {
        setOperation(operation);
        setHeight(10);
        setWidth(10);
    }

    const [operation, setOperation] = useState<number>(0);
    const [selectedGraphic, setSelectedGraphic] = useState<IGraphic | null>(null);
    const [removeTrigger, setRemoveTrigger] = useState(0);
    const [width, setWidth] = useState<number>(10);
    const [height, setHeight] = useState<number>(10);

    return (
        <div className="App">
            <SelectBox callSelect={operationChanged}/>
            <Canvas operation={operation} callSelected={setSelectedGraphic} removeTrigger={removeTrigger} selectedOptionWidth={width} selectedOptionHeight={height} />
            {operation === 0?
                <div className="right">
                <h3 className={selectedGraphic ? "headerPrim" : "header"}>Označeno: {graphicToText(selectedGraphic)}</h3>
                <button className="dltButton"
                    onClick={() => { setRemoveTrigger((trigger) => trigger + 1); }} 
                    disabled={!selectedGraphic}
                    >
                    <div className="row"><h3>Smazat</h3><MdDelete size={25}/></div>
                    </button>
                </div>:
                <div className="right">
                <h3 className= "headerPrim">Vytváříte: {operationToText(operation)}</h3>
                {operation === 1?
                    <div>
                        <label className="right"> Šířka:
                            <input value={width} min={10} max={100} type="number" onChange={(event)=>setWidth(Number(event.target.value))}></input>
                        </label>
                        <label className="right"> Výška:
                            <input value={height} min={10} max={1300} type="number" onChange={(event)=>setHeight(Number(event.target.value))}></input>
                        </label>
                    </div>:
                    null
                }
                </div>
            }
        </div>
    );
}

export default App;
