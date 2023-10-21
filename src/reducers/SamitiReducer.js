const SamitiReducer = (dataState, action) => {
    switch(action.type){
        case "SET_SAMITI":
            return {...dataState, samiti: AddSamiti(dataState.samiti, action.value)};
        case "UPDATE_SAMITI":
            return {...dataState, samiti : UpdatedSamiti(dataState.samiti, action.value)};
        case "REMOVE_SAMITI":
            return {...dataState, samiti : RemoveSamiti(dataState.samiti, action.value)};
        case "REMOVE_SAMITI_MEMBER":
            return {...dataState, samiti : RemoveMember(dataState.samiti, action.value)};
        default:
            return dataState;
    }
}

const AddSamiti = (collections, current) => {
    if(collections.find(collection => collection.name === current.name)){
        return collections.map(collection=>{
            if(collection.name === current.name){
                if(collection.members.find(member => member.id === current.members[0].id)){
                    return collection;
                }
                else {
                    return {...collection, members: collection.members.concat(current.members)};
                }
            }
            return collection;
    });
    }
    else {
        return [...collections, current];
    }
}

const UpdatedSamiti = (collections, current) => {
    return collections.map(collection => collection.name === current.samitiName ?  {...collection, members: UpdateMember(collection.members, current)} : collection);
}

const UpdateMember = (memebers, current) => {
    return memebers.map(member => member.id === current.id ? current : member);
}

const RemoveMember = (collections, removed) => {
    return collections.map(collection => collection.name === removed.samitiName ? {...collection,  members: collection.members.filter(member => member.id !== removed.id)} : collection);
}

const RemoveSamiti = (collections, current)=> {
    return collections.filter(collection => collection.id !== current.id);
}


export {SamitiReducer}