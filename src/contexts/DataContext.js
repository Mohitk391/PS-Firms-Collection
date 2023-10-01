import { createContext, useContext, useEffect, useReducer } from "react";
import { DataReducer } from "../reducers/DataReducer";
import { collection, query } from "firebase/firestore";
import { db } from "../firebase-config";
import { readPhaad } from "../utilities/Actions/PhaadActions";
import { readSikshanidhi } from "../utilities/Actions/SikshanidhiActions";
import { readDatar } from "../utilities/Actions/DatarActions";

const DataContext = createContext();

const initialState = {
    phaad: [],
    sikshanidhi: [],
    datar: []
}

const DataProvider = ({children}) => {
    const [dataState, dataDispatch] = useReducer(DataReducer, initialState);

    useEffect(()=>{
        const phaadQuery = query(collection(db, "phaad"));
        const sikshanidhiQuery = query(collection(db, "sikshanidhi"));
        const datarQuery = query(collection(db, "datar"));

        const unsubscribePhaad = readPhaad(phaadQuery, dataState, dataDispatch);
        const unsubscribeSikshanidhi = readSikshanidhi(sikshanidhiQuery, dataState, dataDispatch);
        const unsubscribeDatar = readDatar(datarQuery, dataState, dataDispatch);

        return ()=>{
            unsubscribePhaad();
            unsubscribeSikshanidhi();
            unsubscribeDatar();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return (<DataContext.Provider value={{dataState, dataDispatch}}>
        {children}
    </DataContext.Provider>);
}

const useData = () => useContext(DataContext);

export {DataProvider, useData};