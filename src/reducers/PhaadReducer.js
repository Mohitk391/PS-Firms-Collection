const PhaadReducer = (dataState, action) => {
    switch(action.type){
        case "SET_PHAAD":
            return {...dataState, phaad: action.value};
        case "UPDATE_PHAAD":
            return {...dataState, phaad : updateCollection(dataState.phaad, action.value)};
        case "REMOVE_PHAAD":
            return {...dataState, phaad : removeCollection(dataState.phaad, action.value)};
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

export {PhaadReducer}