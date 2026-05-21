import type { GitHubUser, LanguageStat, Persona } from "../types/github";

interface Props {
  user: GitHubUser;
  totalContributions: number;
  languages: LanguageStat[];
  persona: Persona;
  topRepos: { name: string; stargazers_count: number; language: string | null }[];
  highlight?: boolean; // true = this user "wins" overall
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  "C++": "#f34b7d",
  C: "#555555",
  Java: "#b07219",
};

export const CompareCard = ({
  user,
  totalContributions,
  languages,
  persona,
  topRepos,
  highlight,
}: Props) => {
  const totalStars = topRepos.reduce((s, r) => s + r.stargazers_count, 0);
  const topLang = languages[0];

  return (
    <div className={`compare-card ${highlight ? "compare-card--winner" : ""}`}>
      {highlight && <div className="winner-badge">⭐ More Active</div>}

      <div className="compare-profile">
        <img src={user.avatar_url} alt={user.login} className="compare-avatar" />
        <div>
          <h2 className="compare-name">{user.name ?? user.login}</h2>
          
           <a
            href={user.html_url}
            target="_blank"
            rel="noreferrer"
            className="compare-handle"
          >
            @{user.login}
          </a>
        </div>
      </div>

      <div className="compare-persona">
        <span>{persona.emoji}</span>
        <span>{persona.label}</span>
      </div>

      <div className="compare-stats">
        <div className="compare-stat">
          <span className="compare-stat-value">
            {totalContributions.toLocaleString()}
          </span>
          <span className="compare-stat-label">Contributions</span>
        </div>
        <div className="compare-stat">
          <span className="compare-stat-value">{user.public_repos}</span>
          <span className="compare-stat-label">Repos</span>
        </div>
        <div className="compare-stat">
          <span className="compare-stat-value">
            {user.followers.toLocaleString()}
          </span>
          <span className="compare-stat-label">Followers</span>
        </div>
        <div className="compare-stat">
          <span className="compare-stat-value">{totalStars}</span>
          <span className="compare-stat-label">Total Stars</span>
        </div>
      </div>

      {topLang && (
        <div className="compare-lang">
          <span
            className="lang-dot"
            style={{
              backgroundColor:
                LANG_COLORS[topLang.name] ?? "#8b949e",
            }}
          />
          <span>{topLang.name}</span>
        </div>
      )}

      <div className="compare-repos">
        {topRepos.slice(0, 3).map((repo) => (
          <div key={repo.name} className="compare-repo-row">
            <span className="compare-repo-name">{repo.name}</span>
            <span className="compare-repo-stars">⭐ {repo.stargazers_count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};