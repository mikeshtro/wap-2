import React, { useState } from 'react';
import './App.css';
import { Canvas, OperationType } from './components/Canvas';
import { GraphicType } from './Models/IGraphic';
import {GiBrickWall, GiArrowCursor, GiFinishLine} from 'react-icons/gi'
import {FaRobot} from 'react-icons/fa'

function App() {
    const [remove, setRemove] = useState<boolean>(false)
    const [selected, setSelected] = useState<OperationType>(0)
    const types : string[] = ["Kurzor","Zeď", "Cíl", "Robot"]

    return (
      <div className="App">
        <Canvas remove={remove} selected={selected}/>
        <button onClick={() => setRemove(!remove)}>{remove? 'Mazání' : 'Přidávání'}</button>

        <div style={{display: 'flex', padding: 10}}>
          {types.map((type, index) => 
            <button key={index} onClick={() => setSelected(index)}
            style={{padding: 20, width: 100, border: 0, backgroundColor: index == selected ? 'white' : 'grey'}}>
              <div>
              { index == 0 ? <GiArrowCursor size={30}/> : index == 1 ? <GiBrickWall size={30}/> : index == 2 ? <GiFinishLine size={30}/> : <FaRobot size={30}/>}
              <h3>{type}</h3>
              </div>
            </button>
          )}
        </div>
      </div>
    );
}

export default App;
