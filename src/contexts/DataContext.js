import { createContext, useContext, useReducer } from "react";
import { DataReducer } from "../reducers/DataReducer";

const DataContext = createContext();

const initialState = {
    faado: [],
    sikshanidhi: [],
    datar: []
}

const DataProvider = ({children}) => {
    const [dataState, dataDispatch] = useReducer(DataReducer, initialState);


    return (<DataContext.Provider value={{dataState, dataDispatch}}>
        {children}
    </DataContext.Provider>);
}

const useData = () => useContext(DataContext);

export {DataProvider, useData};