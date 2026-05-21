import { createCanvas, loadImage } from "canvas";
import { fetchGitHubUser } from "./githubRestService";
import { fetchContributions, fetchLanguageStats } from "./githubGraphQLService";
import { computePersona } from "./personaService";

export const generateCard = async (username: string): Promise<Buffer> => {
  const [user, contributions, languages] = await Promise.all([
    fetchGitHubUser(username),
    fetchContributions(username),
    fetchLanguageStats(username),
  ]);

  const persona = computePersona(contributions);
  const topLang = languages[0]?.name ?? "—";
  const totalContributions = contributions.totalContributions;

  const W = 800;
  const H = 400;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");


  ctx.fillStyle = "#0a0a0f";
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#7fff6e";
  ctx.fillRect(0, 0, W, 4);

  ctx.strokeStyle = "#1e1e2e";
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y < H; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }


  try {
    const avatar = await loadImage(user.avatar_url);
    ctx.save();
    ctx.beginPath();
    ctx.arc(80, 100, 48, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(avatar, 32, 52, 96, 96);
    ctx.restore();


    ctx.strokeStyle = "#1e1e2e";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(80, 100, 48, 0, Math.PI * 2);
    ctx.stroke();
  } catch {

  }

  ctx.fillStyle = "#e2e2f0";
  ctx.font = "bold 28px sans-serif";
  ctx.fillText(user.name ?? user.login, 152, 88);

  ctx.fillStyle = "#7fff6e";
  ctx.font = "16px monospace";
  ctx.fillText(`@${user.login}`, 152, 114);

  ctx.fillStyle = "#6b6b8a";
  ctx.font = "15px sans-serif";
  ctx.fillText(`${persona.emoji} ${persona.label}`, 152, 140);

  ctx.strokeStyle = "#1e1e2e";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(40, 175);
  ctx.lineTo(W - 40, 175);
  ctx.stroke();


  const stats = [
    { label: "Contributions", value: totalContributions.toLocaleString() },
    { label: "Repos", value: String(user.public_repos) },
    { label: "Followers", value: user.followers.toLocaleString() },
    { label: "Top Language", value: topLang },
  ];

  stats.forEach((stat, i) => {
    const x = 60 + i * 185;
    const y = 230;

    ctx.fillStyle = "#e2e2f0";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText(stat.value, x, y);

    ctx.fillStyle = "#6b6b8a";
    ctx.font = "12px monospace";
    ctx.fillText(stat.label.toUpperCase(), x, y + 22);
  });

  ctx.fillStyle = "#6b6b8a";
  ctx.font = "13px monospace";
  ctx.fillText("devpulse.dev", 40, H - 30);

  ctx.fillStyle = "#7fff6e";
  ctx.font = "bold 13px monospace";
  ctx.fillText("DevPulse", W - 110, H - 30);

  return canvas.toBuffer("image/png");
};