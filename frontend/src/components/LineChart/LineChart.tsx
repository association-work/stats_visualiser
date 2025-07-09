import type { chartData, lineSets } from "./../../types/chartTypes";
import type { branch } from "../../types/dataTypes";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Title,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Title,
  Legend
);

interface LineChartProps {
  currentBranch: branch;
}

export default function LineChart({ currentBranch }: LineChartProps) {
  let chartedData: chartData = {
    labels: [],
    datasets: [
      {
        label: "",
        data: [],
        bordercolor: [""],
      },
    ],
  };

  const chartingTree = (isdata: branch) => {
    const labels: string[] = [];
    let datasets: lineSets[] = [];
    const data: number[] = [];
    if (isdata.values !== null && isdata.values !== undefined) {
      isdata.values.map((info) => {
        labels.push(info.year.toString());
        data.push(info.value);
      });
      datasets.push({
        label: isdata.name,
        data,
        bordercolor: ["rgba(54, 162, 235, 0.2)"],
      });
    }
    return (chartedData = { labels, datasets });
  };

  return (
    <>
      <Line data={chartingTree(currentBranch)} />
    </>
  );
}
