import { Form, InputGroup } from 'react-bootstrap';
import { Size } from '../models/IGraphic';


interface props {
    size: Size,
    setSize(_: Size): void
}

export const EditBox = ({size, setSize}:props) => 
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
