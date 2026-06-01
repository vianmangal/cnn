import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { EMOTION_COLORS, EMOTION_ORDER } from "../utils/emotions.js";

function AnimatedBar(props) {
  const { fill, height, width, x, y } = props;
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      rx={8}
      ry={8}
      fill={fill}
      style={{ transition: "width 700ms ease" }}
    />
  );
}

export default function ConfidenceChart({ scores }) {
  const baseData = useMemo(() => {
    return EMOTION_ORDER.map((emotion) => ({
      emotion,
      value: scores?.[emotion] ?? 0,
      color: EMOTION_COLORS[emotion],
    }));
  }, [scores]);

  const [animatedData, setAnimatedData] = useState(
    baseData.map((item) => ({ ...item, value: 0 }))
  );

  useEffect(() => {
    setAnimatedData(baseData.map((item) => ({ ...item, value: 0 })));
    const id = requestAnimationFrame(() => {
      setAnimatedData(baseData);
    });
    return () => cancelAnimationFrame(id);
  }, [baseData]);

  return (
    <div className="h-64 w-full rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={animatedData}
          layout="vertical"
          margin={{ top: 8, right: 16, left: 24, bottom: 8 }}
        >
          <XAxis
            type="number"
            domain={[0, 1]}
            tickFormatter={(value) => `${Math.round(value * 100)}%`}
            stroke="#94a3b8"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
          />
          <YAxis
            type="category"
            dataKey="emotion"
            width={80}
            tick={{ fill: "#e2e8f0", fontSize: 12 }}
            stroke="#475569"
          />
          <Tooltip
            formatter={(value) => `${(value * 100).toFixed(1)}%`}
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #334155",
              borderRadius: 12,
              color: "#e2e8f0",
              fontSize: 12,
            }}
          />
          <Bar
            dataKey="value"
            isAnimationActive={false}
            barSize={18}
            shape={<AnimatedBar />}
          >
            {animatedData.map((entry) => (
              <Cell key={entry.emotion} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
