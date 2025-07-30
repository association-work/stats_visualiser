export type pieData = {
  labels: string[];
  datasets: pieSets[];
};

export type pieSets = {
  label?: string;
  data: number[];
  backgroundColor: string[];
  // borderWidth: number;
  hoverOffset: number;
};
