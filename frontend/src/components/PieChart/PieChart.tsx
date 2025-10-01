import { useEffect, useState } from "react";
// import { PieChart, Pie, ResponsiveContainer, Tooltip, Cell } from "recharts";
import type { topicBranch } from "../../types/dataTypes";
import { PieChart } from "@mui/x-charts/PieChart";

interface PieChartProps {
  isYear: number;
  currentBranch: topicBranch;
}

export default function PieCharts({ isYear, currentBranch }: PieChartProps) {
  const [data, setData] = useState<{ value: number; label: string }[]>([]);

  const size = {
    width: 200,
    height: 200,
  };

  useEffect(() => {
    if (
      currentBranch.children !== undefined &&
      currentBranch.children[0].values.length > 0
    ) {
      let autreValue = 0;
      let futureChartedDataTree = [];
      currentBranch.children.forEach((element) => {
        const childValue = element.values.find((info) => info[0] === isYear);
        if (childValue) {
          if (childValue[1] < 1) {
            autreValue = autreValue + childValue[1];
          } else {
            futureChartedDataTree.push({
              value: childValue[1],
              label: element.name,
            });
          }
        }
      });
      if (autreValue < 0) {
        autreValue = 0;
      }
      autreValue = Number(autreValue.toFixed(2));
      futureChartedDataTree.push({ value: autreValue, label: "autre" });
      futureChartedDataTree.sort((a, b) => b.value - a.value);
      setData(futureChartedDataTree);
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
    <PieChart
      series={[{ data, innerRadius: 30 }]}
      {...size}
      colors={COLORS}
    ></PieChart>
  );
}
