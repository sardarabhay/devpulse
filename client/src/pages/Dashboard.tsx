import { useParams, useNavigate } from "react-router-dom";
import { useGitHubUser } from "../hooks/useGitHubUser";
import { useGitHubStats } from "../hooks/useGitHubStats";
import { ProfileHeader } from "../components/ProfileHeader";
import { RepoCard } from "../components/RepoCard";
import { SearchBar } from "../components/SearchBar";
import { LanguageDonut } from "../components/LanguageDonut";
import { ActivityLineChart } from "../components/ActivityLineChart";
import { PersonaBadge } from "../components/PersonaBadge";

export const Dashboard = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();

  const {
    data: profileData,
    isLoading: profileLoading,
    isError,
    error,
  } = useGitHubUser(username ?? "");

  const {
    data: statsData,
    isLoading: statsLoading,
  } = useGitHubStats(username ?? "");

  if (profileLoading) {
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

  if (!profileData) return null;

  return (
    <div className="dashboard">
      <nav className="dash-nav">
        <a href="/" className="nav-logo">DevPulse</a>
        <SearchBar />
      </nav>

      <main className="dash-main">
        <ProfileHeader user={profileData.user} />

        
        {statsLoading && (
          <div className="charts-loading">
            <div className="spinner" />
            <p>Loading analytics...</p>
          </div>
        )}

        {statsData && (
          <>
            <PersonaBadge persona={statsData.persona} />

            <div className="charts-grid">
              <ActivityLineChart contributions={statsData.contributions} />
              <LanguageDonut languages={statsData.languages} />
            </div>
          </>
        )}

        <section className="repos-section">
          <h2 className="section-title">Top Repositories</h2>
          <div className="repos-grid">
            {profileData.topRepos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        </section>

        <div className="unlock-banner">
          🔒 Want private repo stats & a shareable card?{" "}
          <button className="unlock-btn">Login with GitHub →</button>
        </div>
      </main>
    </div>
  );
};