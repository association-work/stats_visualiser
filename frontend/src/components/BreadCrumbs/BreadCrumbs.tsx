import "./BreadCrumbs.css";
import type { topicBranch } from "../../types/dataTypes";

interface BreadCrumbsProps {
  chosenPath: topicBranch[];
  setChosenPath: React.Dispatch<React.SetStateAction<topicBranch[]>>;
  setCurrentBranch: React.Dispatch<React.SetStateAction<topicBranch>>;
  setPreviousBranchName: React.Dispatch<React.SetStateAction<string>>;
}

export default function BreadCrumbs({
  chosenPath,
  setChosenPath,
  setCurrentBranch,
  setPreviousBranchName,
}: BreadCrumbsProps) {
  const handleRewindBranch = (index: number) => {
    setPreviousBranchName(chosenPath[chosenPath.length - 1].name);
    chosenPath.forEach((choice) => {
      setCurrentBranch(choice);
      let i = chosenPath.length - 1;
      while (i > index) {
        chosenPath.pop();
        i--;
      }
      setChosenPath(chosenPath);
    });
  };

  return (
    <aside className="breadcrumbs">
      <section className="static_crumbs" aria-label="Breadcrumb">
        {chosenPath &&
          chosenPath.length > 0 &&
          chosenPath.map((choice, index) => (
            <button
              type="button"
              className="crumbs"
              key={index}
              onClick={() => handleRewindBranch(index)}
              disabled={index === 0}
            >
              {choice.name.length < 15 ? choice.name : choice.name.slice(0, 16)}
            </button>
          ))}
      </section>
    </aside>
  );
}
