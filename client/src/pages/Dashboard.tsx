import { useParams, useNavigate } from "react-router-dom";
import { useGitHubUser } from "../hooks/useGitHubUser";
import { ProfileHeader } from "../components/ProfileHeader";
import { RepoCard } from "../components/RepoCard";
import { SearchBar } from "../components/SearchBar";

export const Dashboard = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGitHubUser(username ?? "");

  if (isLoading) {
    return (
      <div className="status-screen">
        <div className="spinner" />
        <p>Fetching {username}'s GitHub data...</p>
      </div>
    );
  }

  if (isError) {
    const msg =
      (error as any)?.response?.data?.error ?? "Something went wrong.";
    return (
      <div className="status-screen">
        <p className="error-text">⚠ {msg}</p>
        <button onClick={() => navigate("/")} className="back-btn">
          ← Try another username
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="dashboard">
      <nav className="dash-nav">
        <a href="/" className="nav-logo">DevPulse</a>
        <SearchBar />
      </nav>

      <main className="dash-main">
        <ProfileHeader user={data.user} />

        <section className="repos-section">
          <h2 className="section-title">Top Repositories</h2>
          <div className="repos-grid">
            {data.topRepos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        </section>

        <div className="unlock-banner">
          🔒 Want contribution heatmap, language stats & shareable card?{" "}
          <button className="unlock-btn">Login with GitHub →</button>
        </div>
      </main>
    </div>
  );
};