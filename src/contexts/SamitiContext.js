import { createContext, useContext, useEffect, useReducer } from "react";
import { SamitiReducer } from "../reducers/SamitiReducer";
import { collection, query } from "firebase/firestore";
import { db } from "../firebase-config";
import { readSamiti } from "../utilities/Actions/SamitiActions";


const SamitiContext = createContext();

const initialState = {
    samiti : []
}


const SamitiProvider = ({children}) => {
    const [samitiState, samitiDispatch] = useReducer(SamitiReducer, initialState);

    useEffect(()=>{
        const samitiQuery = query(collection(db, "samiti"));

        const unsubscribeSamiti = readSamiti(samitiQuery, samitiState, samitiDispatch);

        return ()=>{
            unsubscribeSamiti();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return (
        <SamitiContext.Provider value={{samitiState, samitiDispatch}}>
            {children}
        </SamitiContext.Provider>
    )
}

const useSamiti = () => useContext(SamitiContext);

export {SamitiProvider, useSamiti}