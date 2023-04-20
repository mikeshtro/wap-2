/**
 * Komponenta zobrazující box s možností spustit a zastavit simulaci
 * @category Components
 * @module PlayBox
 */

import { Button, ButtonGroup } from 'react-bootstrap';
import { OperationType } from '../models/enums';
import { FaPlay, FaStop } from 'react-icons/fa';

/**
 * Rozhraní jednotlivých vstupů a výstupů komponenty PlayBox
 * @category Components
 */
interface playBoxProps {
    /**
     * Output - Uživatel vybral novoý status
     * @param _ {boolean} Nová hodnota 
     * @returns {void}
     */
    setStatus(_ : boolean) : void,
    /**
     * Input - Zda aktuálně běží simulace (True - běží, False - neběží)
     */
    status : boolean,
    /**
     * Input - Drží aktuální vybranou operaci
     */
    operation: OperationType
}

/**
 * Komponenta PlayBox
 * @function PlayBox
 * @param props {playBoxProps} 
 * @returns ReactElement
 */
export const PlayBox = ({setStatus, status, operation} : playBoxProps) => {
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