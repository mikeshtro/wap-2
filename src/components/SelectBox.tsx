/**
 * Komponenta zobrazující box pro výběr operace 
 * @category Components
 * @module SelectBox
 */

import { GiBrickWall, GiArrowCursor, GiFinishLine } from 'react-icons/gi'
import { FaRobot } from 'react-icons/fa'
import { OperationType } from '../models/enums';
import { Button, ButtonGroup} from 'react-bootstrap';

const types: string[] = ["Kurzor", "Zeď", "Cíl", "Robot"];

/**
 * Rozhraní jednotlivých vstupů a výstupů komponenty SelectBox
 * @category Components
 */
interface selectBoxProps {
    /**
     * Input - Drží aktuální vybranou operaci
     */
    operation : OperationType,
    /**
     * Output - Změna vybrané operace
     * @param _ {OperationType} Nově zvolená operace
     */
    setOperation(_ : OperationType) : void,
    /**
     * Input - Zda aktuálně běží simulace (True - běží, False - neběží)
     */
    status : boolean
}

/**
 * Komponenta SelectBox
 * @function SelectBox
 * @param props {selectBoxProps} 
 * @returns ReactElement
 */
export const SelectBox = ({operation, setOperation, status} : selectBoxProps) => {
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