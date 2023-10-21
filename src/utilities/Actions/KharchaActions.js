import { Timestamp, onSnapshot } from "firebase/firestore";


export function readKharcha(q, state, dispatch){
    return onSnapshot(q,
            (snapshot)=>{
                let collections = state.kharcha;
                let action = null;
                let updatedValue = null;
                snapshot.docChanges().forEach((change)=>{
                    if (change.type === "added") {
                       // console.log("New kharcha: ", change.doc.data());
                        collections = [...collections, {...change.doc.data(), id: change.doc.id, date: (new Timestamp(change.doc.data().date.seconds, change.doc.data().date.nanoseconds)).toDate().toLocaleDateString('en-GB')}];
                        action="added";
                    }
                    if (change.type === "modified") {
                        console.log("Modified kharcha: ", change.doc.data());
                        updatedValue = {...change.doc.data(), id:change.doc.id};
                        action="modified";
                    }
                    if (change.type === "removed") {
                        console.log("Removed kharcha: ", change.doc.data());
                        updatedValue = {...change.doc.data(), id:change.doc.id};
                        action="removed";
                    }
                });
                switch(action){
                    case "added":
                        dispatch({ type: "SET_KHARCHA", value: collections });
                        break;
                    case "modified":
                        dispatch({type: "UPDATE_KHARCHA", value: updatedValue});
                        break;
                    case "removed":
                        dispatch({type: "REMOVE_KHARCHA", value: updatedValue});
                        break;
                    default:
                        return ;
                } 
            });
        
}