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
     * Input - Drží aktuální vybranou operaci
     */
    operation: OperationType,
    /**
     * Input - Aktuálně vybraná grafika
     */
    selectedGraphic: Graphic | null;
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
    /**
     * Input - Veškerý seznam grafik
     */
    graphics : Graphic[];
    /**
     * Output - Setter pro globální seznam grafik
     * @param g {Graphic[]} Grafiky, které mají být nastaveny
     */
    setGraphics(g : Graphic[]): void,
}

const ratio = 16/9;
const width = Math.min(1200, window.innerWidth - 30);

/**
 * Velikost vykreslovacího plátna
 * @type Size
 */
export const canvasSize : Size = {width: width, height: width/ratio};

/**
 * Kontext pro kreslení na plátno
 * @type CanvasRenderingContext2D
 */
let ctx : CanvasRenderingContext2D;

const keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]

let playStatus = false;
let dragStartPosition : Position | null = null;

/**
 * Komponenta Canvas
 * @function Canvas
 * @param props {canvasProps} 
 * @returns {ReactElement}
 */
export const Canvas = ({ operation, selectedGraphic, callSelected, selectedSize, status, setStatus, movementType, graphics, setGraphics} : canvasProps) => {
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
            let newGraphics = createBarrier();
            setGraphics(newGraphics);
        }
        window.addEventListener('keydown', handler, false);
    }, [canvas])

    /**
     * Po vyvolání removeTrigger se vybraná grafika smaže
     * TODO: fix comment
     * @exports Canvas
     * @function removeTrigger
     */
    useEffect(() => {
        redraw(graphics, ctx);
    }, [graphics]);

    // TODO: comment
    useEffect(() => {
        if (selectedGraphic != null) {
            drawSelected(selectedGraphic, ctx);
        }
    }, [selectedGraphic])
    
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
            const newGraphics = turning(e.key, graphics);
            setGraphics(newGraphics);
        }
    };

    /**
     * Provádí pohyb robotů na plátně dokud nedojdou všichni do cíle, nebo dokud není simulace pozastavena uživatelem.
     * @exports Canvas
     * @function simulate
     */
    async function simulate(){
        if (!correct()) return;
        if (someCollision(graphics)){
            Warning('Výchozí pozice robota koliduje se zdí.');
        }
        while (!isAllDone(graphics) && playStatus){
            const newGraphics = simulateStep(graphics);
            setGraphics(newGraphics);
            await new Promise(res => setTimeout(res, 25));
        }
        //finished
        if (isAllDone(graphics)){
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
        return {x: (e.pageX - (canvas.current?.offsetLeft ?? 0)),y : (e.pageY - (canvas.current?.offsetTop ?? 0))};;
    }

    /**
     * Podle vybrané operace vloží novou grafiku nebo vybere již existující
     * @exports Canvas
     * @function onClick
     * @param e {React.MouseEvent} Kliknutí myší
     */
    function onClick(e : React.MouseEvent){
        const position = getPosition(e);
        let newGraphics = graphics;
        switch (operation){
            case OperationType.Cursor:
                selectGraphic(position);
                break;
            case OperationType.Wall:
                if (selectedSize.height < 10 || selectedSize.width < 10){
                    Error('Zeď musí mít minimální výšku a šířku 10');
                    return;
                } 
                newGraphics = [...newGraphics, new Wall(position, selectedSize)];
                break;
            case OperationType.Finish:
                newGraphics = [...newGraphics, new Finish(position)];
                break;
            default:
                newGraphics = [...newGraphics, new Robot(position, movementType)];
                break;
        }     
        setGraphics(newGraphics);
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
        if (detectGraphic(position, graphics) === selectedGraphic) {
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
        // TODO: toto mozna nebude fungovat
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
        redraw(graphics, ctx);
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
        const selected = detectGraphic(position, graphics);
        callSelected(selected ?? null);
    }

    return (
        <div>
            <canvas onClick={onClick} onMouseDown={dragMouseDown} onMouseUp={dragMouseUp}
            ref={canvas} height={canvasSize.height} width={canvasSize.width} style={{backgroundColor: 'white', cursor: cursor}}/>
        </div>
    );
}