import { db } from "../../firebase-config.js";
import { collection, addDoc, onSnapshot, query, updateDoc, doc, deleteDoc, setDoc, Timestamp  } from "firebase/firestore";


export function readDatar(q, state, dispatch){
    return onSnapshot(q, (queryResult)=>{
        queryResult.docs.map(doc => {
            const dayId = doc.data().name;
            return onSnapshot(query(collection(db, `datar/${dayId}/firms`)),
            (snapshot)=>{
                let collections = state.datar;
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
                        dispatch({ type: "SET_DATAR", value: collections });
                        break;
                    case "modified":
                        dispatch({type: "UPDATE_DATAR", value: updatedValue});
                        break;
                    case "removed":
                        dispatch({type: "REMOVE_DATAR", value: updatedValue});
                        break;
                    default:
                        return ;
                } 
            });
        });
    });
}