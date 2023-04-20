import { MdDelete } from 'react-icons/md'
import { Size } from '../models/IGraphic';
import { Graphic } from '../models/Graphic';
import { EditBox } from './EditBox';
import { FaSave } from 'react-icons/fa';
import { GraphicType, MovementType, OperationType } from '../models/enums';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { MovementBox } from './MovementBox';

/**
 * @category Components
 * @interface props
 * @property {number} operation Type of selected operation
 * @property {Graphic | null} selectedGraphic Selected graphic
 * @property {Size} size Size
 * @property {MovementType} movementType Movement type of selected Robot
 * @method removeClicked 
 * @method saveClicked
 * @method setSize 
 * @method setMovementType
 */
interface props {
    operation: number,
    selectedGraphic: Graphic | null,
    removeClicked(): void,
    saveClicked(): void,
    setSize(_: Size): void,
    size: Size,
    setMovementType(_ : string |null): void,
    movementType: MovementType
}

/**
 * Right side detail box
 * @category Components
 * @module DetailBox
 */
export const DetailBox = ({ operation, selectedGraphic, removeClicked, saveClicked, setSize, size , setMovementType, movementType}: props) => {

    /**
     * Converts graphic to String
     * @exports DetailBox
     * @function graphicToText
     * @property {Graphic | null} graphic Selected graphic
     * @returns String
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
     * Converts number to String
     * @exports DetailBox
     * @function operationToText
     * @property {Number} operation Selected operation
     * @returns String
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