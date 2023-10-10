import { onSnapshot} from "firebase/firestore";

export function readAllFirms(q, state, dispatch){
    return onSnapshot(q, (snapshot)=>{
        let firms = state.allFirms;
        let action = null;
        let updatedValue = null;
        snapshot.docChanges().forEach((change)=>{
            if (change.type === "added") {
                console.log("New firm: ", change.doc.data());
                firms = [...firms, {...change.doc.data(), id: change.doc.id}];
                action="added";
            }
            if (change.type === "modified") {
                console.log("Modified firm: ", change.doc.data());
                updatedValue = {...change.doc.data(), id:change.doc.id};
                action="modified";
            }
            if (change.type === "removed") {
                console.log("Removed firm: ", change.doc.data());
                updatedValue = {...change.doc.data(), id:change.doc.id};
                action="removed";
            }
        });
        switch(action){
            case "added":
                dispatch({ type: "SET_ALLFIRMS", value: firms });
                break;
            case "modified":
                dispatch({type: "UPDATE_ALLFIRMS", value: updatedValue});
                break;
            case "removed":
                dispatch({type: "REMOVE_ALLFIRMS", value: updatedValue});
                break;
            default:
                return ;
        } 
    })
}