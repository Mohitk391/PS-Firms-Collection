import { Timestamp, onSnapshot } from "firebase/firestore";


export function readDatar(q, state, dispatch){
    return onSnapshot(q,
            (snapshot)=>{
                let collections = state.datar;
                let action = null;
                let updatedValue = null;
                snapshot.docChanges().forEach((change)=>{
                    if (change.type === "added") {
                       // console.log("New firm: ", change.doc.data());
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
}