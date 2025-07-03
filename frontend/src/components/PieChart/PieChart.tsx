import "./PieChart.css";
import BigData from "../../data.json";
import type { pieData, pieSets } from "./../../types/chartTypes";
import type { branch } from "../../types/dataTypes";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart() {
  const entireTree: branch = BigData.themes[0];
  let chartedData: pieData = {
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
        const isvalue = kid.values.filter((info) => info.year === isyear);
        console.log(isvalue);
        data.push(isvalue[0].value);
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
      <Pie data={chartingTree(entireTree, 2000)} />
    </>
  );
}
