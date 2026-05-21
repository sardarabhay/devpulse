import type { Request, Response } from "express";
import axios from "axios";


interface DevPulseSession {
  user?: {
    login: string;
    name: string | null;
    avatar_url: string;
    accessToken: string;
  };
}

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;
const FRONTEND_URL = process.env.FRONTEND_URL!;


export const redirectToGitHub = (req: Request, res: Response) => {
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    scope: "read:user repo",
    allow_signup: "true",
  });

  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
};

export const handleGitHubCallback = async (req: Request, res: Response) => {
  const code = req.query.code as string;

  if (!code) return res.redirect(`${FRONTEND_URL}?error=missing_code`);

  try {
    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      { client_id: GITHUB_CLIENT_ID, client_secret: GITHUB_CLIENT_SECRET, code },
      { headers: { Accept: "application/json" } }
    );

    const accessToken = tokenRes.data.access_token;
    if (!accessToken) return res.redirect(`${FRONTEND_URL}?error=token_exchange_failed`);

    const userRes = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
      },
    });

    const githubUser = userRes.data;

    const sessionUser = {
      login: githubUser.login,
      name: githubUser.name,
      avatar_url: githubUser.avatar_url,
      accessToken,
    };

    
    (req.session as DevPulseSession & typeof req.session).user = sessionUser;

    res.redirect(`${FRONTEND_URL}/u/${githubUser.login}?authed=true`);
  } catch (err) {
    console.error("OAuth callback error:", err);
    res.redirect(`${FRONTEND_URL}?error=oauth_failed`);
  }
};

export const getMe = (req: Request, res: Response) => {
  const session = req.session as DevPulseSession & typeof req.session;

  if (!session.user) {
    return res.status(401).json({ authenticated: false });
  }

  const { login, name, avatar_url } = session.user;
  res.json({ authenticated: true, user: { login, name, avatar_url } });
};

export const logout = (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
};