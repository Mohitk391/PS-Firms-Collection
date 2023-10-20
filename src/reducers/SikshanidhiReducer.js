const SikshanidhiReducer = (dataState, action) => {
    switch(action.type){
        case "SET_SIKSHANIDHI":
            return {...dataState, sikshanidhi: action.value};
        case "UPDATE_SIKSHANIDHI":
            return {...dataState, sikshanidhi: updateCollection(dataState.sikshanidhi, action.value)};
        case "REMOVE_SIKSHANIDHI":
            return {...dataState, sikshanidhi: removeCollection(dataState.sikshanidhi, action.value)};
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

export {SikshanidhiReducer}