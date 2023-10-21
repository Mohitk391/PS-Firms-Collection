import { createContext, useContext, useEffect, useReducer } from "react";
import { PhaadReducer } from "../reducers/PhaadReducer";
import { collection, orderBy, query } from "firebase/firestore";
import { db } from "../firebase-config";
import { readPhaad } from "../utilities/Actions/PhaadActions";


const PhaadContext = createContext();

const initialState = {
    phaad: []
}


const PhaadProvider = ({children}) => {
    const [phaadState, phaadDispatch] = useReducer(PhaadReducer, initialState);

    useEffect(()=>{
        const phaadQuery = query(collection(db, "phaad"), orderBy("date"));

        const unsubscribePhaad = readPhaad(phaadQuery, phaadState, phaadDispatch);

        return ()=>{
            unsubscribePhaad();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return (
        <PhaadContext.Provider value={{phaadState, phaadDispatch}}>
            {children}
        </PhaadContext.Provider>
    )
}

const usePhaad = () => useContext(PhaadContext);

export {PhaadProvider, usePhaad}