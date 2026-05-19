import { type GitHubRepo } from "../types/github";

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

interface Props {
  repo: GitHubRepo;
}

export const RepoCard = ({ repo }: Props) => {
  const langColor = repo.language
    ? LANG_COLORS[repo.language] ?? "#8b949e"
    : null;

  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
      className="repo-card"
    >
      <div className="repo-top">
        <span className="repo-name">{repo.name}</span>
        <div className="repo-stats">
          <span>⭐ {repo.stargazers_count}</span>
          <span>🍴 {repo.forks_count}</span>
        </div>
      </div>
      {repo.description && (
        <p className="repo-desc">{repo.description}</p>
      )}
      {repo.language && (
        <div className="repo-lang">
          <span
            className="lang-dot"
            style={{ backgroundColor: langColor ?? "#8b949e" }}
          />
          {repo.language}
        </div>
      )}
    </a>
  );
};