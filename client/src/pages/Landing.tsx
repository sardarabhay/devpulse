import { SearchBar } from "../components/SearchBar";

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
          <a href="/u/torvalds" className="hint-link">torvalds</a>,{" "}
          <a href="/u/gaearon" className="hint-link">gaearon</a>, or your own username
        </p>
      </div>
    </div>
  );
};