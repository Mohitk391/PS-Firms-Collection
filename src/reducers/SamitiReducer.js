const SamitiReducer = (dataState, action) => {
    switch(action.type){
        case "SET_SAMITI":
            return {...dataState, samiti: action.value};
        case "UPDATE_SAMITI":
            return {...dataState, samiti : updateCollection(dataState.samiti, action.value)};
        case "REMOVE_SAMITI":
            return {...dataState, samiti : removeCollection(dataState.samiti, action.value)};
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

export {SamitiReducer}