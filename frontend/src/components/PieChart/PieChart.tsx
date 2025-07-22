import { useEffect } from "react";
import { PieChart, Pie, ResponsiveContainer, Tooltip } from "recharts";
import type { topicBranch } from "../../types/dataTypes";

interface PieChartProps {
  isYear: number;
  currentBranch: topicBranch;
  chartedDataTree: { name: string; value: number }[];
  setChartedDataTree: React.Dispatch<
    React.SetStateAction<{ name: string; value: number }[]>
  >;
  setChildValueTotalWithYear: React.Dispatch<React.SetStateAction<number>>;
}

export default function PieCharts({
  isYear,
  currentBranch,
  chartedDataTree,
  setChartedDataTree,
  setChildValueTotalWithYear,
}: PieChartProps) {
  useEffect(() => {
    setChartedDataTree([]);
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
      setChartedDataTree(futureChartedDataTree);
      setChildValueTotalWithYear(totalValue);
    }
  }, []);

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
          fill="#d4dbff"
          label
        />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
