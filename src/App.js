import {data} from "./data/data";
import Login from "./pages/authentication/Login";
import { Route, Routes } from "react-router-dom";
import Datar from "./pages/collections/datar/Datar";
import Phaad from "./pages/collections/phaad/Phaad";
import Sikshanidhi from "./pages/collections/sikshanidhi/Sikshanidhi";
import { useEffect } from "react";
import Homepage from "./pages/homepage/Homepage";
import { RequiresAuth } from "./utilities/Auth/RequiresAuth";
import PhaadIndex from "./pages/collections/phaad/PhaadIndex";

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
        <Route path="phaad" element={
          <RequiresAuth>
            <PhaadIndex />
          </RequiresAuth>
        } />
        <Route path="phaad/:dayId" element={<Phaad />} />
        <Route path="/sikshanidhi" element={
          <RequiresAuth>
            <Sikshanidhi />
          </RequiresAuth>
        } />
        <Route path="/datar" element={
          <RequiresAuth>
            <Datar />
          </RequiresAuth>
        } />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
