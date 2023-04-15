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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Wall } from './models/Wall';
import { Error } from './utils/Messages';
import { drawSelected, redraw } from './utils/GraphicsLogic';
import { MapSaver } from './components/MapSaver';


function App() {
    const [status, setStatus] = useState<boolean>(false);
    const [operation, setOperation] = useState<OperationType>(0);
    const [selectedGraphic, setSelectedGraphic] = useState<Graphic | null>(null);
    const [removeTrigger, setRemoveTrigger] = useState<boolean>(false);
    const [size, setSize] = useState<Size>({width: 10, height: 10});

    function setSelected(graphic:Graphic) {
        setSelectedGraphic(graphic);
        if (graphic instanceof Wall) {
            setSize(graphic.size);
        }
    }

    function updateSize() {
        if (size.height < 10 || size.width < 10){
            Error('Zeď musí mít minimální výšku a šířku 10');
            return;
        }
        if (selectedGraphic){
            (selectedGraphic as Wall).setSize(size);
            redraw();
            drawSelected(selectedGraphic);
        }
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
                    selectedSize={size}
                    status={status}
                    setStatus={setStatus}/>
                <MapSaver/>
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
            <ToastContainer/>
        </div>
    );

}

export default App;
