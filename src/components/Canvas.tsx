/**
 * Komponenta zobrazující webové plátno s logikou grafik
 * @category Components
 * @module Canvas
 */

import React, {useEffect, useState} from 'react';
import { Position, Size } from '../models/IGraphic';
import { MovementType, OperationType } from '../models/enums';
import { createBarrier, detectGraphic, drawSelected, redraw } from '../utils/GraphicsLogic';
import { Graphic } from '../models/Graphic';
import {Wall} from '../models/Wall';
import { Finish } from '../models/Finish';
import { Robot } from '../models/Robot';
import { Error, Success, Warning } from '../utils/Messages';
import { isAllDone, simulateStep, someCollision, turning } from '../utils/SimulateLogic';

/**
 * Rozhraní jednotlivých vstupů a výstupů komponenty Canvas
 * @category Components
 */
interface canvasProps {
    /**
     * Input - Trigger, který se provolá pokud nastane událost ke smazání grafiky
     */
    removeTrigger : boolean,
    /**
     * Input - Drží aktuální vybranou operaci
     */
    operation: OperationType,
    /**
     * Output - Uživatel vybral novou grafiku
     * @param graphic {Graphic | null} Vybraná grafika
     * @returns {void}
     */
    callSelected(graphic : Graphic | null) : void,
    /**
     * Input - Zvolená velikost nové zdi
     */
    selectedSize: Size,
    /**
     * Input - Zda aktuálně běží simulace (True - běží, False - neběží)
     */
    status: boolean,
    /**
     * Output - Změna stavu simulace
     * @param _ {boolean} Nová hodnota (nepotřebné, protože boolean -> invertovat)
     */
    setStatus(_ : boolean) : void,
    /**
     * Input - Zvolený způsob pohybu nového robota
     */
    movementType: MovementType
}

const ratio = 16/9;
const width = Math.min(1200, window.innerWidth - 30);

/**
 * Velikost vykreslovacího plátna
 * @type Size
 */
export const canvasSize : Size = {width: width, height: width/ratio};

/**
 * Veškerý seznam grafik
 * @type Graphic[]
 */
export let graphics : Graphic[] = [];

/**
 * Setter pro globální seznam grafik
 * @param g {Graphic[]} Grafiky, které mají být nastaveny
 */
export function setGraphics(g : Graphic[]){
    graphics = g;
}

/**
 * Kontext pro kreslení na plátno
 * @type CanvasRenderingContext2D
 */
export let ctx : CanvasRenderingContext2D;

const keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]

let playStatus = false;
let dragStartPosition : Position | null = null;
let selectedGraphic : Graphic | null = null;

/**
 * Komponenta Canvas
 * @function Canvas
 * @param props {canvasProps} 
 * @returns {ReactElement}
 */
export const Canvas = ({removeTrigger, operation, callSelected, selectedSize, status, setStatus, movementType} : canvasProps) => {
    const [cursor, setCursor] = useState("default");
    const canvas = React.useRef<HTMLCanvasElement | null>(null);     

    /**
     * Po vytvoření canvasu se vytvoří implicitní zdi jako bariéry a začne se poslouchat
     * kliknutí na klávesy.
     * @exports Canvas
     * @function canvas
     */
    useEffect(() => {
        const _ctx = canvas.current?.getContext('2d');
        if (_ctx){
            ctx = _ctx;
            graphics = createBarrier();
        }
        window.addEventListener('keydown', handler, false);
    }, [canvas])

    /**
     * Po vyvolání removeTrigger se vybraná grafika smaže
     * @exports Canvas
     * @function removeTrigger
     */
    useEffect(() => {
        if (!selectedGraphic) return;
        graphics.splice(graphics.indexOf(selectedGraphic), 1);
        redraw();
        selectedGraphic = null;
        callSelected(null);
    // eslint-disable-next-line
    },[removeTrigger]);
    
    /**
     * Po změně statusu simulace se simulace buď spustí nebo zastaví
     * @exports Canvas
     * @function status
     */
    useEffect(() => {
        playStatus = status;
        if (playStatus){
            unselectGraphic();
            simulate();
        }
    // eslint-disable-next-line
    }, [status])

    /**
     * Po změně vybrané operace na vytváření se zruší vybraná grafika
     * @exports Canvas
     * @function operation
     */
    useEffect(() => {
        if (operation !== OperationType.Cursor) unselectGraphic();
    // eslint-disable-next-line
    },[operation])




    /**
     * Pokud je simulace spuštěna změní směr robotů
     * @exports Canvas
     * @function handler
     * @param e {KeyboardEvent} Zmáčknutá klávesa
     */
    function handler(e: KeyboardEvent){
        if (playStatus && keys.some(k => k === e.key)) {
            turning(e.key);
        }
    };

    /**
     * Provádí pohyb robotů na plátně dokud nedojdou všichni do cíle, nebo dokud není simulace pozastavena uživatelem.
     * @exports Canvas
     * @function simulate
     */
    async function simulate(){
        if (!correct()) return;
        if (someCollision()){
            Warning('Výchozí pozice robota koliduje se zdí.');
        }
        while (!isAllDone() && playStatus){
            graphics = simulateStep();
            redraw();
            await new Promise(res => setTimeout(res, 25));
        }
        //finished
        if (isAllDone()){
            setStatus(false);
            Success('Všichni roboti dotazili do cíle.')
        }
    }

    /**
     * Zjistí, zda je vložen cíl a robot
     * @exports Canvas
     * @function correct
     * @returns {boolean} True pokud je vložen alespoň 1 cíl a 1 robot
     */
    function correct() : boolean {
        if (! graphics.some(g => g instanceof Robot)){
            Error('Není vložen žádný robot!');
            setStatus(false);
            return false;
        }
        if (! graphics.some(g => g instanceof Finish)){
            Error('Není vložen žádný cíl!');
            setStatus(false);
            return false;
        }
        return true;
    }

    /**
     * Přepočítá pozici kliknutí podle umístění canvasu
     * @exports Canvas
     * @function getPosition
     * @param e {React.MouseEvent} Kliknutí myší
     * @returns {Position} Souřadnice v rámci canvasu
     */
    function getPosition(e : React.MouseEvent) : Position {
        return {x: (e.clientX - (canvas.current?.offsetLeft ?? 0)),y : (e.clientY - (canvas.current?.offsetTop ?? 0))};;
    }

    /**
     * Podle vybrané operace vloží novou grafiku nebo vybere již existující
     * @exports Canvas
     * @function onClick
     * @param e {React.MouseEvent} Kliknutí myší
     */
    function onClick(e : React.MouseEvent){
        const position = getPosition(e);
        if (!ctx) return;
        switch (operation){
            case OperationType.Cursor:
                selectGraphic(position);
                break;
            case OperationType.Wall:
                if (selectedSize.height < 10 || selectedSize.width < 10){
                    Error('Zeď musí mít minimální výšku a šířku 10');
                    return;
                } 
                graphics = [...graphics, new Wall(position, selectedSize, ctx)];
                break;
            case OperationType.Finish:
                graphics = [...graphics, new Finish(position, ctx)];
                break;
            default:
                graphics = [...graphics, new Robot(position, ctx, movementType)];
                break;
        }     
    }

    /**
     * Najde vybranou grafiku a uloží si počáteční souřadně drag and dropu + změní kurzor myši
     * @exports Canvas
     * @function dragMouseDown
     * @param e {React.MouseEvent} Kliknutí myší (stlačení dolů)
     */
    function dragMouseDown(e : React.MouseEvent){
        if(operation !== OperationType.Cursor || !selectedGraphic) return;
        const position = getPosition(e)
        if (detectGraphic(position) === selectedGraphic) {
            dragStartPosition = position;
            setCursor("move");
        }
    }

    /**
     * Posune posouvanou grafiku o aktuální pozici myši - původní pozici při drag and drop + změní kurzor myši zpět
     * @exports Canvas
     * @function dragMouseUp
     * @param e {React.MouseEvent} Kliknutí myší (puštění tlačítka)
     */
    function dragMouseUp(e : React.MouseEvent){
        setCursor("default");

        if (!dragStartPosition || !selectedGraphic) return;
        graphics.splice(graphics.indexOf(selectedGraphic), 1);
        const position = getPosition(e);
        const newPosition = {
            x: selectedGraphic.position.x + position.x - dragStartPosition.x, 
            y: selectedGraphic.position.y + position.y - dragStartPosition.y
        };
        selectedGraphic.position = newPosition;
        selectedGraphic.recalculateBoundingRect();
        graphics = [...graphics, selectedGraphic];
        dragStartPosition = null;
    }

    /**
     * Zruší označení grafiky a smaže grafiku, která označuje označenou grafiku
     * @exports Canvas
     * @function unselectGraphic
     */
    function unselectGraphic(){
        selectedGraphic = null;
        redraw();
        callSelected(null);
    }

    /**
     * Vybere grafiku podle souřednice parametru
     * @exports Canvas
     * @function selectGraphic
     * @param position {Position} Pozice, kam uživatel kliknul v rámci Canvasu
     */
    function selectGraphic(position : Position){
        unselectGraphic();
        if (playStatus) return;
        const selected = detectGraphic(position);
        callSelected(selected ?? null);
        if (selected){
            selectedGraphic = selected;
            drawSelected(selectedGraphic);
        }
    }

    return (
        <div>
            <canvas onClick={onClick} onMouseDown={dragMouseDown} onMouseUp={dragMouseUp}
            ref={canvas} height={canvasSize.height} width={canvasSize.width} style={{backgroundColor: 'white', cursor: cursor}}/>
        </div>
    );
}