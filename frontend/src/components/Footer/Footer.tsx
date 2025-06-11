import "./Footer.css";

export default function Footer() {
  const chosenPath: string[] = [];
  return (
    <>
      <section className="optional_crumbs">
        {chosenPath.length > 0 &&
          chosenPath.map((choice) => (
            <p className="crumbs" key={choice}>
              {choice}
            </p>
          ))}
      </section>
      <section className="static_crumbs">
        <p className="crumbs">Monde</p>
        <p className="crumbs">Europe</p>
        <p className="crumbs">France</p>
      </section>
    </>
  );
}
