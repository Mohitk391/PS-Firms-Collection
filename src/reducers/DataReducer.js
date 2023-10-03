const DataReducer = (dataState, action) => {
    switch(action.type){
        case "SET_PHAAD":
            return {...dataState, phaad: action.value};
        case "UPDATE_PHAAD":
            return {};
        case "REMOVE_PHAAD":
            return {};
        case "SET_SIKSHANIDHI":
            return {...dataState, sikshanidhi: action.value};
        case "UPDATE_SIKSHANIDHI":
            return {};
        case "REMOVE_SIKSHANIDHI":
            return {};
        case "SET_DATAR":
            return {...dataState, datar: action.value};
        case "UPDATE_DATAR":
            return {};
        case "REMOVE_DATAR":
            return {};
        case "SET_ALLFIRMS":
            return {...dataState, allFirms: action.value};
        case "UPDATE_ALLFIRMS":
            return {};
        case "REMOVE_ALLFIRMS":
            return {};
        default:
            return dataState;
    }
}

export {DataReducer}