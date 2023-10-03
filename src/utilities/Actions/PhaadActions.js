import { db } from "../../firebase-config.js";
import { collection, onSnapshot, query } from "firebase/firestore";


export function readPhaad(q, state, dispatch){
    return onSnapshot(q, (queryResult)=>{
        queryResult.docs.map(doc => {
            const dayId = doc.data().name;
            return onSnapshot(query(collection(db, `phaad/${dayId}/firms`)),
            (snapshot)=>{
                let collections = state.phaad;
                let action = null;
                let updatedValue = null;
                snapshot.docChanges().forEach((change)=>{
                    if (change.type === "added") {
                        console.log("New firm: ", change.doc.data());
                        collections = [...collections, {...change.doc.data(), id: change.doc.id}];
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
                        dispatch({ type: "SET_PHAAD", value: collections });
                        break;
                    case "modified":
                        dispatch({type: "UPDATE_PHAAD", value: updatedValue});
                        break;
                    case "removed":
                        dispatch({type: "REMOVE_LAMINATES", value: updatedValue});
                        break;
                    default:
                        return ;
                } 
            });
        });
    });
}