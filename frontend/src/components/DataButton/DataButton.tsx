import "./DataButton.css";
import type { branch } from "./../../types/dataTypes";
import DetailsButton from "../DetailsButton/DetailsButton";

interface DataButtonProps {
  information: branch;
  index: number;
  handleChangedBranch: (index: number) => void;
}

export default function DataButton({
  information,
  index,
  handleChangedBranch,
}: DataButtonProps) {
  return (
    <>
      {information.children.length !== 0 ? (
        <button
          type="button"
          className="tree_node"
          key={index}
          onClick={() => {
            handleChangedBranch(index);
          }}
        >
          <p>{information.name}</p>
          <p>{">"}</p>
        </button>
      ) : (
        <section className="childless">
          <button type="button" className="tree_end" key={index} disabled>
            <p>{information.name}</p>
          </button>
          <DetailsButton details={information} />
        </section>
      )}
    </>
  );
}
