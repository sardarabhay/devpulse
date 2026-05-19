import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const SearchBar = () => {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const trimmed = input.trim();
    if (trimmed) navigate(`/u/${trimmed}`);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Enter any GitHub username..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="search-input"
      />
      <button onClick={handleSearch} className="search-btn">
        Analyze →
      </button>
    </div>
  );
};