import { useState } from "react";
import axios from "axios";

function App() {
  const [status, setStatus] = useState("");

  const ping = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/health`
    );
    setStatus(res.data.message);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h1>DevPulse 🚀</h1>
      <button onClick={ping}>Ping Server</button>
      {status && <p>{status}</p>}
    </div>
  );
}

export default App;