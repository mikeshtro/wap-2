import { useState } from 'react';
import './styles/main.css';
import './styles/button.css'
import { Canvas } from './components/Canvas';
import { SelectBox } from './components/SelectBox';
import { DetailBox } from './components/DetailBox';
import { Size } from './models/IGraphic';
import { PlayBox } from './components/PlayBox';
import { Graphic } from './models/Graphic';
import { OperationType } from './models/enums';
import { Wall } from './models/Wall';


function App() {
    const [status, setStatus] = useState<boolean>(false);
    const [operation, setOperation] = useState<OperationType>(0);
    const [selectedGraphic, setSelectedGraphic] = useState<Graphic | null>(null);
    const [removeTrigger, setRemoveTrigger] = useState<boolean>(false);
    const [redrawTrigger, setRedrawTrigger] = useState<number>(0);
    const [size, setSize] = useState<Size>({width: 10, height: 10});


    function setSelected(graphic:Graphic) {
        setSelectedGraphic(graphic);
        if (graphic instanceof Wall) {
            setSize(graphic.size);
        }
    }

    function updateSize() {
        (selectedGraphic as Wall).setSize(size);
        setRedrawTrigger(redrawTrigger+1);
    }

    function setDefaultSize(operation:OperationType) {
        setOperation(operation);
        if (OperationType.Wall === operation)
            setSize({width:10,height:10});
    }

    return (
        <div>
            <div className="row main">
                <div className="side">
                    <SelectBox
                        operation={operation}
                        setOperation={setDefaultSize}
                        status={status}/>
                </div>
                <div>
                <PlayBox setStatus={setStatus} status={status} operation={operation}/>
                <Canvas
                    operation={operation}
                    callSelected={setSelected}
                    removeTrigger={removeTrigger}
                    redrawTrigger={redrawTrigger}
                    selectedSize={size}
                    status={status}
                    setStatus={setStatus}/>
                
                </div>


                <div className="right-side">
                    <DetailBox
                        operation={operation}
                        selectedGraphic={selectedGraphic}
                        removeClicked={() => setRemoveTrigger(!removeTrigger)}
                        setSize={setSize}
                        saveClicked={updateSize}
                        size={size}/>
                </div>
            </div>
        </div>
    );

}

export default App;
