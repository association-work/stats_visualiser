export type chartData = {
  labels: string[];
  datasets: pieSets[] | lineSets[];
};

export type pieSets = {
  label?: string;
  data: number[];
  backgroundColor: string[];
  // borderWidth: number;
  hoverOffset: number;
};

export type lineSets = {
  label?: string;
  data: number[];
  bordercolor: string[];
};
