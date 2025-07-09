import "./PieChart.css";
import type { branch } from "../../types/dataTypes";
import { PieChart, Pie as Pies, Sector, type SectorProps } from "recharts";
import type { chartData, pieSets } from "./../../types/chartTypes";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  currentBranch: branch;
}

type Coordinate = {
  x: number;
  y: number;
};

type PieSectorData = {
  percent?: number;
  name?: string | number;
  midAngle?: number;
  middleRadius?: number;
  tooltipPosition?: Coordinate;
  value?: number;
  paddingAngle?: number;
  dataKey?: string;
  payload?: any;
};

type PieSectorDataItem = React.SVGProps<SVGPathElement> &
  Partial<SectorProps> &
  PieSectorData;

export default function PieCharts({ currentBranch }: PieChartProps) {
  // Pour la première solution avec Chart JS
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
          "rgba(171, 226, 255, 0.8)",
          "rgba(135, 207, 255, 0.8)",
          "rgba(212, 219, 255, 0.8)",
        ],
        hoverOffset: 4,
      });
    }
    return (chartedData = { labels, datasets });
  };

  // Pour la deuxième solution avec Rechart

  const chartedDataTree: {}[] = [];
  currentBranch.children.map((child) =>
    chartedDataTree.push({ name: child.name, value: 1 })
  );

  const renderActiveShape = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
  }: PieSectorDataItem) => {
    const RADIAN = Math.PI / 180;
    const sin = Math.sin(-RADIAN * (midAngle ?? 1));
    const cos = Math.cos(-RADIAN * (midAngle ?? 1));
    const sx = (cx ?? 0) + ((outerRadius ?? 0) + 10) * cos;
    const sy = (cy ?? 0) + ((outerRadius ?? 0) + 10) * sin;
    const mx = (cx ?? 0) + ((outerRadius ?? 0) + 30) * cos;
    const my = (cy ?? 0) + ((outerRadius ?? 0) + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        {/* <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload.name}
        </text> */}
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={(outerRadius ?? 0) + 6}
          outerRadius={(outerRadius ?? 0) + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
        >
          {payload.name}
        </text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#999"
        >
          {payload.name}
        </text>
      </g>
    );
  };

  return (
    <section className="pies">
      <Pie data={chartingTree(currentBranch, 2000)} />

      <PieChart width={600} height={400}>
        <Pies
          activeShape={renderActiveShape}
          data={chartedDataTree}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={20}
          outerRadius={105}
          fill="#d4dbff"
        />
      </PieChart>
    </section>
  );
}
