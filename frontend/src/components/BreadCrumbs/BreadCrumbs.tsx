import "./BreadCrumbs.css";
import type { topicBranch } from "../../types/dataTypes";

interface BreadCrumbsProps {
  chosenPath: topicBranch[];
  setChosenPath: React.Dispatch<React.SetStateAction<topicBranch[]>>;
  setCurrentBranch: React.Dispatch<React.SetStateAction<topicBranch>>;
}

export default function BreadCrumbs({
  chosenPath,
  setChosenPath,
  setCurrentBranch,
}: BreadCrumbsProps) {
  const handleRewindBranch = (index: number) => {
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
            >
              {choice.name.length < 15 ? choice.name : choice.name.slice(0, 15)}
            </button>
          ))}
      </section>
    </aside>
  );
}
