import type { branch } from "../../types/dataTypes";
import "./BreadCrumbs.css";

interface BreadCrumbsProps {
  chosenPath: branch[];
  setChosenPath: any; // temporaire : à retrouver correctement
  setCurrentBranch: any; // temporaire : à retrouver correctement
}

export default function BreadCrumbs({
  chosenPath,
  setChosenPath,
  setCurrentBranch,
}: BreadCrumbsProps) {
  const handleRewindBranch = (index: number) => {
    chosenPath.forEach((choice, id) => {
      if (id === index) {
        setCurrentBranch(choice);
        let i = chosenPath.length - 1;
        while (i > id) {
          chosenPath.pop();
          i--;
        }
        setChosenPath(chosenPath);
      }
    });
  };
  return (
    <aside className="breadcrumbs">
      <section className="static_crumbs">
        {chosenPath.length > 0 &&
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
