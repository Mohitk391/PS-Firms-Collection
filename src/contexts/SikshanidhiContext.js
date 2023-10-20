import { createContext, useContext, useEffect, useReducer } from "react";
import { SikshanidhiReducer } from "../reducers/SikshanidhiReducer";
import { collection, query } from "firebase/firestore";
import { db } from "../firebase-config";
import { readSikshanidhi } from "../utilities/Actions/SikshanidhiActions";


const SikshanidhiContext = createContext();

const initialState = {
    sikshanidhi: []
}


const SikshanidhiProvider = ({children}) => {
    const [sikshanidhiState, sikshanidhiDispatch] = useReducer(SikshanidhiReducer, initialState);

    useEffect(()=>{
        const sikshanidhiQuery = query(collection(db, "sikshanidhi"));

        const unsubscribeSikshanidhi = readSikshanidhi(sikshanidhiQuery, sikshanidhiState, sikshanidhiDispatch);

        return ()=>{
            unsubscribeSikshanidhi();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return (
        <SikshanidhiContext.Provider value={{sikshanidhiState, sikshanidhiDispatch}}>
            {children}
        </SikshanidhiContext.Provider>
    )
}

const useSikshanidhi = () => useContext(SikshanidhiContext);

export {SikshanidhiProvider, useSikshanidhi}