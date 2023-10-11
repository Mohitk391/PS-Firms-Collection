import {data} from "./data/data";
import Login from "./pages/authentication/Login";
import { Route, Routes } from "react-router-dom";
import Datar from "./pages/collections/datar/Datar";
import Phaad from "./pages/collections/phaad/Phaad";
import AllFirms from "./pages/collections/allFirms/AllFirms";
import Sikshanidhi from "./pages/collections/sikshanidhi/Sikshanidhi";
import { useEffect } from "react";
import Homepage from "./pages/homepage/Homepage";
import { RequiresAuth } from "./utilities/Auth/RequiresAuth";
import PhaadIndex from "./pages/collections/phaad/PhaadIndex";
import SikshanidhiIndex from "./pages/collections/sikshanidhi/SikshanidhiIndex";
import DatarIndex from "./pages/collections/datar/DatarIndex";

function App() {
  useEffect(()=>{
    localStorage.setItem("data", JSON.stringify(data));
  },[]);

  return (
    <div className="App">
       <Routes>
        <Route path="/" element={
          <RequiresAuth>
            <Homepage />
          </RequiresAuth>
        } />
        <Route path="allFirms" element={
          <RequiresAuth>
            <AllFirms />
          </RequiresAuth>
        } />
        <Route path="phaad" element={
          <RequiresAuth>
            <PhaadIndex />
          </RequiresAuth>
        } />
        <Route path="phaad/:dayId" element={<Phaad />} />

        <Route path="/sikshanidhi" element={
          <RequiresAuth>
            <SikshanidhiIndex />
          </RequiresAuth>
        } />
        <Route path="sikshanidhi/:dayId" element={<Sikshanidhi />} />

        <Route path="/datar" element={
          <RequiresAuth>
            <DatarIndex />
          </RequiresAuth>
        } />
        <Route path="datar/:dayId" element={<Datar />} />

        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
