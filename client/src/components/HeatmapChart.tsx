import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import type { ContributionData } from "../types/github";

interface Props {
  contributions: ContributionData;
}

interface HeatmapValue {
  date: string;
  count: number;
  color: string;
}

export const HeatmapChart = ({ contributions }: Props) => {
  const values: HeatmapValue[] = contributions.weeks.flatMap((week) =>
    week.contributionDays.map((day) => ({
      date: day.date,
      count: day.contributionCount,
      color: day.color,
    }))
  );

const endDate = new Date();
const startDate = new Date(endDate);
startDate.setFullYear(endDate.getFullYear() - 1);
startDate.setDate(startDate.getDate() + 1); 

  return (
    <div className="chart-card heatmap-card">
      <h3 className="chart-title">
        Contributions
        <span className="chart-sub">
          {contributions.totalContributions.toLocaleString()} in the last year
        </span>
      </h3>
      <div className="heatmap-wrapper">
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={values}
          classForValue={(value) => {
            if (!value || value.count === 0) return "color-empty";
            if (value.count <= 2) return "color-scale-1";
            if (value.count <= 5) return "color-scale-2";
            if (value.count <= 9) return "color-scale-3";
            return "color-scale-4";
          }}
          tooltipDataAttrs={(value: any): { [key: string]: string } => ({
            "data-tooltip-id": "heatmap-tooltip",
            "data-tooltip-content": value?.count
              ? `${value.date}: ${value.count} contributions`
              : "No contributions",
          })}
          showWeekdayLabels
        />

        
        <Tooltip
          id="heatmap-tooltip"
          style={{
            background: "#1a1a28",
            border: "1px solid #1e1e2e",
            borderRadius: "6px",
            fontSize: "0.8rem",
            fontFamily: "DM Mono, monospace",
            color: "#e2e2f0",
          }}
        />
      </div>
      <div className="heatmap-legend">
        <span className="legend-label">Less</span>
        <span className="legend-box color-empty" />
        <span className="legend-box color-scale-1" />
        <span className="legend-box color-scale-2" />
        <span className="legend-box color-scale-3" />
        <span className="legend-box color-scale-4" />
        <span className="legend-label">More</span>
      </div>
    </div>
  );
};