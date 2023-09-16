const DataReducer = (dataState, action) => {
    switch(action.type){
        case "FAADO_SET":
            return dataState;
        case "SIKSHANIDHI_SET":
            return dataState;
        case "DATAR_SET":
            return dataState;
        default:
            return dataState;
    }
}

export {DataReducer}