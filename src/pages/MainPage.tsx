/**
 * Hlavni obrazovka aplikace, která zajišťuje komunikaci mezi jednotlivými 
 * komponentami
 * @category Pages
 * @module MainPage
 * @requires PlayBox
 * @requires SelectBox
 * @requires Canvas
 * @requires DetailBox
 * @requires MapSaver
 */

import { useState } from "react";
import { Graphic } from "../models/Graphic";
import { DetailBox } from "../components/DetailBox";
import { MapSaver } from "../components/MapSaver";
import { Canvas } from "../components/Canvas";
import { PlayBox } from "../components/PlayBox";
import { SelectBox } from "../components/SelectBox";
import { Wall } from "../models/Wall";
import { MovementType, OperationType } from "../models/enums";
import { Size } from "../models/IGraphic";
import { Col, Container, Row } from "react-bootstrap";
import { Robot } from "../models/Robot";

/**
 * Komponenta MainPage
 * @function MainPage
 * @returns ReactElement
 */
export function MainPage() {
    const [status, setStatus] = useState<boolean>(false);
    const [operation, setOperation] = useState<OperationType>(0);
    const [selectedGraphic, setSelectedGraphic] = useState<Graphic | null>(null);
    const [size, setSize] = useState<Size>({ width: 10, height: 10 });
    const [movementType, setMovementType] = useState<MovementType>(MovementType.Random);
    const [graphics, setGraphics] = useState<Graphic[]>([]);

    /**
     * Nastavuje hodnoty vybrané grafiky do UI komponent
     * @exports MainPage
     * @function setSelected
     * @param graphic {Graphic} Která grafika je vybrána uživatelem
     */
    function setSelected(graphic: Graphic) {
        setSelectedGraphic(graphic);
        if (graphic instanceof Wall) {
            setSize(graphic.size);
        }
        if (graphic instanceof Robot) {
            setMovementType(graphic.movement.type);
        }
    }

    /**
     * Kontroluje nově nastavené rozměry a případně aktualizuje vybranou
     * grafiku
     * @exports MainPage
     * @function updateSize
     */
    function updateSize() {
        if (size.height < 10 || size.width < 10) {
            Error('Zeď musí mít minimální výšku a šířku 10');
            return;
        }
        if (selectedGraphic) {
            (selectedGraphic as Wall).setSize(size);
            // TODO: mozna setGraphics
            // TODO: canvas by mel ted prekresit grafiky i selectedGraphic
        }
    }

    /**
     * Nastaví aktualní operaci uživatele a případně nastaví
     * výchozí velikost zdí
     * @exports MainPage
     * @function setDefaultSize
     * @param operation {OperationType} Která operace je uživatelem vybrána
     */
    function setDefaultSize(operation: OperationType) {
        setOperation(operation);
        if (OperationType.Wall === operation)
            setSize({ width: 10, height: 10 });
    }

    /**
     * Zastaví simulaci a zruší výběr uživatele
     * @exports MainPage
     * @function mapLoaded
     * @param graphics {Graphic[]} seznam nactenych grafik
     */
    function setLoadedGraphics(graphics: Graphic[]){
        setGraphics(graphics);
        setSelectedGraphic(null);
        setStatus(false);
    }

    /**
     * Odstraní vybranou grafiku ze seznamu všech grafik 
     */
    function removeGraphic(): void {
        if (!selectedGraphic) return;
        const index = graphics.indexOf(selectedGraphic);
        const newGraphics = [graphics.slice(0, index), graphics.slice(index + 1)].flat();
        setGraphics(newGraphics);
        setSelectedGraphic(null);
    }

    /**
     * Aktualizuje způsob pohybu aktuálně vybraného robota
     * @exports MainPage
     * @function changeMovementType
     * @param eventKey {string | null} Který způsob pohybu je vybrán
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
                        selectedGraphic={selectedGraphic}
                        callSelected={setSelected}
                        selectedSize={size}
                        status={status}
                        setStatus={setStatus}
                        movementType={movementType}
                        graphics={graphics}
                        setGraphics={setGraphics}
                        />
                </Col>
                <Col sm align="left">
                    <DetailBox
                        operation={operation}
                        selectedGraphic={selectedGraphic}
                        removeClicked={() => removeGraphic()}
                        setSize={setSize}
                        saveClicked={updateSize}
                        size={size}
                        setMovementType={changeMovementType} 
                        movementType={movementType}
                        />
                </Col>
            </Row>
            <Row align="center">
                <MapSaver setLoadedGraphics={setLoadedGraphics} graphics={graphics}/>
            </Row>
        </Container>
    );
}