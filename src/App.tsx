import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Receptionist from "./pages/Receptionist";
import PatientPage from "./pages/Patient";
import ConnectionStatus from "./components/ConnectionStatus";

function App() {
  return (
    <Router>
      <div className="bg-blobs">
        <div className="blob-1"></div>
        <div className="blob-2"></div>
      </div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/receptionist" element={<Receptionist />} />
        <Route path="/patient" element={<PatientPage />} />
      </Routes>
      <ConnectionStatus />
    </Router>
  );
}

export default App;
