import '../styles/App.css';
import { FaPlay, FaStop } from 'react-icons/fa';

interface props {
    setStatus(_ : boolean) : void,
    status : boolean,
}

export const PlayBox = ({setStatus, status} : props) => {
    

    return (
        <div className='card row center'>
                <button className={status ? "selectButtonSelected playButton" : "selectButton playButton"} onClick={() => {setStatus(true)}}>
                    <div>
                        <FaPlay size={20}/>
                        <h4 className='text-button'>Spustit</h4>
                    </div>
                </button>
                <button className={!status ? "selectButtonSelected playButton" : "selectButton playButton"} onClick={() => {setStatus(false)}}>
                    <div>
                        <FaStop size={20}/>
                        <h4 className='text-button'>Zastavit</h4>
                    </div>
                </button>
    </div>
    )
}