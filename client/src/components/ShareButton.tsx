import { useAuth } from "../context/AuthContext";
import { useState } from "react";

interface Props {
  username: string;
}

export const ShareButton = ({ username }: Props) => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const profileUrl = `${window.location.origin}/u/${username}`;
  const cardUrl = `${import.meta.env.VITE_API_BASE_URL}/api/card/${username}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="share-row">
      <button onClick={handleCopy} className="share-btn">
        {copied ? "✓ Copied!" : "Copy Profile Link"}
      </button>
      {user && (
        <a href={cardUrl} target="_blank" rel="noreferrer" className="share-btn">
          View Shareable Card
        </a>
      )}
    </div>
  );
};