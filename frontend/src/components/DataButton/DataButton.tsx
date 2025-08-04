import "./DataButton.css";
import type { topicBranch } from "./../../types/dataTypes";
import { useEffect, useState } from "react";
import { GetTopic } from "../../functions/GetTopic";
import go_next from "../../assets/corner-up-right.svg";

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
    GetTopic(information.id).then((data) => setNextBranch(data));
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

  console.log(previousBranchName);
  console.log(nextBranch.name);

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
          <p>{nextBranch.name}</p>
          {nextBranch.values.length !== 0 ? (
            <p>
              {percentage + " %"}
              <img src={go_next} alt="show more data" />
            </p>
          ) : (
            <img src={go_next} alt="show more data" />
          )}
        </button>
      ) : (
        <button type="button" className="tree_end" key={nextBranch.id} disabled>
          <p>{nextBranch.name}</p>
          <p>{percentage + " %"}</p>
        </button>
      )}
    </>
  );
}
