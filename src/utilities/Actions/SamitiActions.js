import { db } from "../../firebase-config.js";
import { collection, onSnapshot, query } from "firebase/firestore";

export function readSamiti(q, state, dispatch) {
    return onSnapshot(q, (querySnapshot) => {
        querySnapshot.docs.map(doc => {
            const collectionName = doc.data().name;
            const seriesName = doc.data().place;
            const categoryId = doc.id;
            return onSnapshot(query(collection(db, `samiti/${collectionName}/${seriesName}`)),
                (snapshot) => {
                    console.log("its inside second snapshot"); 
                    let collections = state.samiti;
                    let action = null;
                    let updatedValue= null;
                    snapshot.docChanges().forEach((change) => {
                        if (change.type === "added") {
                            console.log("New member: ", change.doc.data());
                            collections = [...collections, {...change.doc.data(), id: change.doc.id}];
                            action="added";
                        }
                        if (change.type === "modified") {
                            console.log("Modified member: ", change.doc.data());
                            updatedValue = {...change.doc.data(), id:change.doc.id};
                            action="modified";
                        }
                        if (change.type === "removed") {
                            console.log("Removed member: ", change.doc.data());
                            updatedValue = {...change.doc.data(), id:change.doc.id};
                            action="removed";
                        }
                      });
                    switch(action){
                        case "added":
                            dispatch({ type: "SET_SAMITI", value: {name: collectionName, id: categoryId, place: seriesName, members: collections} });
                            break;
                        case "modified":
                            dispatch({type: "UPDATE_SAMITI", value: updatedValue});
                            break;
                        case "removed":
                            dispatch({type: "REMOVE_SAMITI", value: updatedValue});
                            break;
                        default:
                            return ;
                    }   
                });
        });
    });
}


// export function readSamiti(q, state, dispatch){
//     return onSnapshot(query(collection(db, `samiti`)),
//             (snapshot)=>{
//                 let collections = state.samiti;
//                 let action = null;
//                 let updatedValue = null;
//                 snapshot.docChanges().forEach((change)=>{
//                     if (change.type === "added") {
//                        // console.log("New kharcha: ", change.doc.data());
//                         collections = [...collections, {...change.doc.data(), id: change.doc.id, date: (new Timestamp(change.doc.data().date.seconds, change.doc.data().date.nanoseconds)).toDate().toLocaleDateString('en-GB')}];
//                         action="added";
//                     }
//                     if (change.type === "modified") {
//                         console.log("Modified kharcha: ", change.doc.data());
//                         updatedValue = {...change.doc.data(), id:change.doc.id};
//                         action="modified";
//                     }
//                     if (change.type === "removed") {
//                         console.log("Removed kharcha: ", change.doc.data());
//                         updatedValue = {...change.doc.data(), id:change.doc.id};
//                         action="removed";
//                     }
//                 });
//                 switch(action){
//                     case "added":
//                         dispatch({ type: "SET_KHARCHA", value: collections });
//                         break;
//                     case "modified":
//                         dispatch({type: "UPDATE_KHARCHA", value: updatedValue});
//                         break;
//                     case "removed":
//                         dispatch({type: "REMOVE_KHARCHA", value: updatedValue});
//                         break;
//                     default:
//                         return ;
//                 } 
//             });
       
// }