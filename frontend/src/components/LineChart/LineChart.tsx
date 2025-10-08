import { useEffect, useState } from "react";
import type { topicBranch } from "../../types/dataTypes";
import { LineChart as LineCharts } from "@mui/x-charts";
import Box from "@mui/material/Box";

interface LineChartProps {
  currentBranch: topicBranch;
}

export default function LineChart({ currentBranch }: LineChartProps) {
  const [lineDataTreeValues, setLineDataTreeValues] = useState<number[]>([]);
  const [lineDataTreeLabels, setLineDataTreeLabels] = useState<string[]>([]);

  useEffect(() => {
    if (currentBranch && currentBranch.values.length > 0) {
      let futureChartedDataValues: number[] = [];
      let futureChartedDataLabels: string[] = [];
      currentBranch.values.forEach((element) => {
        futureChartedDataValues.push(element[1]);
        futureChartedDataLabels.push(element[0].toString());
      });
      setLineDataTreeValues(futureChartedDataValues);
      setLineDataTreeLabels(futureChartedDataLabels);
    }
  }, []);

  return (
    <Box sx={{ width: "100%", height: "100%", fontFamily: "var(--main-font)" }}>
      <LineCharts
        series={[{ data: lineDataTreeValues, label: currentBranch.name }]}
        xAxis={[{ scaleType: "point", data: lineDataTreeLabels }]}
        yAxis={[{ width: 50 }]}
        margin={{ right: 24 }}
      />
    </Box>
  );
}
