import { collection, orderBy, query } from "firebase/firestore";
import { createContext, useContext, useEffect, useReducer } from "react";
import { db } from "../firebase-config";
import { AllFirmsReducer } from "../reducers/AllFirmsReducer";
import { readAllFirms } from "../utilities/Actions/AllFirmsActions";


const AllFirmsContext = createContext();

const initialState = {
    allFirms: [],
}

const AllFirmsProvider = ({children}) => {
    const [allFirmsState, allFirmsDispatch] = useReducer(AllFirmsReducer, initialState);

    useEffect(()=>{
        const allFirmsQuery = query(collection(db, "allFirms"), orderBy("name"));
       
        const unsubscribeAllFirms = readAllFirms(allFirmsQuery, allFirmsState, allFirmsDispatch);

        return ()=>{
          unsubscribeAllFirms();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])


    return (
        <AllFirmsContext.Provider value={{allFirmsState, allFirmsDispatch}}>
            {children}
        </AllFirmsContext.Provider>
    )
}

const useAllFirms = () => useContext(AllFirmsContext);

export {AllFirmsProvider, useAllFirms}