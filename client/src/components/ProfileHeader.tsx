import { type GitHubUser } from "../types/github";

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
          {user.location && <span>📍 {user.location}</span>}
          <span>📅 Joined {joinYear}</span>
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