import { useEffect, useState } from "react";
import type { topicBranch } from "../../types/dataTypes";
import { LineChart as LineCharts } from "@mui/x-charts";
import Box from "@mui/material/Box";

interface LineChartProps {
  currentBranch: topicBranch;
  childrenTotalValues: [number, number][];
}

export default function LineChart({
  currentBranch,
  childrenTotalValues,
}: LineChartProps) {
  const [lineDataTreeValues, setLineDataTreeValues] = useState<number[]>([]);
  const [lineDataTreeLabels, setLineDataTreeLabels] = useState<string[]>([]);

  let LineDataTreeLabel = "";
  const [isValueInMillion, setIsValueInMillion] = useState(false);

  useEffect(() => {
    setIsValueInMillion(false);
    if (currentBranch && currentBranch.values.length > 0) {
      let futureChartedDataValues: number[] = [];
      let futureChartedDataLabels: string[] = [];
      currentBranch.values
        .sort((a, b) => a[0] - b[0])
        .forEach((element) => {
          if (element[1] > 1000000) {
            setIsValueInMillion(true);
          }
          futureChartedDataValues.push(element[1]);
          futureChartedDataLabels.push(element[0].toString());
        });
      setLineDataTreeValues(futureChartedDataValues);
      setLineDataTreeLabels(futureChartedDataLabels);
    } else {
      let futureChartedDataValues: number[] = [];
      let futureChartedDataLabels: string[] = [];
      childrenTotalValues
        .sort((a, b) => a[0] - b[0])
        .forEach((element) => {
          if (element[1] > 1000000) {
            setIsValueInMillion(true);
          }
          futureChartedDataValues.push(element[1]);
          futureChartedDataLabels.push(element[0].toString());
        });
      setLineDataTreeValues(futureChartedDataValues);
      setLineDataTreeLabels(futureChartedDataLabels);
    }
  }, []);

  if (isValueInMillion) {
    LineDataTreeLabel = currentBranch.name + " (million)";
  } else {
    LineDataTreeLabel = currentBranch.name;
  }

  return (
    <Box sx={{ width: "100%", height: "100%", fontFamily: "var(--main-font)" }}>
      <LineCharts
        series={[
          {
            data: lineDataTreeValues,
            label: LineDataTreeLabel,
            showMark: false,
          },
        ]}
        xAxis={[
          {
            data: lineDataTreeLabels,
            dataKey: "year",
            valueFormatter: (value: number) => value.toString(),
          },
        ]}
        yAxis={[
          {
            width: 50,
            min: 0,
            valueFormatter: (value: number) => value.toString().slice(0, 2),
          },
        ]}
      />
    </Box>
  );
}
