import { useState } from "react";
import { useCompare } from "../hooks/useCompare";
import { CompareCard } from "../components/CompareCard";

export const Compare = () => {
  const [u1, setU1] = useState("");
  const [u2, setU2] = useState("");
  const [submitted, setSubmitted] = useState<[string, string] | null>(null);

  const { data, isLoading, isError } = useCompare(
    submitted?.[0] ?? "",
    submitted?.[1] ?? ""
  );

  const handleCompare = () => {
    const t1 = u1.trim();
    const t2 = u2.trim();
    if (t1 && t2) setSubmitted([t1, t2]);
  };

  const winner =
    data &&
    (data.user1.contributions.totalContributions >=
    data.user2.contributions.totalContributions
      ? "user1"
      : "user2");

  return (
    <div className="compare-page">
      <nav className="dash-nav">
        <a href="/" className="nav-logo">DevPulse</a>
      </nav>

      <main className="compare-main">
        <h1 className="compare-title">Compare Developers</h1>
        <p className="compare-sub">
          Enter two GitHub usernames to see them side by side.
        </p>

        <div className="compare-inputs">
          <input
            className="search-input"
            placeholder="First username"
            value={u1}
            onChange={(e) => setU1(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCompare()}
          />
          <span className="compare-vs">vs</span>
          <input
            className="search-input"
            placeholder="Second username"
            value={u2}
            onChange={(e) => setU2(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCompare()}
          />
          <button className="search-btn" onClick={handleCompare}>
            Compare →
          </button>
        </div>

        {isLoading && (
          <div className="status-screen">
            <div className="spinner" />
            <p>Fetching both profiles...</p>
          </div>
        )}

        {isError && (
          <p className="error-text" style={{ textAlign: "center", marginTop: "2rem" }}>
            ⚠ One or both users not found.
          </p>
        )}

        {data && (
          <div className="compare-grid">
            <CompareCard
              user={data.user1.user}
              totalContributions={data.user1.contributions.totalContributions}
              languages={data.user1.languages}
              persona={data.user1.persona}
              topRepos={data.user1.topRepos}
              highlight={winner === "user1"}
            />
            <CompareCard
              user={data.user2.user}
              totalContributions={data.user2.contributions.totalContributions}
              languages={data.user2.languages}
              persona={data.user2.persona}
              topRepos={data.user2.topRepos}
              highlight={winner === "user2"}
            />
          </div>
        )}
      </main>
    </div>
  );
};