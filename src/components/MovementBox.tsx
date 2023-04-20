import { Row, Col, DropdownButton, Dropdown } from "react-bootstrap";
import { MovementType } from "../models/enums";


interface props {
    setMovementType(_ : string |null): void,
    movementType: MovementType
}


export const MovementBox = ({movementType, setMovementType}:props) => 
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