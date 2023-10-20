
const YajmanReducer = (dataState, action) => {
    switch(action.type){
        case "SET_YAJMAN":
            return {...dataState, yajman: action.value};
        case "UPDATE_YAJMAN":
            return {...dataState, yajman : updateCollection(dataState.yajman, action.value)};
        case "REMOVE_YAJMAN":
            return {...dataState, yajman : removeCollection(dataState.yajman, action.value)};
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

export {YajmanReducer}