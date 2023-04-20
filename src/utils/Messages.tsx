/**
 * Obsahuje veškerou logiku vypisování zpráv pomocí knihovny react-toastify
 * @module Messages
 * @category Utils
 */

import { toast } from "react-toastify";

/**
 * Vypíše chybovou hlášku
 * @category Utils
 * @param msg {String} Text zprávy
 */
export function Error(msg: String){
    toast.error(msg, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
}

/**
 * Vypíše úspěšnou hlášku
 * @category Utils
 * @param msg {String} Text zprávy
 */
export function Success(msg: String){
    toast.success(msg, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
}

/**
 * Vypíše varovnou hlášku
 * @category Utils
 * @param msg {String} Text zprávy
 */
export function Warning(msg : String){
    toast.warn(msg, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
}