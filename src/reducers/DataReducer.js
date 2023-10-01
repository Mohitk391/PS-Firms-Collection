const DataReducer = (dataState, action) => {
    switch(action.type){
        case "SET_PHAAD":
            return {...dataState, phaad: action.value};
        case "SIKSHANIDHI_SET":
            return {...dataState, sikshanidhi: action.value};
        case "DATAR_SET":
            return {...dataState, datar: action.value};
        default:
            return dataState;
    }
}

export {DataReducer}