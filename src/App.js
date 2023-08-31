import Login from "./pages/authentication/Login";
import { Route, Routes } from "react-router-dom";
import Collections from "./pages/collections/Collections";

function App() {
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
