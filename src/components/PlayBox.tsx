import { OperationType } from '../models/enums';
import { FaPlay, FaStop } from 'react-icons/fa';

interface props {
    setStatus(_ : boolean) : void,
    status : boolean,
    operation: OperationType
}

export const PlayBox = ({setStatus, status, operation} : props) => {
    return (
        <div className='card row center play'>
                <button className={status ? "selectButtonSelected playButton" : "selectButton playButton"} onClick={() => {setStatus(true)}}
                    disabled={operation !== OperationType.Cursor}>
                    <div>
                        <FaPlay size={20}/>
                        <h4 className='text-button'>Spustit</h4>
                    </div>
                </button>
                <button className={!status ? "selectButtonSelected playButton" : "selectButton playButton"} onClick={() => {setStatus(false)}}
                    disabled={operation !== OperationType.Cursor}>
                    <div>
                        <FaStop size={20}/>
                        <h4 className='text-button'>Zastavit</h4>
                    </div>
                </button>
    </div>
    )
}