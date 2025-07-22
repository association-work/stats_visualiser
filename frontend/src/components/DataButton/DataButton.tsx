import "./DataButton.css";
import type { topicBranch } from "./../../types/dataTypes";
import { useEffect, useState } from "react";
import { GetTopic } from "../../functions/GetTopic";

interface DataButtonProps {
  information: topicBranch;
  chosenPath: topicBranch[];
  setChosenPath: React.Dispatch<React.SetStateAction<topicBranch[]>>;
  setCurrentBranch: React.Dispatch<React.SetStateAction<topicBranch>>;
  childValueTotalWithYear: number;
  setChildValueTotalWithYear: React.Dispatch<React.SetStateAction<number>>;
  isYear: number;
}

export default function DataButton({
  information,
  chosenPath,
  setChosenPath,
  setCurrentBranch,
  childValueTotalWithYear,
  setChildValueTotalWithYear,
  isYear,
}: DataButtonProps) {
  const [nextBranch, setNextBranch] = useState<topicBranch>(information);

  useEffect(() => {
    GetTopic(information.id).then((data) => setNextBranch(data));
  }, []);

  const handleChangingBranch = () => {
    chosenPath.push(nextBranch);
    setChosenPath(chosenPath);
    setCurrentBranch(nextBranch);
    setChildValueTotalWithYear(0);
  };

  const informationValue = information.values.find(
    (info) => info[0] === isYear
  );

  let percentage = 0;

  if (informationValue && childValueTotalWithYear > 0) {
    percentage = Number(
      ((informationValue[1] / childValueTotalWithYear) * 100).toFixed(2)
    );
  }

  return (
    <>
      {nextBranch && nextBranch.hasChildren ? (
        <button
          type="button"
          className="tree_node"
          key={nextBranch.id}
          onClick={handleChangingBranch}
        >
          <p>{nextBranch.name}</p>
          <p>
            {percentage > 0 ? `${percentage} %` : ""}
            {">"}
          </p>
        </button>
      ) : (
        <button type="button" className="tree_end" key={nextBranch.id} disabled>
          <p>
            {nextBranch.name} {percentage > 0 ? `${percentage} %` : ""}
          </p>
        </button>
      )}
    </>
  );
}
