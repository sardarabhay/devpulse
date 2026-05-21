import { useState } from "react";

interface Props {
    username: string;
}

export const ShareButton = ({ username }: Props) => {
    const [copied, setCopied] = useState(false);

    const cardUrl = `${import.meta.env.VITE_API_BASE_URL}/api/card/${username}`;
    const profileUrl = `${window.location.origin}/u/${username}`;

    const handleCopy = async () => {
        await navigator.clipboard.writeText(profileUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="share-row">

            <a
                href={cardUrl}
                target="_blank"
                rel="noreferrer"
                className="share-btn"
            >
                🖼 View Card
            </a>
            <button onClick={handleCopy} className="share-btn share-btn--copy">
                {copied ? "✅ Copied!" : "🔗 Copy Link"}
            </button>
        </div>
    );
};