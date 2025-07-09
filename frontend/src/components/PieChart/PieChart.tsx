import "./PieChart.css";
import type { chartData, pieSets } from "./../../types/chartTypes";
import type { branch } from "../../types/dataTypes";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  currentBranch: branch;
}

export default function PieChart({ currentBranch }: PieChartProps) {
  let chartedData: chartData = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [""],
        hoverOffset: 4,
      },
    ],
  };

  const chartingTree = (isdata: branch, isyear: number) => {
    const labels: string[] = [];
    let datasets: pieSets[] = [];
    const data: number[] = [];
    if (isdata.children) {
      isdata.children.map((kid) => {
        labels.push(kid.name);
        const isvalue = kid.values.filter((info) => info.year === isyear)[0];
        data.push(isvalue.value);
      });
      datasets.push({
        data,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(38, 90, 29, 0,9)",
        ],
        hoverOffset: 4,
      });
    }
    return (chartedData = { labels, datasets });
  };
  return (
    <>
      <Pie data={chartingTree(currentBranch, 2000)} />
    </>
  );
}
