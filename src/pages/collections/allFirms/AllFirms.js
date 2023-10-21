import UmiyaMataji from "../../../assets/umiya-mataji.png";
import { useState } from "react";
import Pagination from "../../../utilities/Pagination/Pagination";
import { useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import Navbar from "../../../components/Navbar/Navbar";
import { useDatar } from "../../../contexts/DatarContext";
import { useAllFirms } from "../../../contexts/AllFirmsContext";
import { usePhaad } from "../../../contexts/PhaadContext";
import { useYajman } from "../../../contexts/YajmanContext";
import { useSikshanidhi } from "../../../contexts/SikshanidhiContext";
import { Link } from "react-router-dom";
import { Loader } from "../../../utilities/Loader/Loader"
import { Timestamp, addDoc, collection, deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase-config";

const ITEMS_PER_PAGE = 10;

const daysIndex = {
  "15/10/2023" : 1,
  "16/10/2023" : 2,
  "17/10/2023" : 3,
  "18/10/2023" : 4,
  "19/10/2023" : 5,
  "20/10/2023" : 6,
  "21/10/2023" : 7,
  "22/10/2023" : 8,
  "23/10/2023" : 9
}

const days = {
  1 : new Date("10/15/2023").toLocaleDateString("en-GB"),
  2 : new Date("10/16/2023").toLocaleDateString("en-GB"),
  3 : new Date("10/17/2023").toLocaleDateString("en-GB"),
  4 : new Date("10/18/2023").toLocaleDateString("en-GB"),
  5 : new Date("10/19/2023").toLocaleDateString("en-GB"),
  6 : new Date("10/20/2023").toLocaleDateString("en-GB"),
  7 : new Date("10/21/2023").toLocaleDateString("en-GB"),
  8 : new Date("10/22/2023").toLocaleDateString("en-GB"),
  9 : new Date("10/23/2023").toLocaleDateString("en-GB"),
}


const AllFirms = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentDetails, setCurrentDetails] = useState({name: "", place: "", phaadPrevious: 0, phaadCurrent: 0, phaadPayer: "", phaadMobile: "", phaadReciever: "", sikshanidhiPrevious: 0, sikshanidhiCurrent: 0, sikshanidhiPayer: "", sikshanidhiMobile: "", sikshanidhiReciever: "", aarti: 0, prasadi : 0, coupon : 0, aartiDate: "", aartiName: "", isAartiPaid: false, isPrasadiPaid : false, isCouponPaid : false, datarPayer: "", datarMobile : "", datarReciever : ""});
  const [newDetails, setNewDetails] = useState({name: "", place: "", phaadPrevious: 0, phaadCurrent: 0, phaadPayer: "", phaadMobile: "", phaadReciever: "", sikshanidhiPrevious: 0, sikshanidhiCurrent: 0, sikshanidhiPayer: "", sikshanidhiMobile: "", sikshanidhiReciever: "", aarti: 0, prasadi : 0, coupon : 0, aartiDate: "", aartiName: "", isAartiPaid: false, isPrasadiPaid : false, isCouponPaid : false, datarPayer: "", datarMobile : "", datarReciever : ""});
  const {datarState : {datar}} = useDatar();
  const {allFirmsState : {allFirms}} = useAllFirms();
  const {phaadState : {phaad}} = usePhaad();
  const {sikshanidhiState : {sikshanidhi}} = useSikshanidhi();
  const {yajmanState : {yajman}} = useYajman();
  const today = new Date().toLocaleDateString("en-GB");
  let elements = [];

  useEffect(()=> {
    if(allFirms) 
    {setLoading(false); 
       } 
    else
    setLoading(true)}
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ,[]);

    for(let i=daysIndex[today];i<=9;i++){
      elements.push(
        <option value={days[i]}>{days[i]}</option>
      )
    }

    useEffect(()=>{
      setResults(allFirms.filter((item)=>item.name.toLowerCase().includes(searchTerm.toLocaleLowerCase().trim()) || item.place.toLowerCase().includes(searchTerm.toLowerCase().trim()) ))
    },[searchTerm, allFirms]);
  
  const handleModalClose = () => {
    setCurrentDetails({name: "", place: "", phaadPrevious: 0, phaadCurrent: 0, phaadPayer: "", phaadMobile: "", phaadReciever: "", sikshanidhiPrevious: 0, sikshanidhiCurrent: 0, sikshanidhiPayer: "", sikshanidhiMobile: "", sikshanidhiReciever: "", aarti: 0, prasadi : 0, coupon : 0, aartiDate: "", aartiName: "", isAartiPaid: false, isPrasadiPaid : false, isCouponPaid : false, datarPayer: "", datarMobile : "", datarReciever : ""}); 
    setNewDetails({name: "", place: "", phaadPrevious: 0, phaadCurrent: 0, phaadPayer: "", phaadMobile: "", phaadReciever: "", sikshanidhiPrevious: 0, sikshanidhiCurrent: 0, sikshanidhiPayer: "", sikshanidhiMobile: "", sikshanidhiReciever: "", aarti: 0, prasadi : 0, coupon : 0, aartiDate: "", aartiName: "", isAartiPaid: false, isPrasadiPaid : false, isCouponPaid : false, datarPayer: "", datarMobile : "", datarReciever : ""});
    setSearchTerm('');
  };

// While saving any new firm with either of only phaad, only sikshanidhi or both, add today's date as the respective collection's date . For example for only phaad add today's date as phaadDate.
// For only phaad or only sikshanidhi, make sure to add blank values for the other collection. For example,  for only phaad, add all sikshanidhi values as blank(apprpriately) and vice-versa.

  const saveNewFirm = async () => {
    console.log(newDetails);
    console.log(searchTerm);
    await setDoc(doc(db, "allFirms", newDetails.name), newDetails);

    if(newDetails.phaadCurrent>0){
      await setDoc(doc(db, "phaad", newDetails.name), {
        name: newDetails.name,
        place: newDetails.place,
        previous : newDetails.phaadPrevious,
        current : newDetails.phaadCurrent,
        payer : newDetails.phaadPayer,
        mobile : newDetails.phaadMobile,
        reciever : newDetails.phaadReciever,
        date : Timestamp.fromDate(new Date())
      });
    }

    if(newDetails.sikshanidhiCurrent>0){
      await setDoc(doc(db, "sikshanidhi", newDetails.name), {
        name: newDetails.name,
        place: newDetails.place,
        previous : newDetails.sikshanidhiPrevious,
        current : newDetails.sikshanidhiCurrent,
        payer : newDetails.sikshanidhiPayer,
        mobile : newDetails.sikshanidhiMobile,
        reciever : newDetails.sikshanidhiReciever,
        date : Timestamp.fromDate(new Date())
      });
    }

    if(newDetails.prasadi>0){
      await addDoc(collection(db, "datar"), {
        name: newDetails.name,
        place: newDetails.place,
        data : "prasadi",
        amount : newDetails.prasadi,
        isPrasadiPaid: newDetails.isPrasadiPaid,
        payer : newDetails.datarPayer,
        mobile : newDetails.datarMobile,
        reciever : newDetails.datarReciever,
        date : Timestamp.fromDate(new Date())
      });
    }

    if(newDetails.aarti>0){
      await addDoc(collection(db, "datar"), {
        name: newDetails.name,
        place: newDetails.place,
        data : "aarti",
        aartiDate : newDetails.aartiDate,
        aartiName : newDetails.aartiName,
        amount: newDetails.aarti,
        isAartiPaid: newDetails.isAartiPaid,
        payer : newDetails.datarPayer,
        mobile : newDetails.datarMobile,
        reciever : newDetails.datarReciever,
        date : Timestamp.fromDate(new Date())
      });

      await addDoc(collection(db, "yajman"), {
        name: newDetails.name,
        aartiName : newDetails.aartiName,
        aartiDate  : newDetails.aartiDate,
        place: newDetails.place
      })
    }

    if(newDetails.coupon>0){
      await addDoc(collection(db, "datar"), {
        name: newDetails.name,
        place: newDetails.place,
        data: "coupon",
        amount: newDetails.coupon,
        isCouponPaid: newDetails.isCouponPaid,
        payer : newDetails.datarPayer,
        mobile : newDetails.datarMobile,
        reciever : newDetails.datarReciever,
        date : Timestamp.fromDate(new Date())
      });
    }

    setNewDetails({name: "", place: "", phaadPrevious: 0, phaadCurrent: 0, phaadPayer: "", phaadMobile: "", phaadReciever: "", sikshanidhiPrevious: 0, sikshanidhiCurrent: 0, sikshanidhiPayer: "", aartiDate: "", aartiName: "", isAartiPaid: false, isPrasadiPaid : false, isCouponPaid : false,  sikshanidhiMobile: "", sikshanidhiReciever: "", aarti: 0, prasadi : 0, coupon : 0, datarPayer: "", datarMobile : "", datarReciever : ""});
    setSearchTerm('');
    document.getElementById("newFirmClose").click();
  }

  const saveNewFirmPhaad = async () => {
    await setDoc(doc(db, "allFirms", newDetails.name), newDetails)

    if(newDetails.phaadCurrent>0){
        await setDoc(doc(db, "phaad", newDetails.name), {
        name: newDetails.name,
        place: newDetails.place,
        previous : newDetails.phaadPrevious,
        current : newDetails.phaadCurrent,
        payer : newDetails.phaadPayer,
        mobile : newDetails.phaadMobile,
        reciever : newDetails.phaadReciever,
        date : Timestamp.fromDate(new Date())
      });
    }

    setNewDetails({name: "", place: "", phaadPrevious: 0, phaadCurrent: 0, phaadPayer: "", phaadMobile: "", phaadReciever: "", sikshanidhiPrevious: 0, sikshanidhiCurrent: 0, sikshanidhiPayer: "", sikshanidhiMobile: "", sikshanidhiReciever: "", aarti: 0, prasadi : 0, coupon : 0, aartiName: "", isAartiPaid: false, isPrasadiPaid : false, isCouponPaid : false,  datarPayer: "", datarMobile : "", datarReciever : ""});
    setSearchTerm('');
    document.getElementById("newPhaadClose").click();
  }

  const saveNewFirmSikshanidhi = async () => {
    await setDoc(doc(db, "allFirms", newDetails.name), newDetails);

    if(newDetails.sikshanidhiCurrent>0){
        await setDoc(doc(db, "sikshanidhi", newDetails.name), {
        name: newDetails.name,
        place: newDetails.place,
        previous : newDetails.sikshanidhiPrevious,
        current : newDetails.sikshanidhiCurrent,
        payer : newDetails.sikshanidhiPayer,
        mobile : newDetails.sikshanidhiMobile,
        reciever : newDetails.sikshanidhiReciever,
        date : Timestamp.fromDate(new Date())
      });
    }

    setNewDetails({name: "", place: "", phaadPrevious: 0, phaadCurrent: 0, phaadPayer: "", phaadMobile: "", phaadReciever: "", sikshanidhiPrevious: 0, sikshanidhiCurrent: 0, sikshanidhiPayer: "", sikshanidhiMobile: "", sikshanidhiReciever: "", aarti: 0, prasadi : 0, coupon : 0, aartiDate: "", aartiName: "", isAartiPaid: false, isPrasadiPaid : false, isCouponPaid : false,  datarPayer: "", datarMobile : "", datarReciever : ""});
    setSearchTerm('');
    document.getElementById("newSikshanidhiClose").click();
  }

  const saveNewFirmDatar = async () => {
    await setDoc(doc(db, "allFirms", newDetails.name), newDetails);

    if(newDetails.prasadi>0){
        await addDoc(collection(db, "datar"), {
        name: newDetails.name,
        place: newDetails.place,
        data : "prasadi",
        amount : newDetails.prasadi,
        isPrasadiPaid: newDetails.isPrasadiPaid,
        payer : newDetails.datarPayer,
        mobile : newDetails.datarMobile,
        reciever : newDetails.datarReciever,
        date : Timestamp.fromDate(new Date())
      });
    }

    if(newDetails.aarti>0){
      await addDoc(collection(db, "datar"), {
        name: newDetails.name,
        place: newDetails.place,
        data : "aarti",
        aartiDate : newDetails.aartiDate,
        aartiName : newDetails.aartiName,
        amount: newDetails.aarti,
        isAartiPaid: newDetails.isAartiPaid,
        payer : newDetails.datarPayer,
        mobile : newDetails.datarMobile,
        reciever : newDetails.datarReciever,
        date : Timestamp.fromDate(new Date())
      });

      await addDoc(collection(db, "yajman"), {
        name: newDetails.name,
        aartiName : newDetails.aartiName,
        aartiDate  : newDetails.aartiDate,
        place: newDetails.place
      })
    }

    if(newDetails.coupon>0){
      await addDoc(collection(db, "datar"), {
        name: newDetails.name,
        place: newDetails.place,
        data: "coupon",
        amount: newDetails.coupon,
        isCouponPaid: newDetails.isCouponPaid,
        payer : newDetails.datarPayer,
        mobile : newDetails.datarMobile,
        reciever : newDetails.datarReciever,
        date : Timestamp.fromDate(new Date())
      });
    }

    setNewDetails({name: "", place: "", phaadPrevious: 0, phaadCurrent: 0, phaadPayer: "", phaadMobile: "", phaadReciever: "", sikshanidhiPrevious: 0, sikshanidhiCurrent: 0, sikshanidhiPayer: "", sikshanidhiMobile: "", sikshanidhiReciever: "", aarti: 0, prasadi : 0, coupon : 0, aartiDate: "", aartiName: "", isAartiPaid: false, isPrasadiPaid : false, isCouponPaid : false,  datarPayer: "", datarMobile : "", datarReciever : ""});
    setSearchTerm('');
    document.getElementById("newDatarClose").click();
    
  }

  const saveUpdatedFirm = async () => {
      let updatingAllBody = {};
      let updatingPhaadBody = {};
      let updatingSikshanidhiBody = {};
      const currentFirm = allFirms.find(firm => firm.name === currentDetails?.name);
      console.log(currentFirm);
      if(currentDetails?.sikshanidhiPrevious !== currentFirm.sikshanidhiPrevious){ 
        updatingAllBody = {...updatingAllBody, sikshanidhiPrevious: currentDetails?.sikshanidhiPrevious}
        updatingSikshanidhiBody = {...updatingSikshanidhiBody, previous: currentDetails?.sikshanidhiPrevious}
      }
      if(currentDetails?.sikshanidhiCurrent !== currentFirm.sikshanidhiCurrent){
        updatingSikshanidhiBody = {...updatingSikshanidhiBody, current: currentDetails?.sikshanidhiCurrent}
        updatingAllBody = {...updatingAllBody, sikshanidhiCurrent: currentDetails?.sikshanidhiCurrent}
      }
      if(currentDetails?.sikshanidhiPayer !== currentFirm.sikshanidhiPayer){
        updatingSikshanidhiBody = {...updatingSikshanidhiBody, payer: currentDetails?.sikshanidhiPayer}
        updatingAllBody = {...updatingAllBody, sikshanidhiPayer: currentDetails?.sikshanidhiPayer}
      }
      if(currentDetails?.sikshanidhiMobile !== currentFirm.sikshanidhiMobile){
        updatingSikshanidhiBody = {...updatingSikshanidhiBody, mobile: currentDetails?.sikshanidhiMobile}
        updatingAllBody = {...updatingAllBody, sikshanidhiMobile: currentDetails?.sikshanidhiMobile}
      }
      if(currentDetails?.sikshanidhiReciever !== currentFirm.sikshanidhiReciever){
        console.log("inside reciever");
        updatingSikshanidhiBody = {...updatingSikshanidhiBody, reciever: currentDetails?.sikshanidhiReciever}
        updatingAllBody = {...updatingAllBody, sikshanidhiReciever: currentDetails?.sikshanidhiReciever}
      }
      if(currentDetails?.phaadPrevious !== currentFirm.phaadPrevious){ 
        updatingAllBody = {...updatingAllBody, phaadPrevious: currentDetails?.phaadPrevious}
        updatingPhaadBody = {...updatingPhaadBody, previous: currentDetails?.phaadPrevious}
      }
      if(currentDetails?.phaadCurrent !== currentFirm.phaadCurrent){
        updatingAllBody = {...updatingAllBody, phaadCurrent: currentDetails?.phaadCurrent}
        updatingPhaadBody = {...updatingPhaadBody, current: currentDetails?.phaadCurrent}
      }
      if(currentDetails?.phaadPayer !== currentFirm.phaadPayer){
        updatingAllBody = {...updatingAllBody, phaadPayer: currentDetails?.phaadPayer}
        updatingPhaadBody = {...updatingPhaadBody, payer: currentDetails?.phaadPayer}
      }
      if(currentDetails?.phaadMobile !== currentFirm.phaadMobile){
        updatingAllBody = {...updatingAllBody, phaadMobile: currentDetails?.phaadMobile}
        updatingPhaadBody = {...updatingPhaadBody, mobile: currentDetails?.phaadMobile}
      }
      if(currentDetails?.phaadReciever !== currentFirm.phaadReciever){
        updatingAllBody = {...updatingAllBody, phaadReciever: currentDetails?.phaadReciever}
        updatingPhaadBody = {...updatingPhaadBody, reciever: currentDetails?.phaadReciever}
      }
      if(currentDetails?.prasadi !== currentFirm.prasadi || currentDetails?.aarti !== currentFirm.aarti || currentDetails?.coupon !== currentFirm.coupon){
        updatingAllBody = {...updatingAllBody, datarPayer: currentDetails?.datarPayer, datarMobile: currentDetails?.datarMobile, datarReciever: currentDetails?.datarReciever}
      }
      if(currentDetails?.prasadi !== currentFirm.prasadi){
        updatingAllBody = currentDetails?.isPrasadiPaid ? {...updatingAllBody, prasadi: currentDetails?.prasadi, isPrasadiPaid : currentDetails?.isPrasadiPaid} : {...updatingAllBody, prasadi: currentDetails?.prasadi};
        if(!(datar.find(firm => firm.data === "prasadi" && firm.name === currentDetails?.name)))
        await addDoc(collection(db, "datar"), {name: currentDetails?.name, place: currentDetails?.place, data: "prasadi", amount: currentDetails?.prasadi, payer: currentDetails?.datarPayer, mobile: currentDetails?.datarMobile, reciever: currentDetails?.datarReciever, isPrasadiPaid : currentDetails?.isPrasadiPaid, date : Timestamp.fromDate(new Date())});
      }
      if(currentDetails?.isPrasadiPaid !== currentFirm.isPrasadiPaid && currentDetails?.prasadi === currentFirm.prasadi && currentDetails?.prasadi > 0){
        updatingAllBody = {...updatingAllBody, isPrasadiPaid : currentDetails?.isPrasadiPaid};
        const datarFirm = datar.find(firm=>firm.name === currentDetails?.name && firm.data === "prasadi");
        await updateDoc(doc(db, "datar", datarFirm.id), {
          isPrasadiPaid: currentDetails?.isPrasadiPaid
        });
      }
      if(currentDetails?.aarti !== currentFirm.aarti){
        updatingAllBody = currentDetails?.isAartiPaid ? {...updatingAllBody, aarti: currentDetails?.aarti, isAartiPaid: currentDetails?.isAartiPaid, aartiName: currentDetails?.aartiName} : {...updatingAllBody, aarti: currentDetails?.aarti, aartiName: currentDetails?.aartiName};
        if(!(datar.find(firm => firm.data === "aarti" && firm.name === currentDetails?.name))){
          await addDoc(collection(db, "datar"), {name: currentDetails?.name, place: currentDetails?.place, data: "aarti", aartiDate: currentDetails?.aartiDate, amount: currentDetails?.aarti, isAartiPaid: currentDetails?.isAartiPaid, aartiName: currentDetails?.aartiName, payer: currentDetails?.datarPayer, mobile: currentDetails?.datarMobile, reciever: currentDetails?.datarReciever, date : Timestamp.fromDate(new Date())});
          await addDoc(collection(db, "yajman"), {
            name : currentDetails?.name,
            place : currentDetails?.place,
            aartiDate : currentDetails?.aartiDate,
            aartiName : currentDetails?.aartiName
          })
        }
        else{
            let updatedDatar = {};
            let updatedYajman = {};
            if(currentDetails?.name !== currentFirm.name){
               updatedDatar = {...updatedDatar, name : currentDetails?.name};
               updatedYajman = {...updatedYajman, name : currentDetails?.name};
            }
            if(currentDetails?.place !== currentFirm.place){
               updatedDatar = {...updatedDatar, place : currentDetails?.place}
               updatedYajman = {...updatedYajman, place : currentDetails?.place}
            }
            if(currentDetails?.aartiDate !== currentFirm.aartiDate){
               updatedDatar = {...updatedDatar, aartiDate : currentDetails?.aartiDate}
               updatedYajman = {...updatedYajman, aartiDate : currentDetails?.aartiDate}
            }
            if(currentDetails?.aartiName !== currentFirm.aartiName){
               updatedDatar = {...updatedDatar, aartiName : currentDetails?.aartiName}
               updatedYajman = {...updatedYajman, aartiName : currentDetails?.aartiName}
            }
            if(currentDetails?.amount !== currentFirm.amount) updatedDatar = {...updatedDatar, amount : currentDetails?.amount}
            if(currentDetails?.datarPayer !== currentFirm.datarPayer) updatedDatar = {...updatedDatar, payer : currentDetails?.datarPayer}
            if(currentDetails?.isAartiPaid !== currentFirm.isAartiPaid) updatedDatar = {...updatedDatar, isAartiPaid : currentDetails?.isAartiPaid}
            if(currentDetails?.datarMobile !== currentFirm.datarMobile) updatedDatar = {...updatedDatar, mobile : currentDetails?.datarMobile}
            if(currentDetails?.datarReciever !== currentFirm.datarReciever) updatedDatar = {...updatedDatar, reciever : currentDetails?.datarReciever}
    
          await updateDoc(doc(db, "datar", datar.find(firm => firm.data === "aarti" && firm.name === currentDetails?.name).id), updatedDatar);
          if(Object.keys(updatedYajman).length>0){
            await updateDoc(doc(db, "yajman", yajman.find(yajman => yajman.aartiDate === currentFirm.aartiDate && yajman.name === currentFirm.name)), updatedYajman)
          }
        }

      }
      if(currentDetails?.isAartiPaid !== currentFirm.isAartiPaid && currentDetails?.aarti === currentFirm.aarti && currentDetails?.aarti > 0){
        updatingAllBody = {...updatingAllBody, isAartiPaid : currentDetails?.isAartiPaid};
        const datarFirm = datar.find(firm=>firm.name === currentDetails?.name && firm.data === "aarti");
        await updateDoc(doc(db, "datar", datarFirm.id), {
          isAartiPaid: currentDetails?.isAartiPaid
        });
      }
      if(currentDetails?.coupon !== currentFirm.coupon){
        updatingAllBody = currentDetails?.isCouponPaid ? {...updatingAllBody, coupon: currentDetails?.coupon, isCouponPaid: currentDetails?.isCouponPaid} : {...updatingAllBody, coupon: currentDetails?.coupon};
        if(!(datar.find(firm => firm.data === "coupon" && firm.name === currentDetails?.name)))
        await addDoc(collection(db, "datar"), {name: currentDetails?.name, place: currentDetails?.place, data: "coupon", amount: currentDetails?.coupon, payer: currentDetails?.datarPayer, mobile: currentDetails?.datarMobile, reciever: currentDetails?.datarReciever, isCouponPaid: currentDetails?.isCouponPaid, date : Timestamp.fromDate(new Date())});
      }
      if(currentDetails?.isCouponPaid !== currentFirm.isCouponPaid && currentDetails?.coupon === currentFirm.coupon && currentDetails?.coupon > 0){
        updatingAllBody = {...updatingAllBody, isCouponPaid : currentDetails?.isCouponPaid};
        const datarFirm = datar.find(firm=>firm.name === currentDetails?.name && firm.data === "coupon");
        await updateDoc(doc(db, "datar", datarFirm.id), {
          isCouponPaid: currentDetails?.isCouponPaid
        });
      }


      await updateDoc(doc(db,"allFirms", currentDetails?.name), updatingAllBody);

      if(Object.keys(updatingPhaadBody).length>0){
          if(!(Object.keys(updatingPhaadBody).length===1 && updatingPhaadBody.hasProperty("phaadPrevious"))){
            if(phaad.find(firm => firm.name === currentDetails?.name))
              await updateDoc(doc(db,"phaad", currentDetails?.name), updatingPhaadBody);
            else
              await setDoc(doc(db,"phaad", currentDetails?.name), {
                name: currentDetails?.name,
                place: currentDetails?.place,
                previous : currentDetails?.phaadPrevious,
                current : currentDetails?.phaadCurrent,
                payer : currentDetails?.phaadPayer,
                mobile : currentDetails?.phaadMobile,
                reciever : currentDetails?.phaadReciever,
                date : Timestamp.fromDate(new Date())
              });
            }
      }
        
      if(Object.keys(updatingSikshanidhiBody).length>0){
        if(sikshanidhi.find(firm => firm.name === currentDetails?.name))
          await updateDoc(doc(db, "sikshanidhi", currentDetails?.name), updatingSikshanidhiBody);
        else  
          await setDoc(doc(db, "sikshanidhi", currentDetails?.name), {
            name: currentDetails?.name,
            place: currentDetails?.place,
            previous : currentDetails?.sikshanidhiPrevious,
            current : currentDetails?.sikshanidhiCurrent,
            payer : currentDetails?.sikshanidhiPayer,
            mobile : currentDetails?.sikshanidhiMobile,
            reciever : currentDetails?.sikshanidhiReciever,
            date : Timestamp.fromDate(new Date())
          });
      }

      document.getElementById("updateFirmClose").click();
  }

  const deleteFirm = async (name) => {
    await deleteDoc(doc(db, "allFirms", name));
    if(phaad.find(firm=>firm.name===name))
      await deleteDoc(doc(db, "phaad", name));
    if(sikshanidhi.find(firm=>firm.name===name))
      await deleteDoc(doc(db, "sikshanidhi", name));
  }
  
  useEffect(() => {
    const modalElement = document.getElementById('updateDetails');
    const newFirmModalElement = document.getElementById('addNew');
    const newFirmDatarModalElement = document.getElementById('addNewDatar');
    const newFirmPhaadModalElement = document.getElementById('addNewPhaad');
    const newFirmSikshanidhiModalElement = document.getElementById('addNewSikshanidhi');
    const indexClose1 = document.getElementById("indexClose1");
    const indexClose2 = document.getElementById("indexClose2");
    modalElement.addEventListener('hidden.bs.modal', handleModalClose);
    newFirmModalElement.addEventListener('hidden.bs.modal', handleModalClose);
    newFirmDatarModalElement.addEventListener('hidden.bs.modal', handleModalClose);
    newFirmPhaadModalElement.addEventListener('hidden.bs.modal', handleModalClose);
    newFirmSikshanidhiModalElement.addEventListener('hidden.bs.modal', handleModalClose);
    indexClose1.addEventListener('click', handleModalClose);
    indexClose2.addEventListener('click', handleModalClose);

    return () => {
      modalElement.removeEventListener('hidden.bs.modal', handleModalClose);
      newFirmModalElement.removeEventListener('hidden.bs.modal', handleModalClose);
      newFirmDatarModalElement.removeEventListener('hidden.bs.modal', handleModalClose);
      newFirmPhaadModalElement.removeEventListener('hidden.bs.modal', handleModalClose);
      newFirmSikshanidhiModalElement.removeEventListener('hidden.bs.modal', handleModalClose);
      indexClose1.removeEventListener('click', handleModalClose);
      indexClose2.removeEventListener('click', handleModalClose);
    };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [results]);

  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = results.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const downloadTable = () => {
    const doc = new jsPDF();
    doc.text(`All Firms Details`, 15, 12);
    autoTable(doc, { html: '#fullDataTable' });
    doc.save('All Firms Details.pdf')
  }


  return (
    <div className="App d-flex flex-column min-vh-100">
     <Navbar />
      <main className="container mt-3 flex-fill">
          <div className="d-flex justify-content-between mb-2">
            <div className="header">
              <span className="h2">All Firms</span>
            </div>
            <input className="py-0 px-3 border rounded-4 border-opacity-50" type="text" placeholder="Search" value={searchTerm} onChange={event=>setSearchTerm(event.target.value)} />
           { results?.length > 0 ? <button onClick={downloadTable} className="btn btn-outline-dark" title="Download Records PDF"><i className="bi bi-file-earmark-arrow-down-fill"></i></button> : <button className="invisible pe-none"></button>}
          </div>
          { loading ? <Loader loading={loading} /> :
          results.length > 0 ? (
            <table className="table table-bordered table-hover" id="collectionTable">
              <thead>
                <tr>
                  <th className="col-3 text-center border-3 align-middle" rowSpan={2}>Firm Name</th>
                  <th className="col-2 text-center border-3 align-middle" rowSpan={2}>Place</th>
                  <th className="col-3 text-center border-3" colSpan={2}>Phaado</th>
                  <th className="col-3 text-center border-3" colSpan={2}>Sikshanidhi</th>
                  <th className="col-2 text-center border-3 align-middle" rowSpan={2}>Parsadi</th>
                  <th className="col-2 text-center border-3 align-middle" rowSpan={2}>Aarti</th>
                  <th className="col-2 text-center border-3 align-middle" rowSpan={2}>Coupon</th>
                  <th className="col-2 text-center border-3 align-middle" rowSpan={2}>Actions</th>
                </tr>
                <tr>
                  <th className="text-center border-3">Prev (2022)</th>
                  <th className="text-center border-3">Curr (2023)</th>
                  <th className="text-center border-3">Prev (2022)</th>
                  <th className="text-center border-3">Curr (2023)</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((firm) => {
                  return (
                    <tr  key={firm.id}>
                      <td role="button" className="fw-bold border-3" data-bs-toggle="modal" data-bs-target="#updateDetails" onClick={()=>setCurrentDetails(firm)}>{firm.name}</td>
                      <td className="text-center border-3">{firm.place}</td>
                      <td className="border-3 text-center border-3">
                        {firm.phaadPrevious >0 ? firm.phaadPrevious : "-"}
                      </td>
                      <td className="text-center border-3">{firm.phaadCurrent >0 ? firm.phaadCurrent : "-"}</td>
                      <td className="border-3 text-center border-3">
                        {firm.sikshanidhiPrevious >0 ? firm.sikshanidhiPrevious : "-"}
                      </td>
                      <td className="text-center border-3">{firm.sikshanidhiCurrent >0 ? firm.sikshanidhiCurrent : "-"}</td>
                      <td className="text-center border-3">{firm.prasadi >0 ? (firm.isPrasadiPaid ? firm.prasadi : "Booked") : "-"}</td>
                      <td className="text-center border-3">{firm.aarti >0 ? (firm.isAartiPaid ? firm.aarti : "Booked") : "-"}</td>
                      <td className="text-center border-3">{firm.coupon >0 ? (firm.isCouponPaid ? firm.coupon : "Booked") : "-"}</td>
                     <td className="text-center border-3 d-flex gap-3 justify-content-center">
                      <i className="bi bi-trash3-fill" title="Delete Firm" onClick={()=>deleteFirm(firm.name)}></i>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="d-flex flex-column align-items-center justify-content-center">
              <p>No records found</p>
              <button
                type="button"
                className="btn btn-outline-success"
                data-bs-toggle="modal"
                data-bs-target="#addNewIndex"
                onClick={()=>setNewDetails({...newDetails, name: searchTerm})}
              >
                Add New Firm
              </button>
            </div>
          )}

          {results.length > ITEMS_PER_PAGE && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
      </main>
      <footer className="page-footer shadow-lg border-top">
        <div className="d-flex flex-wrap justify-content-between align-items-center mx-auto py-4">
          <div className="d-flex flex-wrap align-items-center justify-content-start">
            <Link href="/" className="d-flex align-items-center p-0 text-dark gap-0">
              <img alt="logo" className="mx-3" src={UmiyaMataji} width="40"/>
              <span className="h5 mb-0 font-weight-bold">Patidar Yuva Mandal</span>
            </Link> 
          </div>
          <div className="pe-3 d-flex gap-3">
            <button className="btn btn-dark rounded-5">
              <i className="bi bi-facebook"></i>
            </button>
            <button className="btn btn-dark rounded-5">
              <i className="bi bi-twitter"></i>
            </button>
            <button className="btn btn-dark rounded-5">
              <i className="bi bi-instagram"></i>
            </button>
          </div>
        </div>
      </footer>
      <div className="modal fade" id="updateDetails" tabIndex="-1" aria-labelledby="updateDetailsLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-fullscreen">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="updateDetailsLabel">Firm Details</h5>
              <button type="button" className="btn-close" id="updateFirmClose"  data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                <div className="mb-3 row">
                    <label htmlFor="name" className="col-sm-2 col-form-label">Firm Name</label>
                    <div className="col-sm-10">
                    <input type="text" className="form-control" id="name" value={currentDetails?.name} onChange={e=>setCurrentDetails({...currentDetails, name: e.target.value})}/>
                    </div>
                </div>
                <div className="mb-3 row">
                  <label htmlFor="place" className="col-sm-2 col-form-label">Place</label>
                  <div className="col-sm-10">
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="radio" name="inlineRadioOptions" id="Bhanpuri" checked={currentDetails?.place === "Bhanpuri"} onChange={e=>setCurrentDetails({...currentDetails, place: "Bhanpuri"})}/>
                      <label className="form-check-label" htmlFor="Bhanpuri">Bhanpuri</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="radio" name="inlineRadioOptions" id="Fafadih" checked={currentDetails?.place === "Fafadih"} onChange={e=>setCurrentDetails({...currentDetails, place: "Fafadih"})}/>
                      <label className="form-check-label" htmlFor="Fafadih">Fafadih</label>
                    </div>
                  </div>
              </div>
                <div className="row">
                    <div className="table col-sm border border-2 me-2 pt-2 caption-top">
                        <caption><u><b>Phaado</b></u></caption>
                        <div className="mb-3 row">
                            <label htmlFor="phaadPrevious" className="col-sm-4 col-form-label">Previous (2022)</label>
                            <div className="col-sm-8">
                            <input type="number" min="0" placeholder="-" className="form-control" id="phaadPrevious" value={currentDetails?.phaadPrevious} onChange={e=>setCurrentDetails({...currentDetails, phaadPrevious: Number(e.target.value)})}/>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="phaadCurrent" className="col-sm-4 col-form-label">Current (2023)</label>
                            <div className="col-sm-8">
                            <input type="number" min="0" placeholder="-" className="form-control" id="phaadCurrent" value={currentDetails?.phaadCurrent} onChange={e=>setCurrentDetails({...currentDetails, phaadCurrent: Number(e.target.value)})}/>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="phaadPayerName" className="col-sm-4 col-form-label">Haste (Payer)</label>
                            <div className="col-sm-8">
                            <input type="text" placeholder="-" className="form-control" id="phaadPayerName" value={currentDetails?.phaadPayer} onChange={e=>setCurrentDetails({...currentDetails, phaadPayer: e.target.value})}/>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="phaadPayerNumber" className="col-sm-4 col-form-label">Mobile Number</label>
                            <div className="col-sm-8">
                            <input type="text" placeholder="-" className="form-control" id="phaadPayerNumber" value={currentDetails?.phaadMobile} onChange={e=>setCurrentDetails({...currentDetails, phaadMobile:  e.target.value})}/>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="phaadReceiver" className="col-sm-4 col-form-label">Haste (Receiver)</label>
                            <div className="col-sm-8">
                            <input type="text" placeholder="-" className="form-control" id="phaadReceiver" value={currentDetails?.phaadReciever} onChange={e=>setCurrentDetails({...currentDetails, phaadReciever: e.target.value})}/>
                            </div>
                        </div>
                    </div>
                    <div className="table col-sm border border-2 ms-2 me-2 pt-2 caption-top">
                        <caption><u><b>Sikshanidhi</b></u></caption>
                        <div className="mb-3 row">
                            <label htmlFor="sikshanidhiPrevious" className="col-sm-4 col-form-label">Previous (2022)</label>
                            <div className="col-sm-8">
                            <input type="number" min="0" placeholder="-" className="form-control" id="sikshanidhiPrevious" value={currentDetails?.sikshanidhiPrevious} onChange={e=>setCurrentDetails({...currentDetails, sikshanidhiPrevious: Number(e.target.value)})}/>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="sikshanidhiCurrent" className="col-sm-4 col-form-label">Current (2023)</label>
                            <div className="col-sm-8">
                            <input type="number" min="0" placeholder="-" className="form-control" id="sikshanidhiCurrent" value={currentDetails?.sikshanidhiCurrent} onChange={e=>setCurrentDetails({...currentDetails, sikshanidhiCurrent: Number(e.target.value)})}/>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="sikshanidhiPayerName" className="col-sm-4 col-form-label">Haste (Payer)</label>
                            <div className="col-sm-8">
                            <input type="text" placeholder="-" className="form-control" id="sikshanidhiPayerName" value={currentDetails?.sikshanidhiPayer} onChange={e=>setCurrentDetails({...currentDetails, sikshanidhiPayer: e.target.value})}/>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="sikshanidhiPayerNumber" className="col-sm-4 col-form-label">Mobile Number</label>
                            <div className="col-sm-8">
                            <input type="text" placeholder="-" className="form-control" id="sikshanidhiPayerNumber" value={currentDetails?.sikshanidhiMobile} onChange={e=>setCurrentDetails({...currentDetails, sikshanidhiMobile:  e.target.value})}/>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="sikshanidhiReceiver" className="col-sm-4 col-form-label">Haste (Receiver)</label>
                            <div className="col-sm-8">
                            <input type="text" placeholder="-" className="form-control" id="sikshanidhiReceiver" value={currentDetails?.sikshanidhiReciever} onChange={e=>setCurrentDetails({...currentDetails, sikshanidhiReciever: e.target.value})}/>
                            </div>
                        </div>
                    </div>
                    <div className="table col-sm border border-2 ms-2 pt-2 caption-top">
                        <caption><u><b>Datar</b></u></caption>
                            <div className="mb-3 row">
                                <label htmlFor="aartiDate" className="col-sm-4 col-form-label">Aarti Date</label>
                                <div className="col-sm-8">
                                <select class="form-select" id="aartiDate" aria-label="Default select example" value={currentDetails?.aartiDate} onChange={e=>setCurrentDetails({...currentDetails, aartiDate: e.target.value})}>
                                    <option></option>
                                    {elements.map(element => element)}
                                  </select>
                                </div>
                            </div>
                        {
                          currentDetails?.aartiDate ? 
                            (
                              <span>
                                <div className="mb-3 row">
                                    <label htmlFor="aartiName" className="col-sm-4 col-form-label">Aarti</label>
                                    <div className="col-sm-8">
                                    <select class="form-select" id="aartiName" aria-label="Default select example" onChange={e=>setCurrentDetails({...currentDetails, aartiName: e.target.value})}>
                                        <option ></option>
                                        <option value="pratham" selected={currentDetails?.aartiName === "pratham"}>Pratham (1st)</option>
                                        <option value="dritya" selected={currentDetails?.aartiName === "dritya"}>Biji (2nd)</option>
                                      </select>
                                    </div>
                                </div>
                                <div className="mb-3 row d-flex align-items-center">
                                  <label htmlFor="datarAarti" className="col-sm-2 col-form-label">Aarti Amount</label>
                                  <span className="col-sm-2 col-form-label">
                                    <input type="checkbox" className="btn-check" id="aarti" autocomplete="off" checked={currentDetails.isAartiPaid} onChange={e=>setCurrentDetails({...currentDetails, isAartiPaid: e.target.checked})}/>
                                    <label className="btn btn-outline-dark" for="aarti">Paid</label>
                                  </span>
                                  <div className="col-sm-8">
                                  <input type="number" min="0" placeholder="Amount" className="form-control" id="datarAarti" value={currentDetails?.aarti} onChange={e=>setCurrentDetails({...currentDetails, aarti: Number(e.target.value)})}/>
                                  </div>
                                </div>
                              </span>
                              
                            )
                            : null
                        }
                        <div className="mb-3 row d-flex align-items-center">
                            <label htmlFor="datarPrasadi" className="col-sm-2 col-form-label">Parsadi</label>
                            <span className="col-sm-2 col-form-label">
                              <input type="checkbox" className="btn-check" id="prasadi" autocomplete="off" checked={currentDetails.isPrasadiPaid} onChange={e=>setCurrentDetails({...currentDetails, isPrasadiPaid: e.target.checked})}/>
                              <label className="btn btn-outline-dark" for="prasadi">Paid</label>
                            </span>
                            <div className="col-sm-8">
                            <input type="number" min="0" placeholder="Amount" className="form-control" id="datarPrasadi" value={currentDetails?.prasadi} onChange={e=>setCurrentDetails({...currentDetails, prasadi: Number(e.target.value)})}/>
                            </div>
                        </div>
                        <div className="mb-3 row d-flex align-items-center">
                            <label htmlFor="datarCoupon" className="col-sm-2 col-form-label">Coupon</label>
                            <span className="col-sm-2 col-form-label">
                              <input type="checkbox" className="btn-check" id="coupon" autocomplete="off" checked={currentDetails.isCouponPaid} onChange={e=>setCurrentDetails({...currentDetails, isCouponPaid: e.target.checked})}/>
                              <label className="btn btn-outline-dark" for="coupon">Paid</label>
                            </span>
                            <div className="col-sm-8">
                            <input type="number" min="0" placeholder="Amount" className="form-control" id="datarCoupon" value={currentDetails?.coupon} onChange={e=>setCurrentDetails({...currentDetails, coupon: Number(e.target.value)})}/>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="datarPayerName" className="col-sm-4 col-form-label">Haste (Payer)</label>
                            <div className="col-sm-8">
                            <input type="text" placeholder="-" className="form-control" id="datarPayerName" value={currentDetails?.datarPayer} onChange={e=>setCurrentDetails({...currentDetails, datarPayer: e.target.value})}/>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="datarPayerNumber" className="col-sm-4 col-form-label">Mobile Number</label>
                            <div className="col-sm-8">
                            <input type="text" placeholder="-" className="form-control" id="datarPayerNumber" value={currentDetails?.datarMobile} onChange={e=>setCurrentDetails({...currentDetails, datarMobile:  e.target.value})}/>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="datarReceiver" className="col-sm-4 col-form-label">Haste (Receiver)</label>
                            <div className="col-sm-8">
                            <input type="text" placeholder="-" className="form-control" id="datarReceiver" value={currentDetails?.datarReciever} onChange={e=>setCurrentDetails({...currentDetails, datarReciever: e.target.value})}/>
                            </div>
                        </div>
                    </div>
                 </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={saveUpdatedFirm}>Save changes</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="addNewIndex" tabIndex="-1" aria-labelledby="addNewIndexLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addNewIndexLabel">Firm Details</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" id="indexClose1" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                <div className="mb-3 row">
                    <label htmlFor="name" className="col-sm-2 col-form-label">Firm Name</label>
                    <div className="col-sm-10">
                    <input type="text" className="form-control" id="name" value={newDetails?.name} onChange={e=>setNewDetails({...newDetails, name: e.target.value})}/>
                    </div>
                </div>
                <div className="mb-3 row">
                  <label htmlFor="place" className="col-sm-2 col-form-label">Type of Collection</label>
                  <div className="col-sm-10">
                    <div className="form-check form-check-inline">
                        <input type="radio"  name="Selector" className="form-check-input" id="phaadSelector" value="Phaad" data-bs-target="#addNewPhaad" data-bs-toggle="modal"/>
                        <label htmlFor="phaadSelector" className="form-check-label">Phaad</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input type="radio"  name="Selector" className="form-check-input" id="sikshanidhiSelector" value="Sikshanidhi" data-bs-target="#addNewSikshanidhi" data-bs-toggle="modal"/>
                        <label htmlFor="sikshanidhiSelector" className="form-check-label">Sikshanidhi</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input type="radio"  name="Selector" className="form-check-input" id="datarSelector" value="Datar" data-bs-target="#addNewDatar" data-bs-toggle="modal"/>
                        <label htmlFor="datarSelector" className="form-check-label">Aarti | Prasadi | Coupon</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input type="radio" name="Selector" className="form-check-input" id="allSelector" value="All" data-bs-target="#addNew" data-bs-toggle="modal"/>
                        <label htmlFor="allSelector" className="form-check-label">All</label>
                    </div>
                  </div>
                </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id="indexClose2">Close</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="addNew" tabIndex="-1" aria-labelledby="addNewLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addNewLabel">Firm Details</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" id="updateFirmClose" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                <div className="mb-3 row">
                    <label htmlFor="name" className="col-sm-2 col-form-label">Firm Name</label>
                    <div className="col-sm-10">
                    <input type="text" className="form-control" id="name" value={newDetails?.name} onChange={e=>setNewDetails({...newDetails, name: e.target.value})}/>
                    </div>
                </div>
                <div className="mb-3 row">
                  <label htmlFor="place" className="col-sm-2 col-form-label">Place</label>
                  <div className="col-sm-10">
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="radio" name="inlineRadioOptions" id="Bhanpuri" checked={newDetails?.place === "Bhanpuri"} onChange={e=>setNewDetails({...newDetails, place: "Bhanpuri"})}/>
                      <label className="form-check-label" htmlFor="Bhanpuri">Bhanpuri</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="radio" name="inlineRadioOptions" id="Fafadih" checked={newDetails?.place === "Fafadih"} onChange={e=>setNewDetails({...newDetails, place: "Fafadih"})}/>
                      <label className="form-check-label" htmlFor="Fafadih">Fafadih</label>
                    </div>
                  </div>
                </div>
                <div className="row">
                    <div className="table col-sm border border-2 me-2 pt-2 caption-top">
                        <caption><u><b>Phaado</b></u></caption>
                        <div className="mb-3 row">
                            <label htmlFor="phaadPrevious" className="col-sm-4 col-form-label">Previous (2022)</label>
                            <div className="col-sm-8">
                            <input type="number" min="0" placeholder="-" className="form-control" id="phaadPrevious" value={newDetails?.phaadPrevious} onChange={e=>setNewDetails({...newDetails, phaadPrevious: Number(e.target.value)})}/>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="phaadCurrent" className="col-sm-4 col-form-label">Current (2023)</label>
                            <div className="col-sm-8">
                            <input type="number" min="0" placeholder="-" className="form-control" id="phaadCurrent" value={newDetails?.phaadCurrent} onChange={e=>setNewDetails({...newDetails, phaadCurrent: Number(e.target.value)})}/>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="phaadPayerName" className="col-sm-4 col-form-label">Haste (Payer)</label>
                            <div className="col-sm-8">
                            <input type="text" placeholder="-" className="form-control" id="phaadPayerName" value={newDetails?.phaadPayer} onChange={e=>setNewDetails({...newDetails, phaadPayer: e.target.value})}/>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="phaadPayerNumber" className="col-sm-4 col-form-label">Mobile Number</label>
                            <div className="col-sm-8">
                            <input type="text" placeholder="-" className="form-control" id="phaadPayerNumber" value={newDetails?.phaadMobile} onChange={e=>setNewDetails({...newDetails, phaadMobile:  e.target.value})}/>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="phaadReceiver" className="col-sm-4 col-form-label">Haste (Receiver)</label>
                            <div className="col-sm-8">
                            <input type="text" placeholder="-" className="form-control" id="phaadReceiver" value={newDetails?.phaadReciever} onChange={e=>setNewDetails({...newDetails, phaadReciever: e.target.value})}/>
                            </div>
                        </div>
                    </div>
                    <div className="table col-sm border border-2 ms-2 me-2 pt-2 caption-top">
                        <caption><u><b>Sikshanidhi</b></u></caption>
                        <div className="mb-3 row">
                            <label htmlFor="sikshanidhiPrevious" className="col-sm-4 col-form-label">Previous (2022)</label>
                            <div className="col-sm-8">
                            <input type="number" min="0" placeholder="-" className="form-control" id="sikshanidhiPrevious" value={newDetails?.sikshanidhiPrevious} onChange={e=>setNewDetails({...newDetails, sikshanidhiPrevious: Number(e.target.value)})}/>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="sikshanidhiCurrent" className="col-sm-4 col-form-label">Current (2023)</label>
                            <div className="col-sm-8">
                            <input type="number" min="0" placeholder="-" className="form-control" id="sikshanidhiCurrent" value={newDetails?.sikshanidhiCurrent} onChange={e=>setNewDetails({...newDetails, sikshanidhiCurrent: Number(e.target.value)})}/>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="sikshanidhiPayerName" className="col-sm-4 col-form-label">Haste (Payer)</label>
                            <div className="col-sm-8">
                            <input type="text" placeholder="-" className="form-control" id="sikshanidhiPayerName" value={newDetails?.sikshanidhiPayer} onChange={e=>setNewDetails({...newDetails, sikshanidhiPayer: e.target.value})}/>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="sikshanidhiPayerNumber" className="col-sm-4 col-form-label">Mobile Number</label>
                            <div className="col-sm-8">
                            <input type="text" placeholder="-" className="form-control" id="sikshanidhiPayerNumber" value={newDetails?.sikshanidhiMobile} onChange={e=>setNewDetails({...newDetails, sikshanidhiMobile:  e.target.value})}/>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="sikshanidhiReceiver" className="col-sm-4 col-form-label">Haste (Receiver)</label>
                            <div className="col-sm-8">
                            <input type="text" placeholder="-" className="form-control" id="sikshanidhiReceiver" value={newDetails?.sikshanidhiReciever} onChange={e=>setNewDetails({...newDetails, sikshanidhiReciever: e.target.value})}/>
                            </div>
                        </div>
                    </div>
                    <div className="table col-sm border border-2 ms-2 pt-2 caption-top">
                        <caption><u><b>Datar</b></u></caption>
                        <div className="mb-3 row">
                            <label htmlFor="aartiDate" className="col-sm-4 col-form-label">Aarti Date</label>
                            <div className="col-sm-8">
                            <select class="form-select" id="aartiDate" aria-label="Default select example" onChange={e=>setCurrentDetails({...newDetails, aartiDate: e.target.value})}>
                                <option></option>
                                {elements.map(element => element)}
                              </select>
                            </div>
                        </div>
                        
                        {
                          newDetails?.aartiDate ? 
                            (
                              <span>
                                <div className="mb-3 row">
                                    <label htmlFor="aartiName" className="col-sm-4 col-form-label">Aarti</label>
                                    <div className="col-sm-8">
                                      <select class="form-select" id="aartiName" aria-label="Default select example" onChange={e=>setNewDetails({...newDetails, aartiName: e.target.value})}>
                                        <option selected></option>
                                        <option value="pratham">Pratham (1st)</option>
                                        <option value="dritya">Biji (2nd)</option>
                                      </select>
                                    </div>
                                </div>
                                <div className="mb-3 row d-flex align-items-center">
                                  <label htmlFor="datarAarti" className="col-sm-2 col-form-label">Aarti Amount</label>
                                  <span className="col-sm-2 col-form-label">
                                    <input type="checkbox" className="btn-check" id="aarti" autocomplete="off" checked={newDetails.isAartiPaid} onChange={e=>setNewDetails({...newDetails, isAartiPaid: e.target.checked})}/>
                                    <label className="btn btn-outline-dark" for="aarti">Paid</label>
                                  </span>
                                  <div className="col-sm-8">
                                  <input type="number" min="0" placeholder="Amount" className="form-control" id="datarAarti" value={newDetails?.datarAarti} onChange={e=>setNewDetails({...newDetails, datarAarti: Number(e.target.value)})}/>
                                  </div>
                                </div>
                              </span>
                              
                            )
                            : null
                        }
                        <div className="mb-3 row d-flex align-items-center">
                            <label htmlFor="datarPrasadi" className="col-sm-2 col-form-label">Parsadi</label>
                            <span className="col-sm-2 col-form-label">
                              <input type="checkbox" className="btn-check" id="prasadi" autocomplete="off" checked={newDetails.isPrasadiPaid} onChange={e=>setNewDetails({...newDetails, isPrasadiPaid: e.target.checked})}/>
                              <label className="btn btn-outline-dark" for="prasadi">Paid</label>
                            </span>
                            <div className="col-sm-8">
                            <input type="number" min="0" placeholder="Amount" className="form-control" id="datarPrasadi" value={newDetails?.datarPrasadi} onChange={e=>setNewDetails({...newDetails, datarPrasadi: Number(e.target.value)})}/>
                            </div>
                        </div>
                        <div className="mb-3 row d-flex align-items-center">
                            <label htmlFor="datarCoupon" className="col-sm-2 col-form-label">Coupon</label>
                            <span className="col-sm-2 col-form-label">
                              <input type="checkbox" className="btn-check" id="coupon" autocomplete="off" checked={newDetails.isCouponPaid} onChange={e=>setNewDetails({...newDetails, isCouponPaid: e.target.checked})}/>
                              <label className="btn btn-outline-dark" for="coupon">Paid</label>
                            </span>
                            <div className="col-sm-8">
                            <input type="number" min="0" placeholder="Amount" className="form-control" id="datarCoupon" value={newDetails?.datarCoupon} onChange={e=>setNewDetails({...newDetails, datarCoupon: Number(e.target.value)})}/>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="phaadPayerName" className="col-sm-4 col-form-label">Haste (Payer)</label>
                            <div className="col-sm-8">
                            <input type="text" placeholder="-" className="form-control" id="phaadPayerName" value={newDetails?.phaadPayer} onChange={e=>setNewDetails({...newDetails, phaadPayer: e.target.value})}/>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="phaadPayerNumber" className="col-sm-4 col-form-label">Mobile Number</label>
                            <div className="col-sm-8">
                            <input type="text" placeholder="-" className="form-control" id="phaadPayerNumber" value={newDetails?.phaadMobile} onChange={e=>setNewDetails({...newDetails, phaadMobile:  e.target.value})}/>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="phaadReceiver" className="col-sm-4 col-form-label">Haste (Receiver)</label>
                            <div className="col-sm-8">
                            <input type="text" placeholder="-" className="form-control" id="phaadReceiver" value={newDetails?.phaadReciever} onChange={e=>setNewDetails({...newDetails, phaadReciever: e.target.value})}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={()=>saveNewFirm()}>Add Firm</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="addNewPhaad" tabIndex="-1" aria-labelledby="addNewPhaadLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addNewPhaadLabel">Firm Details</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" id="newPhaadClose" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                <div className="mb-3 row">
                    <label htmlFor="name" className="col-sm-2 col-form-label">Firm Name</label>
                    <div className="col-sm-10">
                    <input type="text" className="form-control" id="name" value={newDetails?.name} onChange={e=>setNewDetails({...newDetails, name: e.target.value})}/>
                    </div>
                </div>
                <div className="mb-3 row">
                  <label htmlFor="place" className="col-sm-2 col-form-label">Place</label>
                  <div className="col-sm-10">
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="radio" name="inlineRadioOptions" id="Bhanpuri" checked={newDetails.place==="Bhanpuri"} onChange={e=>setNewDetails({...newDetails, place: "Bhanpuri"})}/>
                      <label className="form-check-label" htmlFor="Bhanpuri">Bhanpuri</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="radio" name="inlineRadioOptions" id="Fafadih" checked={newDetails.place==="Fafadih"} onChange={e=>setNewDetails({...newDetails, place: "Fafadih"})}/>
                      <label className="form-check-label" htmlFor="Fafadih">Fafadih</label>
                    </div>
                  </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="phaadPrevious" className="col-sm-2 col-form-label">Previous (2022)</label>
                    <div className="col-sm-10">
                    <input type="number" min="0" placeholder="-" className="form-control" id="phaadPrevious" value={newDetails?.phaadPrevious} onChange={e=>setNewDetails({...newDetails, phaadPrevious: Number(e.target.value)})}/>
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="phaadCurrent" className="col-sm-2 col-form-label">Current (2023)</label>
                    <div className="col-sm-10">
                    <input type="number" min="0" placeholder="-" className="form-control" id="phaadCurrent" value={newDetails?.phaadCurrent} onChange={e=>setNewDetails({...newDetails, phaadCurrent: Number(e.target.value)})}/>
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="phaadPayerName" className="col-sm-2 col-form-label">Haste (Payer)</label>
                    <div className="col-sm-10">
                    <input type="text" placeholder="-" className="form-control" id="phaadPayerName" value={newDetails?.phaadPayer} onChange={e=>setNewDetails({...newDetails, phaadPayer: e.target.value})}/>
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="phaadPayerNumber" className="col-sm-2 col-form-label">Mobile Number</label>
                    <div className="col-sm-10">
                    <input type="text" placeholder="-" className="form-control" id="phaadPayerNumber" value={newDetails?.phaadMobile} onChange={e=>setNewDetails({...newDetails, phaadMobile:  e.target.value})}/>
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="phaadReceiver" className="col-sm-2 col-form-label">Haste (Receiver)</label>
                    <div className="col-sm-10">
                    <input type="text" placeholder="-" className="form-control" id="phaadReceiver" value={newDetails?.phaadReciever} onChange={e=>setNewDetails({...newDetails, phaadReciever: e.target.value})}/>
                    </div>
                </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={()=>saveNewFirmPhaad(newDetails)}>Add Firm</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="addNewSikshanidhi" tabIndex="-1" aria-labelledby="addNewSikshanidhiLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addNewSikshanidhiLabel">Firm Details</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" id="newSikshanidhiClose" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                <div className="mb-3 row">
                    <label htmlFor="name" className="col-sm-2 col-form-label">Firm Name</label>
                    <div className="col-sm-10">
                    <input type="text" className="form-control" id="name" value={newDetails?.name} onChange={e=>setNewDetails({...newDetails, name: e.target.value})}/>
                    </div>
                </div>
                <div className="mb-3 row">
                  <label htmlFor="place" className="col-sm-2 col-form-label">Place</label>
                  <div className="col-sm-10">
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="radio" name="inlineRadioOptions" id="Bhanpuri" value="option1" onChange={e=>setNewDetails({...newDetails, place: "Bhanpuri"})}/>
                      <label className="form-check-label" htmlFor="Bhanpuri">Bhanpuri</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="radio" name="inlineRadioOptions" id="Fafadih" value="option2" onChange={e=>setNewDetails({...newDetails, place: "Fafadih"})}/>
                      <label className="form-check-label" htmlFor="Fafadih">Fafadih</label>
                    </div>
                  </div>
                </div> <div className="mb-3 row">
                  <label htmlFor="place" className="col-sm-2 col-form-label">Place</label>
                  <div className="col-sm-10">
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="radio" name="inlineRadioOptions" id="Bhanpuri" value="option1" onChange={e=>setNewDetails({...newDetails, place: "Bhanpuri"})}/>
                      <label className="form-check-label" htmlFor="Bhanpuri">Bhanpuri</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="radio" name="inlineRadioOptions" id="Fafadih" value="option2" onChange={e=>setNewDetails({...newDetails, place: "Fafadih"})}/>
                      <label className="form-check-label" htmlFor="Fafadih">Fafadih</label>
                    </div>
                  </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="sikshanidhiPrevious" className="col-sm-2 col-form-label">Previous (2022)</label>
                    <div className="col-sm-10">
                    <input type="number" min="0" placeholder="-" className="form-control" id="sikshanidhiPrevious" value={newDetails?.sikshanidhiPrevious} onChange={e=>setNewDetails({...newDetails, sikshanidhiPrevious: Number(e.target.value)})}/>
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="sikshanidhiCurrent" className="col-sm-2 col-form-label">Current (2023)</label>
                    <div className="col-sm-10">
                    <input type="number" min="0" placeholder="-" className="form-control" id="sikshanidhiCurrent" value={newDetails?.sikshanidhiCurrent} onChange={e=>setNewDetails({...newDetails, sikshanidhiCurrent: Number(e.target.value)})}/>
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="sikshanidhiPayerName" className="col-sm-2 col-form-label">Haste (Payer)</label>
                    <div className="col-sm-10">
                    <input type="text" placeholder="-" className="form-control" id="sikshanidhiPayerName" value={newDetails?.sikshanidhiPayer} onChange={e=>setNewDetails({...newDetails, sikshanidhiPayer: e.target.value})}/>
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="sikshanidhiPayerNumber" className="col-sm-2 col-form-label">Mobile Number</label>
                    <div className="col-sm-10">
                    <input type="text" placeholder="-" className="form-control" id="sikshanidhiPayerNumber" value={newDetails?.sikshanidhiMobile} onChange={e=>setNewDetails({...newDetails, sikshanidhiMobile:  e.target.value})}/>
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="sikshanidhiReceiver" className="col-sm-2 col-form-label">Haste (Receiver)</label>
                    <div className="col-sm-10">
                    <input type="text" placeholder="-" className="form-control" id="sikshanidhiReceiver" value={newDetails?.sikshanidhiReciever} onChange={e=>setNewDetails({...newDetails, sikshanidhiReciever: e.target.value})}/>
                    </div>
                </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={()=>saveNewFirmSikshanidhi(newDetails)}>Add Firm</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="addNewDatar" tabIndex="-1" aria-labelledby="addNewDatarLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addNewDatarLabel">Firm Details</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" id="newDatarClose" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                <div className="mb-3 row">
                    <label htmlFor="name" className="col-sm-2 col-form-label">Firm Name</label>
                    <div className="col-sm-10">
                    <input type="text" className="form-control" id="name" value={newDetails?.name} onChange={e=>setNewDetails({...newDetails, name: e.target.value})}/>
                    </div>
                </div>
                <div className="mb-3 row">
                  <label htmlFor="place" className="col-sm-2 col-form-label">Place</label>
                  <div className="col-sm-10">
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="radio" name="inlineRadioOptions" id="Bhanpuri" checked={newDetails.place==="Bhanpuri"} onChange={e=>setNewDetails({...newDetails, place: "Bhanpuri"})}/>
                      <label className="form-check-label" htmlFor="Bhanpuri">Bhanpuri</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="radio" name="inlineRadioOptions" id="Fafadih" checked={newDetails.place==="Fafadih"} onChange={e=>setNewDetails({...newDetails, place: "Fafadih"})}/>
                      <label className="form-check-label" htmlFor="Fafadih">Fafadih</label>
                    </div>
                  </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="aartiDate" className="col-sm-4 col-form-label">Aarti Date</label>
                    <div className="col-sm-8">
                    <select class="form-select" id="aartiDate" aria-label="Default select example" onChange={e=>setCurrentDetails({...newDetails, aartiDate: e.target.value})}>
                        <option></option>
                        {elements.map(element => element)}
                      </select>
                    </div>
                </div>
                
                {
                  newDetails?.aartiDate ? 
                    (
                      <span>
                        <div className="mb-3 row">
                            <label htmlFor="aartiName" className="col-sm-4 col-form-label">Aarti</label>
                            <div className="col-sm-8">
                              <select class="form-select" id="aartiName" aria-label="Default select example" onChange={e=>setNewDetails({...newDetails, aartiName: e.target.value})}>
                                <option selected></option>
                                <option value="pratham">Pratham (1st)</option>
                                <option value="dritya">Biji (2nd)</option>
                              </select>
                            </div>
                        </div>
                        <div className="mb-3 row d-flex align-items-center">
                          <label htmlFor="datarAarti" className="col-sm-2 col-form-label">Aarti Amount</label>
                          <span className="col-sm-2 col-form-label">
                            <input type="checkbox" className="btn-check" id="aarti" autocomplete="off" checked={newDetails.isAartiPaid} onChange={e=>setNewDetails({...newDetails, isAartiPaid: e.target.checked})}/>
                            <label className="btn btn-outline-dark" for="aarti">Paid</label>
                          </span>
                          <div className="col-sm-8">
                          <input type="number" min="0" placeholder="Amount" className="form-control" id="datarAarti" value={newDetails?.datarAarti} onChange={e=>setNewDetails({...newDetails, datarAarti: Number(e.target.value)})}/>
                          </div>
                        </div>
                      </span>
                      
                    )
                    : null
                }
                 <div className="mb-3 row ">
                    <label htmlFor="parsadi" className="col-sm-1 col-form-label">Parsadi</label>
                    <span className="col-sm-1 col-form-label">
                      <input type="checkbox" className="btn-check" id="aarti" autocomplete="off" checked={newDetails.isPrasadiPaid} onChange={e=>setNewDetails({...newDetails, isPrasadiPaid: e.target.checked})}/>
                      <label className="btn btn-outline-dark" for="aarti">Paid</label>
                    </span>
                    <div className="col-sm-10">
                    <input type="number" min="0" placeholder="-" className="form-control" id="f" value={newDetails?.prasadi} onChange={e=>setNewDetails({...newDetails, prasadi: Number(e.target.value)})}/>
                    </div>
                </div>
                <div className="mb-3 row ">
                    <label htmlFor="coupon" className="col-sm-1 col-form-label">Coupon</label>
                    <span className="col-sm-1 col-form-label">
                      <input type="checkbox" className="btn-check" id="aarti" autocomplete="off" checked={newDetails.isCouponPaid} onChange={e=>setNewDetails({...newDetails, isCouponPaid: e.target.checked})}/>
                      <label className="btn btn-outline-dark" for="aarti">Paid</label>
                    </span>
                    <div className="col-sm-10">
                    <input type="number" min="0" placeholder="-" className="form-control" id="coupon" value={newDetails?.coupon} onChange={e=>setNewDetails({...newDetails, coupon: Number(e.target.value)})}/>
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="datarPayerName" className="col-sm-2 col-form-label">Haste (Payer)</label>
                    <div className="col-sm-10">
                    <input type="text" placeholder="-" className="form-control" id="datarPayerName" value={newDetails?.datarPayer} onChange={e=>setNewDetails({...newDetails, datarPayer: e.target.value})}/>
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="datarPayerNumber" className="col-sm-2 col-form-label">Mobile Number</label>
                    <div className="col-sm-10">
                    <input type="text" placeholder="-" className="form-control" id="datarPayerNumber" value={newDetails?.datarMobile} onChange={e=>setNewDetails({...newDetails, datarMobile:  e.target.value})}/>
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="datarReceiver" className="col-sm-2 col-form-label">Haste (Receiver)</label>
                    <div className="col-sm-10">
                    <input type="text" placeholder="-" className="form-control" id="datarReceiver" value={newDetails?.datarReciever} onChange={e=>setNewDetails({...newDetails, datarReciever: e.target.value})}/>
                    </div>
                </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={()=>saveNewFirmDatar()}>Add Firm</button>
            </div>
          </div>
        </div>
      </div>
      <table className="table table-bordered" id="fullDataTable" style={{display: 'none'}}>
              <thead>
                <tr>
                  <th className="col-3 text-center border-3 align-middle" rowSpan={2}>Firm Name</th>
                  <th className="col-2 text-center border-3 align-middle" rowSpan={2}>Place</th>
                  <th className="col-3 text-center border-3" colSpan={2}>Phaad</th>
                  <th className="col-3 text-center border-3" colSpan={2}>Sikshanidhi</th>
                  <th className="col-3 text-center border-3 align-middle" rowSpan={2}>Prasadi</th>
                  <th className="col-2 text-center border-3 align-middle" rowSpan={2}>Aarti</th>
                  <th className="col-3 text-center border-3 align-middle" rowSpan={2}>Coupon</th>
                </tr>
                <tr>
                  <th className="text-center border-3">Prev (2022)</th>
                  <th className="text-center border-3">Curr (2023)</th>
                  <th className="text-center border-3">Prev (2022)</th>
                  <th className="text-center border-3">Curr (2023)</th>
                </tr>
              </thead>
              <tbody>
                {results.map((firm) => {
                  return (
                    <tr  key={firm.id}>
                      <td role="button" className="fw-bold border-3" data-bs-toggle="modal" data-bs-target="#updateDetails" onClick={()=> setCurrentDetails(firm)}>{firm.name}</td>
                      <td className="text-center border-3">{firm.place}</td>
                      <td className="border-3 text-center border-3">
                        {firm.phaadPrevious >0 ? firm.phaadPrevious : "-"}
                      </td>
                      <td className="text-center border-3">{firm.phaadCurrent >0 ? firm.phaadCurrent : "-"}</td>
                      <td className="border-3 text-center border-3">
                        {firm.sikshanidhiPrevious >0 ? firm.sikshanidhiPrevious : "-"}
                      </td>
                      <td className="text-center border-3">{firm.sikshanidhiCurrent >0 ? firm.sikshanidhiCurrent : "-"}</td>
                      <td className="text-center border-3">{firm.prasadi >0 ? firm.prasadi : "-"}</td>
                      <td className="text-center border-3">{firm.aarti >0 ? firm.aarti : "-"}</td>
                      <td className="text-center border-3">{firm.coupon >0 ? firm.coupon : "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
      </table>
    </div>
  );
}

export default AllFirms;
