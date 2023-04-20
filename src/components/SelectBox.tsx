import { GiBrickWall, GiArrowCursor, GiFinishLine } from 'react-icons/gi'
import { FaRobot } from 'react-icons/fa'
import { OperationType } from '../models/enums';
import { Button, ButtonGroup} from 'react-bootstrap';

const types: string[] = ["Kurzor", "Zeď", "Cíl", "Robot"];

/**
 * @category Components
 * @interface props
 * @property {boolean} status Simulation is running
 * @property {OperationType} operation Operation type
 * @method setOperation Nastavi operaci
 */
interface props {
    operation : OperationType,
    setOperation(_ : OperationType) : void,
    status : boolean
}

/**
 * Selection of operation
 * @category Components
 * @module SelectBox
 */
export const SelectBox = ({operation, setOperation, status} : props) => {
    return (
        <ButtonGroup vertical={window.innerWidth > 1468} className='margin-bottom'>
            {types.map((type, index) =>
                <Button variant={index===operation ? "primary" : "secondary"} key={index} onClick={() => setOperation(index)}
                    disabled={status}>
                    <div className='button'>
                        {index === 0 ? <GiArrowCursor size={30} /> :
                            index === 1 ? <GiBrickWall size={30} /> :
                                index === 2 ? <GiFinishLine size={30} /> :
                                    <FaRobot size={30} />
                        }
                        <h5>{type}</h5>
                    </div>
                </Button>
            )}
        </ButtonGroup>
    )
}