import { db } from "../../firebase-config.js";
import { Timestamp, collection, onSnapshot, query } from "firebase/firestore";


export function readSikshanidhi(q, state, dispatch){
    return onSnapshot(q, (queryResult)=>{
        queryResult.docs.map(doc => {
            return onSnapshot(query(collection(db, `sikshanidhi`)),
            (snapshot)=>{
                let collections = state.sikshanidhi;
                let action = null;
                let updatedValue = null;
                snapshot.docChanges().forEach((change)=>{
                    if (change.type === "added") {
                        //console.log("New firm: ", change.doc.data());
                        collections = [...collections, {...change.doc.data(), id: change.doc.id, date: (new Timestamp(change.doc.data().date.seconds, change.doc.data().date.nanoseconds)).toDate().toLocaleDateString('en-GB')}];
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
                        dispatch({ type: "SET_SIKSHANIDHI", value: collections });
                        break;
                    case "modified":
                        dispatch({type: "UPDATE_SIKSHANIDHI", value: updatedValue});
                        break;
                    case "removed":
                        dispatch({type: "REMOVE_SIKSHANIDHI", value: updatedValue});
                        break;
                    default:
                        return ;
                } 
            });
        });
    });
}
