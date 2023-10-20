const KharchaReducer = (dataState, action) => {
    switch(action.type){
        case "SET_KHARCHA":
            return {...dataState, kharcha: action.value};
        case "UPDATE_KHARCHA":
            return {...dataState, kharcha: updateCollection(dataState.kharcha, action.value)};
        case "REMOVE_KHARCHA":
            return {...dataState, kharcha: removeCollection(dataState.kharcha, action.value)};
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

export {KharchaReducer}