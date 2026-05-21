import { useParams, useNavigate } from "react-router-dom";
import { useGitHubUser } from "../hooks/useGitHubUser";
import { useGitHubStats } from "../hooks/useGitHubStats";
import { ProfileHeader } from "../components/ProfileHeader";
import { RepoCard } from "../components/RepoCard";
import { SearchBar } from "../components/SearchBar";
import { LanguageDonut } from "../components/LanguageDonut";
import { ActivityLineChart } from "../components/ActivityLineChart";
import { PersonaBadge } from "../components/PersonaBadge";
import { HeatmapChart } from "../components/HeatmapChart";
import { StatsSummary } from "../components/StatsSummary";
import { useAuth } from "../context/AuthContext";
import { ShareButton } from "../components/ShareButton";


export const Dashboard = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();

  const {
    data: profileData,
    isLoading: profileLoading,
    isError,
    error,
  } = useGitHubUser(username ?? "");

  const { data: statsData, isLoading: statsLoading } = useGitHubStats(
    username ?? ""
  );

  const { user, logout } = useAuth();

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
        <a href="/compare" className="compare-nav-link">Compare →</a>
        {user ? (
          <div className="nav-user">
            <img src={user.avatar_url} alt={user.login} className="nav-avatar" />
            <span className="nav-username">@{user.login}</span>
            <button onClick={logout} className="nav-logout">Logout</button>
          </div>
        ) : (
          <a
            href={`${import.meta.env.VITE_API_BASE_URL}/auth/github`}
            className="nav-login-btn"
          >
            Login with GitHub
          </a>
        )}
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

            <StatsSummary
              contributions={statsData.contributions}
              languages={statsData.languages}
            />


            <PersonaBadge persona={statsData.persona} />

            <ShareButton username={username ?? ""} />

            <HeatmapChart contributions={statsData.contributions} />


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

        {!user && (
          <div className="unlock-banner">
            🔒 Want private repo stats & a shareable card?{" "}
            <a
              href={`${import.meta.env.VITE_API_BASE_URL}/auth/github`}
              className="unlock-btn"
            >
              Login with GitHub →
            </a>
          </div>
        )}
      </main>
    </div>
  );
};