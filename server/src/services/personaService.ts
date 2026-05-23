import { ContributionData } from "../types/github";

export interface Persona {
  label: string;
  emoji: string;
  description: string;
}

interface CommitPattern {
  totalDays: number;
  activeDays: number;
  currentStreak: number;
  longestStreak: number;
  nightCommits: number;   
  weekendCommits: number;
  weekdayCommits: number;
  burstDays: number;      
}

const analyzePattern = (data: ContributionData): CommitPattern => {
  const days = data.weeks.flatMap((w) => w.contributionDays);

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let weekendCommits = 0;
  let weekdayCommits = 0;
  let burstDays = 0;
  let activeDays = 0;

  for (const day of days) {
    const count = day.contributionCount;
    const dayOfWeek = new Date(day.date).getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    if (count > 0) {
      activeDays++;
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
      if (isWeekend) weekendCommits += count;
      else weekdayCommits += count;
      if (count >= 10) burstDays++;
    } else {
      tempStreak = 0;
    }
  }


  const reversed = [...days].reverse();
  for (const day of reversed) {
    if (day.contributionCount > 0) currentStreak++;
    else break;
  }

  return {
    totalDays: days.length,
    activeDays,
    currentStreak,
    longestStreak,
    weekendCommits,
    weekdayCommits,
    burstDays,
    nightCommits: 0,
  };
};

export const computePersona = (data: ContributionData): Persona => {
  const p = analyzePattern(data);
  const activeRatio = p.activeDays / p.totalDays;
  const weekendRatio =
    p.weekendCommits / (p.weekendCommits + p.weekdayCommits + 1);

  
  if (p.longestStreak >= 30) {
    return {
      label: "Consistent Grinder",
      emoji: "",
      description: `${p.longestStreak}-day longest streak. Shows up every single day.`,
    };
  }

  if (p.burstDays >= 20) {
    return {
      label: "Sprinter",
      emoji: "",
      description: `${p.burstDays} high-output days. Ships in intense bursts.`,
    };
  }

  if (weekendRatio >= 0.4) {
    return {
      label: "Weekend Warrior",
      emoji: "",
      description: "Most commits land on weekends. Builds on their own time.",
    };
  }

  if (activeRatio >= 0.6) {
    return {
      label: "Steady Builder",
      emoji: "",
      description: "Consistently active. Reliable, methodical output.",
    };
  }

  if (p.currentStreak >= 7) {
    return {
      label: "On A Roll",
      emoji: "",
      description: `${p.currentStreak}-day current streak. Building momentum right now.`,
    };
  }

  return {
    label: "Explorer",
    emoji: "",
    description: "Varied activity patterns. Curious, project-driven coder.",
  };
};