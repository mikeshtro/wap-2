import { Button, ButtonGroup } from 'react-bootstrap';
import { OperationType } from '../models/enums';
import { FaPlay, FaStop } from 'react-icons/fa';

/**
 * @category Components
 * @interface props
 * @property {boolean} status Simulation is running
 * @property {OperationType} operation Operation type
 * @method setStatus
 */
interface props {
    setStatus(_ : boolean) : void,
    status : boolean,
    operation: OperationType
}

/**
 * Play and Stop component
 * @category Components
 * @module PlayBox
 */
export const PlayBox = ({setStatus, status, operation} : props) => {
    return (
        <ButtonGroup className="margin-10">
                <Button variant={status ? "primary" : "secondary"} onClick={() => {setStatus(true)}}
                    disabled={operation !== OperationType.Cursor}>
                    <div>
                        <FaPlay size={25}/>
                        <h5 className='text-button'>Spustit</h5>
                    </div>
                </Button>
                <Button variant={!status ? "primary" : "secondary"} onClick={() => {setStatus(false)}}
                    disabled={operation !== OperationType.Cursor}>
                    <div>
                        <FaStop size={25}/>
                        <h5 className='text-button'>Zastavit</h5>
                    </div>
                </Button>
        </ButtonGroup>
    )
}