import "./DataButton.css";
import type { topicBranch } from "./../../types/dataTypes";
import { useEffect, useState } from "react";
import { GetTopic } from "../../functions/GetTopic";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import line_chart from "../../../src/assets/activity.svg";

interface DataButtonProps {
  information: topicBranch;
  chosenPath: topicBranch[];
  setChosenPath: React.Dispatch<React.SetStateAction<topicBranch[]>>;
  setCurrentBranch: React.Dispatch<React.SetStateAction<topicBranch>>;
  childValueTotalWithYear: number;
  isYear: number;
  previousBranchName: string;
  setPreviousBranchName: React.Dispatch<React.SetStateAction<string>>;
  setShowLineChart: React.Dispatch<React.SetStateAction<boolean>>;
  setLineChartToShow: React.Dispatch<
    React.SetStateAction<topicBranch | undefined>
  >;
}

export default function DataButton({
  information,
  chosenPath,
  setChosenPath,
  setCurrentBranch,
  childValueTotalWithYear,
  isYear,
  previousBranchName,
  setPreviousBranchName,
  setShowLineChart,
  setLineChartToShow,
}: DataButtonProps) {
  const [nextBranch, setNextBranch] = useState<topicBranch>(information);

  useEffect(() => {
    if (information.id.length > 35) {
      GetTopic(information.id).then((data) => setNextBranch(data));
    } else {
      setNextBranch(information);
    }
  }, []);

  const handleChangingBranch = () => {
    setChosenPath(chosenPath);
    chosenPath.push(nextBranch);
    setCurrentBranch(nextBranch);
    setPreviousBranchName("");
  };

  const nextBranchValue = nextBranch.values.find((info) => info[0] === isYear);

  let percentage = "0";

  if (nextBranchValue && childValueTotalWithYear !== 0) {
    if (childValueTotalWithYear > 0) {
      percentage = (
        (nextBranchValue[1] / childValueTotalWithYear) *
        100
      ).toFixed(1);
    } else {
      percentage = (
        (nextBranchValue[1] / Math.abs(childValueTotalWithYear)) *
        100
      ).toFixed(1);
    }
  }

  return (
    <>
      {nextBranch && nextBranch.children && nextBranch.children.length > 0 ? (
        <button
          type="button"
          className={
            nextBranch.name === previousBranchName
              ? "last_chosen_tree_node"
              : "tree_node"
          }
          key={nextBranch.id}
          onClick={handleChangingBranch}
          disabled={isYear === 10 && !nextBranch.id.includes("1_")}
        >
          <p>{nextBranch.name[0].toUpperCase() + nextBranch.name.slice(1)}</p>
          <p>
            {percentage !== "0" && percentage + " %"}
            <ChevronRightOutlinedIcon />
          </p>
        </button>
      ) : nextBranchValue ? (
        <section className="last_topic_branch">
          <button
            type="button"
            className="tree_end"
            key={nextBranch.id}
            disabled
          >
            <p>{nextBranch.name}</p>
            <p>{percentage + " %"}</p>
          </button>
          <button
            type="button"
            onClick={() => {
              setShowLineChart(true);
              setLineChartToShow(nextBranch);
            }}
            className="icon_linechart"
          >
            <img src={line_chart} alt="afficher le graphique de l'évolution" />
          </button>
        </section>
      ) : (
        <button
          type="button"
          className="tree_unknown"
          key={nextBranch.id}
          disabled
        >
          <p>{nextBranch.name}</p>
          <p>en construction</p>
        </button>
      )}
    </>
  );
}
