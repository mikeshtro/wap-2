/**
 * Komponenta zobrazující druhy pohybů
 * @category Components
 * @module MovementBox
 */

import { Row, Col, DropdownButton, Dropdown } from "react-bootstrap";
import { MovementType } from "../models/enums";

/**
 * Rozhraní jednotlivých vstupů a výstupů komponenty MovementBox
 * @category Components
 */
interface movementBoxProps {
    /**
     * Output - Uživatel vybral nový druh pohybu
     * @param _ {string | null} Vybraný pohyb
     * @returns {void}
     */
    setMovementType(_ : string |null): void,
    /**
     * Input - Zvolený druh pohybu
     */
    movementType: MovementType
}

/**
 * Komponenta MovementBox
 * @function MovementBox
 * @param props {movementBoxProps} 
 * @returns {ReactElement}
 */
export const MovementBox = ({movementType, setMovementType}:movementBoxProps) => 
{
   return (
        <div>
            <Row>
                <Col>
                    <h5>Druh pohybu:</h5>
                </Col>
                <Col>
                    <DropdownButton title={movementType} onSelect={setMovementType}>
                        <Dropdown.Item value={MovementType.Random} eventKey="Random">Random</Dropdown.Item>
                        <Dropdown.Item value={MovementType.RightHand} eventKey="Right Hand">Right hand</Dropdown.Item>
                        <Dropdown.Item value={MovementType.LeftHand} eventKey="Left Hand">Left hand</Dropdown.Item>
                        <Dropdown.Item value={MovementType.Custom} eventKey="Custom">Custom</Dropdown.Item>
                    </DropdownButton>
                </Col>
            </Row>
        </div>
   );
}