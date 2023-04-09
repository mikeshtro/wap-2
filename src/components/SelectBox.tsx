import { useState } from 'react';
import { GiBrickWall, GiArrowCursor, GiFinishLine } from 'react-icons/gi'
import { FaRobot } from 'react-icons/fa'
import { OperationType } from '../models/enums';
import '../styles/App.css'

const types: string[] = ["Kurzor", "Zeď", "Cíl", "Robot"];

interface props {
    callSelect(_ : number) : void
}

export const SelectBox = ({callSelect} : props) => {
    const [operation, setOperation] = useState<OperationType>(0);

    return (
        <div className="container">
            {types.map((type, index) =>
                <button className={index===operation ? "selectButtonSelected" : "selectButton"} key={index} onClick={() => {setOperation(index); callSelect(index)}}>
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
    )
}