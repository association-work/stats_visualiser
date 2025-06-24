import "./DataButton.css";
import type { branch } from "./../../types/dataTypes";

interface DataButtonProps {
  information: branch;
  index: number;
  handleChangedBranch: (index: number) => any;
}

export default function DataButton({
  information,
  index,
  handleChangedBranch,
}: DataButtonProps) {
  return (
    <button
      type="button"
      className="tree_node"
      key={index}
      onClick={() => {
        handleChangedBranch(index);
      }}
    >
      {information.name}
    </button>
  );
}
