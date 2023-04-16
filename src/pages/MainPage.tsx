import { useState } from "react";
import { Graphic } from "../models/Graphic";
import { DetailBox } from "../components/DetailBox";
import { MapSaver } from "../components/MapSaver";
import { Canvas } from "../components/Canvas";
import { PlayBox } from "../components/PlayBox";
import { SelectBox } from "../components/SelectBox";
import { drawSelected, redraw } from "../utils/GraphicsLogic";
import { Wall } from "../models/Wall";
import { OperationType } from "../models/enums";
import { Size } from "../models/IGraphic";
import { Col, Container, Row } from "react-bootstrap";


function MainPage() {
    const [status, setStatus] = useState<boolean>(false);
    const [operation, setOperation] = useState<OperationType>(0);
    const [selectedGraphic, setSelectedGraphic] = useState<Graphic | null>(null);
    const [removeTrigger, setRemoveTrigger] = useState<boolean>(false);
    const [size, setSize] = useState<Size>({ width: 10, height: 10 });

    function setSelected(graphic: Graphic) {
        setSelectedGraphic(graphic);
        if (graphic instanceof Wall) {
            setSize(graphic.size);
        }
    }

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

    function setDefaultSize(operation: OperationType) {
        setOperation(operation);
        if (OperationType.Wall === operation)
            setSize({ width: 10, height: 10 });
    }

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
                        size={size} />
                </Col>
            </Row>
            <Row align="center">
                <MapSaver />
            </Row>
        </Container>
    );

}

export default MainPage;