import { useEffect, useState } from "react";
import { PieChart, Pie, ResponsiveContainer, Tooltip, Cell } from "recharts";
import type { topicBranch } from "../../types/dataTypes";

interface PieChartProps {
  isYear: number;
  currentBranch: topicBranch;
  setChildValueTotalWithYear: React.Dispatch<React.SetStateAction<number>>;
}

export default function PieCharts({
  isYear,
  currentBranch,
  setChildValueTotalWithYear,
}: PieChartProps) {
  const [chartedDataTree, setChartedDataTree] = useState<
    { name: string; value: number }[]
  >([]);

  useEffect(() => {
    if (
      currentBranch.children !== undefined &&
      currentBranch.children[1].values.length > 0
    ) {
      let autreValue = 0;
      let futureChartedDataTree = [];
      let totalValue = 0;
      currentBranch.children.forEach((element) => {
        const childValue = element.values.find((info) => info[0] === isYear);
        if (childValue) {
          totalValue = totalValue + childValue[1];
          if (childValue[1] < 1) {
            autreValue = autreValue + childValue[1];
          } else {
            futureChartedDataTree.push({
              name: element.name,
              value: childValue[1],
            });
          }
        }
      });
      if (autreValue < 0) {
        autreValue = 0;
      }
      autreValue = Number(autreValue.toFixed(2));
      futureChartedDataTree.push({ name: "autre", value: autreValue });
      futureChartedDataTree.sort((a, b) => b.value - a.value);
      setChartedDataTree(futureChartedDataTree);
      totalValue = Number(totalValue.toFixed(2));
      setChildValueTotalWithYear(totalValue);
    }
  }, [currentBranch, isYear]);

  const COLORS = [
    "#061EA5",
    "#1D33AF",
    "#3448B9",
    "#4B5DC3",
    "#6272CD",
    "#7887D7",
    "#8F9CE1",
    "#A6B1EB",
    "#BDC6F5",
    "#D4DBFF",
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={400} height={400}>
        <Pie
          dataKey="value"
          isAnimationActive={true}
          data={chartedDataTree}
          cx="50%"
          cy="50%"
          outerRadius={80}
          innerRadius={20}
        >
          {chartedDataTree.map((entry, index) => (
            <Cell
              key={`cell-${entry.name}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
