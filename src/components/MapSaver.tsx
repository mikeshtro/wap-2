import { useState, useEffect } from 'react';
import { exist, loadData, removeData, saveData } from "../utils/StorageLogic"
import { FaMapMarkedAlt } from 'react-icons/fa';
import { Button, ButtonGroup, Card, Modal } from 'react-bootstrap';

interface props {
    loaded() : void;
}

const ids = [1,2,3,4,5];

/**
 * Class description
 * @category Component
 * @module MapSaver
 */
export const MapSaver = ({loaded} : props) => {
    const [visible, setVisible] = useState<boolean>(false);
    const [exists, setExists] = useState<boolean[]>([false,false,false,false,false]);

    useEffect(() => {
        getOccupied();
    // eslint-disable-next-line
    }, [])

    function getOccupied(){
        setExists(exists.map((_, i) => exist(i + 1)));
    }
    
    function saveMap(index : number){
        saveData(index);
        getOccupied();
    }

    function loadMap(index : number){
        loadData(index);
        setVisible(false);
        loaded();
    }

    function removeMap(index: number){
        removeData(index);
        getOccupied();
    }

    return (
        <div>

            <Button variant={visible ? 'primary' : 'secondary'} onClick={() => setVisible(!visible)}>
                <div>
                    <FaMapMarkedAlt size={30}/>
                    <h5>Zobrazit mapy</h5>
                </div>
            </Button>
        {
            visible ? 
            <Modal className="myModal" show={visible} onHide={() => setVisible(false)}>
                <Modal.Header>
                    <Modal.Title>
                        Zobrazit mapy
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                        <div className="maps row">
                    {
                        ids.map((number, i) => 
                            <Card key={i} className="myCard margin-top">
                                <h4 className="mapsText">Mapa č. {number}: {exists[i] ? "Uložená" : "Prázdná"}</h4> 
                                <ButtonGroup className='margin-bottom'>
                                    <Button variant="success" onClick={() => saveMap(number)} disabled={exists[i]}>Uložit</Button>
                                    <Button variant="primary" onClick={() => loadMap(number)} disabled={!exists[i]}>Načíst</Button>
                                    <Button variant="danger" onClick={() => removeMap(number)} disabled={!exists[i]}>Smazat</Button>
                                </ButtonGroup>
                            </Card>
                        )
                    }
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setVisible(false)}>Zavřít</Button>
                </Modal.Footer>
            </Modal>
            
            : null
        }
        </div>
    )
}