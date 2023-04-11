import { GiBrickWall, GiArrowCursor, GiFinishLine } from 'react-icons/gi'
import { FaRobot } from 'react-icons/fa'
import { OperationType } from '../models/enums';

const types: string[] = ["Kurzor", "Zeď", "Cíl", "Robot"];

interface props {
    operation : OperationType,
    setOperation(_ : OperationType) : void,
    status : boolean
}

export const SelectBox = ({operation, setOperation, status} : props) => {
    return (
        <div className="card right">
            <div className='column'>
            {types.map((type, index) =>
                <button className={index===operation ? "selectButtonSelected" : "selectButton"} key={index} onClick={() => setOperation(index)}
                    disabled={status}>
                    <div>
                        {index === 0 ? <GiArrowCursor size={30} /> :
                            index === 1 ? <GiBrickWall size={30} /> :
                                index === 2 ? <GiFinishLine size={30} /> :
                                    <FaRobot size={30} />
                        }
                        <h3>{type}</h3>
                    </div>
                </button>
            )}
            </div>
        </div>
    )
}