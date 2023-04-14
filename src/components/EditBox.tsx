import { Size } from '../models/IGraphic';


interface props {
    size: Size,
    setSize(_: Size): void
}

export const EditBox = ({size, setSize}:props) => 
{
   return (
        <div className='column'>
            <div className='row horizontal-center'>
                <label className='input-text'>Šířka:</label>
                <input className='input' value={size.width} min={10} max={100} type="number"
                    onChange={(event) =>
                        setSize({ width: Number(event.target.value), height: size.height })
                    } />
            </div>
            <div className='row horizontal-center'>
                <label className='input-text'>Výška:</label>
                <input className='input' value={size.height} min={10} max={1300} type="number"
                    onChange={(event) =>
                        setSize({ width: size.width, height: Number(event.target.value) })
                    } />
            </div>
        </div>
   )
}
