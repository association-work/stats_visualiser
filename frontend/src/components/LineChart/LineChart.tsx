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
import {
  LineChart as LineCharts,
  CartesianGrid,
  XAxis,
  YAxis,
  Line as Lines,
  Tooltip as CoolTip,
} from "recharts";

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
      <LineCharts
        width={400}
        height={300}
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
    </>
  );
}
