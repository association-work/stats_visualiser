import "./DataButton.css";
import type { topicBranch } from "./../../types/dataTypes";
import { useEffect, useState } from "react";
import { GetTopic } from "../../functions/GetTopic";
import go_next from "../../assets/corner-up-right.svg";
import LineChart from "../LineChart/LineChart";
import line_chart from "../../../src/assets/activity.svg";

interface DataButtonProps {
  information: topicBranch;
  chosenPath: topicBranch[];
  setChosenPath: React.Dispatch<React.SetStateAction<topicBranch[]>>;
  setCurrentBranch: React.Dispatch<React.SetStateAction<topicBranch>>;
  childValueTotalWithYear: number;
  setChildValueTotalWithYear: React.Dispatch<React.SetStateAction<number>>;
  isYear: number;
  previousBranchName: string;
  setPreviousBranchName: React.Dispatch<React.SetStateAction<string>>;
}

export default function DataButton({
  information,
  chosenPath,
  setChosenPath,
  setCurrentBranch,
  childValueTotalWithYear,
  setChildValueTotalWithYear,
  isYear,
  previousBranchName,
  setPreviousBranchName,
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
    setChildValueTotalWithYear(0);
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
  console.log(percentage);

  const [showChildrenLineChart, setShowChildrenLineChart] = useState(false);

  return (
    <>
      {nextBranch && nextBranch.hasChildren ? (
        <button
          type="button"
          className={
            nextBranch.name === previousBranchName
              ? "last_chosen_tree_node"
              : "tree_node"
          }
          key={nextBranch.id}
          onClick={handleChangingBranch}
        >
          <p>{nextBranch.name[0].toUpperCase() + nextBranch.name.slice(1)}</p>
          <p>
            {percentage !== "0" && percentage + " %"}
            <img src={go_next} alt="show more data" />
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
            onClick={() => setShowChildrenLineChart(true)}
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
      {showChildrenLineChart && (
        <article className="popup_linechart">
          <button
            type="button"
            onClick={() => setShowChildrenLineChart(false)}
            className="closeButton"
          >
            X
          </button>
          <LineChart currentBranch={nextBranch} />
          <div className="references">
            <p>Source : </p>
            <a href={nextBranch.source.url} target="_blank">
              {nextBranch.source.name}
            </a>
          </div>
        </article>
      )}
    </>
  );
}
