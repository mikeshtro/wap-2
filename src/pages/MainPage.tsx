import { useState } from "react";
import { Graphic } from "../models/Graphic";
import { DetailBox } from "../components/DetailBox";
import { MapSaver } from "../components/MapSaver";
import { Canvas } from "../components/Canvas";
import { PlayBox } from "../components/PlayBox";
import { SelectBox } from "../components/SelectBox";
import { drawSelected, redraw } from "../utils/GraphicsLogic";
import { Wall } from "../models/Wall";
import { MovementType, OperationType } from "../models/enums";
import { Size } from "../models/IGraphic";
import { Col, Container, Row } from "react-bootstrap";
import { Robot } from "../models/Robot";

/**
 * Hlavni obrazovka aplikace
 * @category Pages
 * @module MainPage
 * @requires PlayBox
 * @requires SelectBox
 * @requires Canvas
 * @requires DetailBox
 * @requires MapSaver
 * @returns ReactElement
 */
export function MainPage() {
    const [status, setStatus] = useState<boolean>(false);
    const [operation, setOperation] = useState<OperationType>(0);
    const [selectedGraphic, setSelectedGraphic] = useState<Graphic | null>(null);
    const [removeTrigger, setRemoveTrigger] = useState<boolean>(false);
    const [size, setSize] = useState<Size>({ width: 10, height: 10 });
    const [movementType, setMovementType] = useState<MovementType>(MovementType.Random);

    /**
     * Sets size of Wall
     * @exports MainPage
     * @function setSelected
     * @property {Graphic} graphic Graphic to be selected
     * @returns void
     */
    function setSelected(graphic: Graphic) {
        setSelectedGraphic(graphic);
        if (graphic instanceof Wall) {
            setSize(graphic.size);
        }
    }

    /**
     * Updates size of Wall
     * @exports MainPage
     * @function updateSize
     * @returns void
     */
    function updateSize() {
        if (size.height < 10 || size.width < 10) {
            Error('Zeď musí mít minimální výšku a šířku 10');
            return;
        }
        if (selectedGraphic) {
            (selectedGraphic as Wall).setSize(size);
            redraw();
            drawSelected(selectedGraphic);
        }
    }

    /**
     * Sets default size of Wall
     * @exports MainPage
     * @function setDefaultSize
     * @property {OperationType} operation Selected operation
     * @returns void
     */
    function setDefaultSize(operation: OperationType) {
        setOperation(operation);
        if (OperationType.Wall === operation)
            setSize({ width: 10, height: 10 });
    }

    /**
     * Unselects graphic and stops simulation
     * @exports MainPage
     * @function mapLoaded
     * @returns void
     */
    function mapLoaded(){
        setSelectedGraphic(null);
        setStatus(false);
    }

    /**
     * Changes movement type of Robot
     * @exports MainPage
     * @function changeMovementType
     * @property {string | null} eventKey Selected option
     * @returns void
     */
    const changeMovementType = (eventKey: string | null) => {
        setMovementType(eventKey as MovementType);
        if (selectedGraphic instanceof Robot) {
            selectedGraphic.setMovementType(eventKey as MovementType);
        }
    };

    return (
        <Container fluid>
            <Row>
                <Col align="center">
                    <PlayBox setStatus={setStatus} status={status} operation={operation} />
                </Col>
                
            </Row>
            <Row className="align-items-center">
                <Col sm={2} align="right">
                    <SelectBox
                        operation={operation}
                        setOperation={setDefaultSize}
                        status={status} />
                </Col>
                <Col sm align="center">
                    <Canvas
                        operation={operation}
                        callSelected={setSelected}
                        removeTrigger={removeTrigger}
                        selectedSize={size}
                        status={status}
                        setStatus={setStatus} />
                </Col>
                <Col sm align="left">
                    <DetailBox
                        operation={operation}
                        selectedGraphic={selectedGraphic}
                        removeClicked={() => setRemoveTrigger(!removeTrigger)}
                        setSize={setSize}
                        saveClicked={updateSize}
                        size={size}
                        setMovementType={changeMovementType} 
                        movementType={movementType}/>
                </Col>
            </Row>
            <Row align="center">
                <MapSaver loaded={mapLoaded}/>
            </Row>
        </Container>
    );
}