import { type GitHubUser } from "../types/github";

const LocationIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 1 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

interface Props {
  user: GitHubUser;
}

export const ProfileHeader = ({ user }: Props) => {
  const joinYear = new Date(user.created_at).getFullYear();

  return (
    <div className="profile-header">
      <img src={user.avatar_url} alt={user.login} className="avatar" />
      <div className="profile-info">
        <h1 className="profile-name">{user.name ?? user.login}</h1>
        <a
          href={user.html_url}
          target="_blank"
          rel="noreferrer"
          className="profile-handle"
        >
          @{user.login}
        </a>
        {user.bio && <p className="profile-bio">{user.bio}</p>}
        <div className="profile-meta">
          {user.location && (
            <span className="meta-item">
              <LocationIcon className="icon" /> {user.location}
            </span>
          )}
          <span className="meta-item">
            <CalendarIcon className="icon" /> Joined {joinYear}
          </span>
        </div>
        <div className="stats-row">
          <div className="stat">
            <span className="stat-value">{user.public_repos}</span>
            <span className="stat-label">Repos</span>
          </div>
          <div className="stat">
            <span className="stat-value">
              {user.followers.toLocaleString()}
            </span>
            <span className="stat-label">Followers</span>
          </div>
          <div className="stat">
            <span className="stat-value">{user.following}</span>
            <span className="stat-label">Following</span>
          </div>
        </div>
      </div>
    </div>
  );
};