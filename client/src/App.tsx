import { Routes, Route } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { Dashboard } from "./pages/Dashboard";
import { Compare } from "./pages/Compare";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/u/:username" element={<Dashboard />} />
      <Route path="/compare" element={<Compare />} />
    </Routes>
  );
}

export default App;