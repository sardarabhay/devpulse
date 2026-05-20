import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { LanguageStat } from "../types/github";

interface Props {
  languages: LanguageStat[];
}

const formatBytes = (bytes: number): string => {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)}MB`;
  if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(0)}KB`;
  return `${bytes}B`;
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const total = payload[0].payload._total;
  const pct = ((d.size / total) * 100).toFixed(1);

  return (
    <div className="chart-tooltip">
      <span className="tooltip-label">{d.name}</span>
      <span className="tooltip-value">{pct}%</span>
      <span className="tooltip-sub">{formatBytes(d.size)}</span>
    </div>
  );
};

export const LanguageDonut = ({ languages }: Props) => {
  const total = languages.reduce((sum, l) => sum + l.size, 0);
  const data = languages.map((l) => ({ ...l, _total: total }));

  return (
    <div className="chart-card">
      <h3 className="chart-title">Languages</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={3}
            dataKey="size"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color ?? "#8b949e"} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => (
              <span style={{ color: "#e2e2f0", fontSize: "0.8rem" }}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};