import { SearchBar } from "../components/SearchBar";
import { Link } from "react-router-dom"

export const Landing = () => {
  return (
    <div className="landing">
      <div className="landing-content">
        <h1 className="landing-title">DevPulse</h1>
        <p className="landing-sub">
          Instant GitHub analytics for any developer.
          <br />
          No login required.
        </p>
        <SearchBar />
        <p className="landing-hint">
          Try{" "}
          <Link to="/u/torvalds" className="hint-link">torvalds</Link>,{" "}
          <Link to="/u/gaearon" className="hint-link">gaearon</Link>, or your own username
        </p>
      </div>
    </div>
  );
};