import {data} from "./data/data";
import Login from "./pages/authentication/Login";
import { Route, Routes } from "react-router-dom";
import Collections from "./pages/collections/Collections";
import { useEffect } from "react";

function App() {
  useEffect(()=>{
    localStorage.setItem("data", JSON.stringify(data));
  },[]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/collections" element={<Collections />} />
      </Routes>
    </div>
  );
}

export default App;
