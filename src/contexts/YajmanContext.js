import { createContext, useContext, useEffect, useReducer } from "react";
import { YajmanReducer } from "../reducers/YajmanReducer";
import { collection, query } from "firebase/firestore";
import { db } from "../firebase-config";
import { readYajman } from "../utilities/Actions/YajmanActions";


const YajmanContext = createContext();

const initialState = {
    yajman : []
}


const YajmanProvider = ({children}) => {
    const [yajmanState, yajmanDispatch] = useReducer(YajmanReducer, initialState);

    useEffect(()=>{
        const yajmanQuery = query(collection(db, "yajman"));

        const unsubscribeYajman = readYajman(yajmanQuery, yajmanState, yajmanDispatch);

        return ()=>{
            unsubscribeYajman();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return (
        <YajmanContext.Provider value={{yajmanState, yajmanDispatch}}>
            {children}
        </YajmanContext.Provider>
    )
}

const useYajman = () => useContext(YajmanContext);

export {YajmanProvider, useYajman}