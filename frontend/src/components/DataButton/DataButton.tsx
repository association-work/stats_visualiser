import "./DataButton.css";
import type { topicBranch } from "./../../types/dataTypes";
import DetailsButton from "../DetailsButton/DetailsButton";
import { useEffect, useState, useContext } from "react";
import GlobalContext from "../../contexts/GlobalContext";
import { GetTopic } from "../../functions/GetTopic";

interface DataButtonProps {
  information: topicBranch;
}

export default function DataButton({ information }: DataButtonProps) {
  const { chosenPath, setChosenPath, setCurrentBranch } =
    useContext(GlobalContext);

  const [nextBranch, setNextBranch] = useState<topicBranch>(information);

  useEffect(() => {
    GetTopic(information.id).then((data) => setNextBranch(data));
  }, []);

  const handleChangingBranch = () => {
    chosenPath.push(nextBranch);
    setChosenPath(chosenPath);
    setCurrentBranch(nextBranch);
  };

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
          <p>{">"}</p>
        </button>
      ) : (
        <section className="childless">
          <button
            type="button"
            className="tree_end"
            key={nextBranch.id}
            disabled
          >
            <p>{nextBranch.name}</p>
          </button>
          <DetailsButton details={nextBranch} />
        </section>
      )}
    </>
  );
}
