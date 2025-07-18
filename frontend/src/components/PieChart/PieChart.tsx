import { useContext, useEffect, useState } from "react";
import type { topicBranch } from "../../types/dataTypes";
import {
  PieChart,
  Pie as Pies,
  ResponsiveContainer,
  Sector,
  type SectorProps,
} from "recharts";
import GlobalContext from "../../contexts/GlobalContext";
import { GetTopic } from "../../functions/GetTopic";

interface PieChartProps {
  currentBranch: topicBranch;
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
  const { isYear } = useContext(GlobalContext);

  const [chartedDataTree, setChartedDataTree] = useState<
    { name: string; value: number }[]
  >([]);

  const [eachBranchValues, setEachBranchValues] = useState<[number, number][]>([
    [0, 0],
  ]);

  useEffect(() => {
    if (currentBranch.name === "Emissions GES") {
      setChartedDataTree([
        { name: "par gaz à effet de serre", value: 1 },
        { name: "par secteur", value: 1 },
        { name: "par combustible", value: 1 },
      ]);
      console.log(chartedDataTree);
    } else {
      if (currentBranch.children) {
        currentBranch.children.forEach((child) => {
          GetTopic(child.id).then((data) => {
            setEachBranchValues(data.values);
            console.log(data);
            const childValue = eachBranchValues.find(
              (info) => info[0] === isYear
            );
            console.log(childValue);
            if (childValue) {
              chartedDataTree.push({ name: child.name, value: childValue[1] });
              setChartedDataTree(chartedDataTree);
              console.log(chartedDataTree);
            }
          });
        });
      }
    }
  }, []);

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
    <ResponsiveContainer width="100%" height="47%">
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
    </ResponsiveContainer>
  );
}
