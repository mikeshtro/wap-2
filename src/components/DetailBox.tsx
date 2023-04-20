/**
 * Komponenta zobrazující informační panel
 * @category Components
 * @module DetailBox
 */

import { MdDelete } from 'react-icons/md'
import { Size } from '../models/IGraphic';
import { Graphic } from '../models/Graphic';
import { EditBox } from './EditBox';
import { FaSave } from 'react-icons/fa';
import { GraphicType, MovementType, OperationType } from '../models/enums';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { MovementBox } from './MovementBox';

/**
 * Rozhraní jednotlivých vstupů a výstupů komponenty DetailBox
 * @category Components
 */
interface detailBoxProps {
    /**
     * Input - Drží aktuální vybranou operaci
     */
    operation: number,
    /**
     * Input - Drží aktuálně vybranou grafiku
     */
    selectedGraphic: Graphic | null,
    /**
     * Output - Uživatel smazal vybranou grafiku
     * @returns {void}
     */
    removeClicked(): void,
    /**
     * Output - Uživatel uložil upravenou vlastnost
     * @returns {void}
     */
    saveClicked(): void,
    /**
     * Output - Uživatel nastavil novou velikost grafiky
     * @param _ {_ | Size} Velikost grafiky
     * @returns {void}
     */
    setSize(_: Size): void,
    /**
     * Input - Drží aktuální velikost grafiky
     */
    size: Size,
    /**
     * Output - Uživatel vybral novou grafiku
     * @param graphic {Graphic | null} Vybraná grafika
     * @returns {void}
     */
    setMovementType(_ : string |null): void,
    /**
     * Output - Změna stavu simulace
     * @param _ {boolean} Nová hodnota (nepotřebné, protože boolean -> invertovat)
     * @returns {void}     
     */
    setStatus(_ : boolean) : void,
    /**
     * Input - Zvolený způsob pohybu nového robota
     */
    movementType: MovementType
}

/**
 * Komponenta DetailBox
 * @function DetailBox
 * @param props {detailBoxProps} 
 * @returns {ReactElement}
 */
export const DetailBox = ({ operation, selectedGraphic, removeClicked, saveClicked, setSize, size , setMovementType, movementType}: detailBoxProps) => {

    /**
     * Provádí převod grafiky na název
     * @exports DetailBox
     * @function graphicToText
     * @param graphic {Graphic | null} Vybraná grafika
     * @returns {String}
     */
    function graphicToText(graphic: Graphic | null): String {
        if (!graphic) return "---";
        switch (graphic.type) {
            case GraphicType.Wall: return "Zeď";
            case GraphicType.Finish: return "Cíl";
            default: return "Robot";
        }
    }

    /**
     * Převádí číslo vybrané operace na text
     * @exports DetailBox
     * @function operationToText
     * @param operation {Number} Vybraná operace
     * @returns {String}
     */
    function operationToText(operation: Number): String {
        //0 kurzor
        switch (operation) {
            case 1: return "Zeď";
            case 2: return "Cíl";
            default: return "Robot";
        }
    }

    return (
        <div>
            {
                operation === OperationType.Cursor ?
                    selectedGraphic ?
                        <Card className="myCard">
                            <Card.Header>
                                <h4>
                                    Označeno: {graphicToText(selectedGraphic)}
                                </h4>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col align="center">
                                        <Button variant='danger' className='margin-bottom' onClick={removeClicked} disabled={!selectedGraphic}>
                                            <Row>
                                                <Col>
                                                    <h5>Smazat</h5>
                                                </Col>
                                                <Col>
                                                    <MdDelete size={25} />
                                                </Col>
                                            </Row>
                                        </Button>
                                    </Col>
                                </Row>
                                {
                                    selectedGraphic?.type === GraphicType.Wall ?
                                        <Card className='myCard-prim'>
                                            <Card.Body>
                                                <EditBox
                                                    size={size}
                                                    setSize={setSize}
                                                />
                                                <Row>
                                                    <Col align="center">
                                                        <Button variant='primary' className='margin-top' onClick={saveClicked} disabled={!selectedGraphic}>
                                                            <Row>
                                                                <Col>
                                                                    <h5>Uložit</h5>
                                                                </Col>
                                                                <Col>
                                                                    <FaSave size={25} />
                                                                </Col>
                                                            </Row>
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    : selectedGraphic?.type === GraphicType.Robot ? 
                                        <Card className='myCard-prim'>
                                            <Card.Body>
                                                <MovementBox
                                                    movementType={movementType}    
                                                    setMovementType={setMovementType}
                                                />
                                            </Card.Body>
                                        </Card>
                                    : null
                                }
                            </Card.Body>
                        </Card>
                        : null
                    :
                    <Card className="myCard">
                        <Card.Header>
                            <h4>
                                Vytváříte: {operationToText(operation)}
                            </h4>
                        </Card.Header>
                        <Card.Body>
                            {
                                operation === OperationType.Wall ? <Card className='myCard-prim'>
                                    <Card.Body>
                                        <EditBox
                                            size={size}
                                            setSize={setSize}
                                        />
                                    </Card.Body>
                                </Card> : operation === OperationType.Robot ? 
                                <Card className='myCard-prim'>
                                    <Card.Body>
                                        <MovementBox
                                            movementType={movementType}    
                                            setMovementType={setMovementType}
                                        />
                                    </Card.Body>
                                </Card> : null
                            }
                        </Card.Body>
                    </Card>
            }
        </div >
    )
}