import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ContributionData } from "../types/github";

interface Props {
  contributions: ContributionData;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <span className="tooltip-label">{label}</span>
      <span className="tooltip-value">{payload[0].value} contributions</span>
    </div>
  );
};

export const ActivityLineChart = ({ contributions }: Props) => {

  const data = contributions.weeks.map((week) => {
    const total = week.contributionDays.reduce(
      (sum, d) => sum + d.contributionCount,
      0
    );

    const date = new Date(week.contributionDays[0].date);
    const label = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return { label, total };
  });


  const tickFormatter = (_: string, index: number) =>
    index % 8 === 0 ? data[index]?.label ?? "" : "";

  return (
    <div className="chart-card">
      <h3 className="chart-title">
        Activity{" "}
        <span className="chart-sub">
          {contributions.totalContributions.toLocaleString()} contributions
          this year
        </span>
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
          // ActivityLineChart.tsx
          <XAxis
            dataKey="label"
            interval={12}          // show every 13th label (~monthly)
            tick={{ fill: "#6b6b8a", fontSize: 11, fontFamily: "DM Mono" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#6b6b8a", fontSize: 11, fontFamily: "DM Mono" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#7fff6e"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#7fff6e" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};