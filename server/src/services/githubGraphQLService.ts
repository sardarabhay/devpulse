import axios from "axios";
import { ContributionData, LanguageStat } from "../types/github";

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";

const graphqlClient = axios.create({
  baseURL: GITHUB_GRAPHQL_URL,
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    "Content-Type": "application/json",
  },
});

// ─── Contributions (heatmap data) ────────────────────────────────────────────

const CONTRIBUTIONS_QUERY = `
  query($username: String!) {
    user(login: $username) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              color
            }
          }
        }
      }
    }
  }
`;

export const fetchContributions = async (
  username: string
): Promise<ContributionData> => {
  const { data } = await graphqlClient.post("", {
    query: CONTRIBUTIONS_QUERY,
    variables: { username },
  });

  if (data.errors) {
    throw new Error(data.errors[0].message);
  }

  return data.data.user.contributionsCollection.contributionCalendar;
};

// ─── Language breakdown ───────────────────────────────────────────────────────

const LANGUAGES_QUERY = `
  query($username: String!) {
    user(login: $username) {
      repositories(first: 50, ownerAffiliations: OWNER, isFork: false) {
        nodes {
          languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              size
              node {
                name
                color
              }
            }
          }
        }
      }
    }
  }
`;

export const fetchLanguageStats = async (
  username: string
): Promise<LanguageStat[]> => {
  const { data } = await graphqlClient.post("", {
    query: LANGUAGES_QUERY,
    variables: { username },
  });

  if (data.errors) {
    throw new Error(data.errors[0].message);
  }

  const repos = data.data.user.repositories.nodes;

  // Aggregate language sizes across all repos
  const langMap = new Map<string, LanguageStat>();

  for (const repo of repos) {
    for (const edge of repo.languages.edges) {
      const { name, color } = edge.node;
      const existing = langMap.get(name);

      if (existing) {
        existing.size += edge.size;
      } else {
        langMap.set(name, { name, color: color ?? "#ccc", size: edge.size });
      }
    }
  }

  // Sort by size descending, return top 8
  return Array.from(langMap.values())
    .sort((a, b) => b.size - a.size)
    .slice(0, 8);
};