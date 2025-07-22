import type { topicBranch } from "../../types/dataTypes";
import {
  LineChart as LineCharts,
  CartesianGrid,
  XAxis,
  YAxis,
  Line as Lines,
  Tooltip as CoolTip,
  ResponsiveContainer,
} from "recharts";

interface LineChartProps {
  currentBranch: topicBranch;
}

export default function LineChart({ currentBranch }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height="88%">
      <LineCharts
        width={400}
        height={200}
        data={currentBranch.values}
        margin={{
          top: 5,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <CoolTip />
        <Lines
          type="monotone"
          dataKey="value"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineCharts>
    </ResponsiveContainer>
  );
}
