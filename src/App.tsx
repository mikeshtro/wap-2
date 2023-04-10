import { useState } from 'react';
import './styles/App.css';
import { Canvas } from './components/Canvas';
import { SelectBox } from './components/SelectBox';
import { DetailBox } from './components/DetailBox';
import { IGraphic, Size } from './models/IGraphic';
import { PlayBox } from './components/PlayBox';


function App() {

    function operationChanged(operation: number) {
        setOperation(operation);
        switch (operation) {
            case 1:
                setSize({width: 10, height: 10})
                break;
            default:
                setSize({width: 32, height: 32})
                break;
        }

    }

    const [status, setStatus] = useState<boolean>(false);
    const [operation, setOperation] = useState<number>(0);
    const [selectedGraphic, setSelectedGraphic] = useState<IGraphic | null>(null);
    const [removeTrigger, setRemoveTrigger] = useState<boolean>(false);
    const [size, setSize] = useState<Size>({width: 10, height: 10});

    return (
        <div>
            <PlayBox setStatus={setStatus} status={status}/>
            <div className="row">
                <SelectBox
                    callSelect={operationChanged} />
                <Canvas
                    operation={operation}
                    callSelected={setSelectedGraphic}
                    removeTrigger={removeTrigger}
                    selectedSize={size}
                    status={status}/>
                <DetailBox
                    operation={operation}
                    selectedGraphic={selectedGraphic}
                    removeClicked={() => setRemoveTrigger(!removeTrigger)}
                    setSize={setSize}
                    size={size}/>
            </div>
        </div>
    );

}

export default App;
