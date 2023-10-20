import { createContext, useContext, useEffect, useReducer } from "react";
import { DatarReducer } from "../reducers/DatarReducer";
import { readDatar } from "../utilities/Actions/DatarActions";
import { collection, query } from "firebase/firestore";
import { db } from "../firebase-config";


const DatarContext = createContext();

const initialState = {
   datar: []
}


const DatarProvider = ({children}) => {
    const [datarState, datarDispatch] = useReducer(DatarReducer, initialState);

    useEffect(()=>{
        const datarQuery = query(collection(db, "datar"));
       
        const unsubscribeDatar = readDatar(datarQuery, datarState, datarDispatch);

        return ()=>{
            unsubscribeDatar();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return (
        <DatarContext.Provider value={{datarState, datarDispatch}}>
            {children}
        </DatarContext.Provider>
    )
}

const useDatar = () => useContext(DatarContext);

export {DatarProvider, useDatar}