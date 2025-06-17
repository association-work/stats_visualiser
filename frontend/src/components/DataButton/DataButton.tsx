import "./DataButton.css";
import type { branch } from "./../../types/dataTypes";

interface DataButtonProps {
  information: branch;
  hasChildren: boolean;
  setHasChildren: (boolean: boolean) => void;
  chosenPath: string[];
}

export default function DataButton({
  information,
  hasChildren,
  setHasChildren,
  chosenPath,
}: DataButtonProps) {
  const isParent = (tree: branch) => {
    if (tree.children) {
      setHasChildren(true);
      chosenPath.push(tree.name);
    }
  };

  return (
    <>
      <button
        type="button"
        className={hasChildren === false ? "last_node" : "tree_node"}
        onClick={() => isParent(information)}
      >
        {information.name}
      </button>
    </>
  );
}
