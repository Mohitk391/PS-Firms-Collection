const DataReducer = (dataState, action) => {
    switch(action.type){
        case "SET_PHAAD":
            return {...dataState, phaad: action.value};
        case "UPDATE_PHAAD":
            return {...dataState, phaad : updateCollection(dataState.phaad, action.value)};
        case "REMOVE_PHAAD":
            return {...dataState, phaad : removeCollection(dataState.phaad, action.value)};
        case "SET_SIKSHANIDHI":
            return {...dataState, sikshanidhi: action.value};
        case "UPDATE_SIKSHANIDHI":
            return {...dataState, sikshanidhi: updateCollection(dataState.sikshanidhi, action.value)};
        case "REMOVE_SIKSHANIDHI":
            return {...dataState, sikshanidhi: removeCollection(dataState.sikshanidhi, action.value)};
        case "SET_DATAR":
            return {...dataState, datar: action.value};
        case "UPDATE_DATAR":
            return {...dataState, datar: updateCollection(dataState.datar, action.value)};
        case "REMOVE_DATAR":
            return {...dataState, datar: removeCollection(dataState.datar, action.value)};
        case "SET_KHARCHA":
            return {...dataState, kharcha: action.value};
        case "UPDATE_KHARCHA":
            return {...dataState, kharcha: updateCollection(dataState.kharcha, action.value)};
        case "REMOVE_KHARCHA":
            return {...dataState, kharcha: removeCollection(dataState.kharcha, action.value)};
        case "SET_ALLFIRMS":
            return {...dataState, allFirms: action.value};
        case "UPDATE_ALLFIRMS":
            return {...dataState, allFirms: updateCollection(dataState.allFirms, action.value)};
        case "REMOVE_ALLFIRMS":
            return {...dataState, allFirms: removeCollection(dataState.allFirms, action.value)};
        default:
            return dataState;
    }
}

const updateCollection = (collection, updatedFirm) => {
    return collection.map(firm => firm.id === updatedFirm.id ? updatedFirm : firm);
}

const removeCollection = (collection, removedFirm) => {
    return collection.filter(firm => firm.id !== removedFirm.id);
}

export {DataReducer}