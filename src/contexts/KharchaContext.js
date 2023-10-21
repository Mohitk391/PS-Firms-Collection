import { createContext, useContext, useEffect, useReducer } from "react";
import { KharchaReducer } from "../reducers/KharchaReducer";
import { readKharcha } from "../utilities/Actions/KharchaActions";
import { collection, orderBy, query } from "firebase/firestore";
import { db } from "../firebase-config";


const KharchaContext = createContext();

const initialState = {
  kharcha : [],
}


const KharchaProvider = ({children}) => {
    const [kharchaState, kharchaDispatch] = useReducer(KharchaReducer, initialState);

    useEffect(()=>{
        const kharchaQuery = query(collection(db, "kharcha"), orderBy("date", "desc"));

        const unsubscribeKharcha = readKharcha(kharchaQuery, kharchaState, kharchaDispatch);

        return ()=>{
            unsubscribeKharcha();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return (
        <KharchaContext.Provider value={{kharchaState, kharchaDispatch}}>
            {children}
        </KharchaContext.Provider>
    )
}

const useKharcha = () => useContext(KharchaContext);

export {KharchaProvider, useKharcha}