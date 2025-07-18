import "./BreadCrumbs.css";
import { useContext } from "react";
import GlobalContext from "../../contexts/GlobalContext";

export default function BreadCrumbs() {
  const { chosenPath, setChosenPath, setCurrentBranch } =
    useContext(GlobalContext);

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
      <section className="static_crumbs">
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
              {choice.name.length < 15 ? choice.name : choice.name.slice(0, 15)}
            </button>
          ))}
      </section>
    </aside>
  );
}
