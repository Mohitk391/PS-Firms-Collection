import {data} from "./data/data";
import Login from "./pages/authentication/Login";
import { Route, Routes } from "react-router-dom";
import Datar from "./pages/collections/datar/Datar";
import Faado from "./pages/collections/faado/Faado";
import Sikshanidhi from "./pages/collections/sikshanidhi/Sikshanidhi";
import { useEffect } from "react";
import Homepage from "./pages/homepage/Homepage";
import { RequiresAuth } from "./utilities/Auth/RequiresAuth";

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
        <Route path="/faado" element={
          <RequiresAuth>
            <Faado />
          </RequiresAuth>
        } />
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
