/**
 * Komponenta zobrazující upravující box
 * @category Components
 * @module EditBox
 */

import { Form, InputGroup } from 'react-bootstrap';
import { Size } from '../models/IGraphic';

/**
 * Rozhraní jednotlivých vstupů a výstupů komponenty EditBox
 * @category Components
 */
interface editBoxProps {
    /**
     * Input - Drží aktuální velikost vybrané grafiky
     */
    size: Size,
    /**
     * Output - Uživatel nastavil novou velikost grafiky
     * @param _ {_ | Size} Velikost grafiky
     * @returns {void}
     */
    setSize(_: Size): void
}

/**
 * Komponenta EditBox
 * @function EditBox
 * @param props {editBoxProps} 
 * @returns ReactElement
 */
export const EditBox = ({size, setSize}:editBoxProps) => 
{
   return (
    <div>
        <InputGroup className='margin-bottom'>
            <InputGroup.Text>Šířka:</InputGroup.Text>
            <Form.Control type="number" value={size.width} placeholder=" " onChange={(event) =>
                        setSize({ width: Number(event.target.value), height: size.height })
                    } />
        </InputGroup>
        <InputGroup>
            <InputGroup.Text>Výška:</InputGroup.Text>
            <Form.Control type="number" value={size.height} placeholder=" "                     onChange={(event) =>
                        setSize({ width: size.width, height: Number(event.target.value) })
                    }  />
        </InputGroup>
    </div>
   )
}
