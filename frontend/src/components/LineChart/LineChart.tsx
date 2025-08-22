import { useEffect, useState } from "react";
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
  const [chartedLineDataTree, setChartedLineDataTree] = useState<
    { name: string; value: number }[]
  >([]);

  useEffect(() => {
    if (currentBranch && currentBranch.values.length > 0) {
      let futureChartedDataTree: { name: string; value: number }[] = [];
      currentBranch.values.forEach((element) => {
        futureChartedDataTree.push({
          name: element[0].toString(),
          value: element[1],
        });
      });
      setChartedLineDataTree(
        futureChartedDataTree.sort((a, b) => b.value - a.value)
      );
    }
  }, []);

  return (
    <ResponsiveContainer width="100%" height="88%">
      <LineCharts
        width={400}
        height={200}
        data={chartedLineDataTree}
        margin={{
          top: 5,
          right: 30,
          bottom: 5,
          left: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        {/* domain={["dataMin", "auto"]} permet de mieux cerner les début et fin des axes */}
        <CoolTip />
        <Lines
          type="monotone"
          dataKey="value"
          stroke="#061ea5"
          activeDot={{ r: 8 }}
        />
      </LineCharts>
    </ResponsiveContainer>
  );
}
