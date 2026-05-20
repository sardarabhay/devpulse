import type { ContributionData, LanguageStat } from "../types/github";

interface Props {
  contributions: ContributionData;
  languages: LanguageStat[];
}

const computeCurrentStreak = (contributions: ContributionData): number => {
  const days = contributions.weeks
    .flatMap((w) => w.contributionDays)
    .reverse();

  let streak = 0;
  for (const day of days) {
    if (day.contributionCount > 0) streak++;
    else break;
  }
  return streak;
};

const computeLongestStreak = (contributions: ContributionData): number => {
  const days = contributions.weeks.flatMap((w) => w.contributionDays);
  let longest = 0;
  let current = 0;
  for (const day of days) {
    if (day.contributionCount > 0) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
  }
  return longest;
};

export const StatsSummary = ({ contributions, languages }: Props) => {
  const currentStreak = computeCurrentStreak(contributions);
  const longestStreak = computeLongestStreak(contributions);
  const topLang = languages[0]?.name ?? "—";
  const activeDays = contributions.weeks
    .flatMap((w) => w.contributionDays)
    .filter((d) => d.contributionCount > 0).length;

  const stats = [
    { label: "Total Contributions", value: contributions.totalContributions.toLocaleString() },
    { label: "Active Days", value: activeDays },
    { label: "Current Streak", value: `${currentStreak}d` },
    { label: "Longest Streak", value: `${longestStreak}d` },
    { label: "Top Language", value: topLang },
  ];

  return (
    <div className="stats-summary">
      {stats.map((s) => (
        <div key={s.label} className="summary-stat">
          <span className="summary-value">{s.value}</span>
          <span className="summary-label">{s.label}</span>
        </div>
      ))}
    </div>
  );
};