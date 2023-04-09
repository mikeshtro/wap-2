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

    const [operation, setOperation] = useState<number>(0);
    const [selectedGraphic, setSelectedGraphic] = useState<IGraphic | null>(null);
    const [removeTrigger, setRemoveTrigger] = useState(0);

    return (
        <div className="App">
            <SelectBox callSelect={setOperation}/>
            <Canvas operation={operation} callSelected={setSelectedGraphic} removeTrigger={removeTrigger} />
            <div className="right">
                <h3 className={selectedGraphic ? "headerPrim" : "header"}>Označeno: {graphicToText(selectedGraphic)}</h3>
                <button className="dltButton"
                    onClick={() => { setRemoveTrigger((trigger) => trigger + 1); }} 
                    disabled={!selectedGraphic}
                    >
                    <div className="row"><h3>Smazat</h3><MdDelete size={25}/></div>
                    </button>
            </div>
        </div>
    );
}

export default App;
