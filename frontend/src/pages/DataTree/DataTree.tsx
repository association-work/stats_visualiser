import "./DataTree.css";
import BigData from "../../data.json";
import { useState } from "react";
// import ChosenDatas from "./../../components/ChosenDatas/ChosenDatas";
import DataButton from "../../components/DataButton/DataButton";
import BreadCrumbs from "./../../components/BreadCrumbs/BreadCrumbs";

export default function DataTree() {
  const entireTree = BigData.themes[0];
  const chosenPath: string[] = [];

  const [hasChildren, setHasChildren] = useState(false);

  return (
    <section>
      <BreadCrumbs chosenPath={chosenPath} />
      <DataButton
        information={entireTree}
        hasChildren={hasChildren}
        setHasChildren={setHasChildren}
        chosenPath={chosenPath}
      />
      {hasChildren && (
        <article className="linked_children">
          {entireTree.children.map((kid) => (
            <DataButton
              information={kid}
              hasChildren={hasChildren}
              setHasChildren={setHasChildren}
              chosenPath={chosenPath}
              key={kid.id}
            />
          ))}
        </article>
      )}
    </section>
  );
}
