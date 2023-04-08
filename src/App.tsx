import React, { useState } from 'react';
import './App.css';
import { Canvas } from './components/Canvas';
import { GraphicType } from './Models/IGraphic';

function App() {
    const [remove, setRemove] = useState<boolean>(false)
    const [selected, setSelected] = useState<GraphicType>(0)
    const types : string[] = ["Zeď", "Cíl", "Robot"]

    return (
      <div className="App">
        <Canvas remove={remove} selected={selected}/>
        <button onClick={() => setRemove(!remove)}>{remove? 'Mazání' : 'Přidávání'}</button>

        <div style={{display: 'flex', padding: 10}}>
          {types.map((type, index) => 
            <button key={index} onClick={() => setSelected(index)}
            style={{padding: 20, width: 100, border: 0, backgroundColor: index == selected ? 'white' : 'grey'}}>
              <h3>{type}</h3>
            </button>
          )}
        </div>
      </div>
    );
}

export default App;
