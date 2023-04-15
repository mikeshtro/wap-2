import { useState, useEffect } from 'react';
import { exist, loadData, saveData } from "../utils/StorageLogic"

const ids = [1,2,3,4,5];

export const MapSaver = () => {
    const [exists, setExists] = useState<boolean[]>([false,false,false,false,false]);

    useEffect(() => {
        setExists(exists.map((_, i) => exist(i + 1)));
    }, [])
    
    function saveMap(index : number){
        saveData(index);
        setExists(exists.map((_, i) => exist(i + 1)));
    }

    return (
        <div className="maps row">
            {
                ids.map((number, i) => 
                    <div key={i} className="mapsBox mapsCol">
                        <h4 className="mapsText">Slot č. {number}: {exists[i] ? "Obsazeno" : "Volno"}</h4> 
                        <button className="selectButton" onClick={() => saveMap(number)}>Uložit</button>
                        <button className="selectButton" onClick={() => loadData(number)}>Načíst</button>
                    </div>
                )
            }

        </div>
    )
}