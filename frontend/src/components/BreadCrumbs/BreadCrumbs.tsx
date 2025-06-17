import "./BreadCrumbs.css";

interface BreadCrumbsProps {
  chosenPath: string[];
}

export default function BreadCrumbs({ chosenPath }: BreadCrumbsProps) {
  return (
    <aside className="breadcrumbs">
      <section className="static_crumbs">
        {chosenPath.length > 0 &&
          chosenPath.map((choice) => (
            <p className="crumbs" key={choice}>
              {choice}
            </p>
          ))}
      </section>
    </aside>
  );
}
