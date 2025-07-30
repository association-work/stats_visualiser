import { Link } from "react-router-dom";
import "./Navbar.css";
import { useState } from "react";
import type { topicBranch } from "../../types/dataTypes";

interface NavBarProps {
  isYear: number;
  setIsYear: React.Dispatch<React.SetStateAction<number>>;
  topicOrigin: topicBranch;
}

export default function Navbar({
  setIsYear,
  isYear,
  topicOrigin,
}: NavBarProps) {
  const [location, setlocation] = useState(true);

  const changeParameter = () => {
    if (location === true) {
      setlocation(false);
    } else {
      setlocation(true);
    }
  };

  const years = topicOrigin.values.sort((a, b) => b[0] - a[0]);

  return (
    <>
      <section className="topNav">
        <Link to="/">
          <h1>Logo</h1>
        </Link>
        <label className="switch">
          <input type="checkbox" onChange={() => changeParameter()} />
          <span className="slider" />
        </label>
        {/* à mettre en place une fois les données géographiques ajouter à la BDD*/}
      </section>
      <section className="navigation">
        <select name="country" id="" className="country_box" disabled>
          {location === true ? (
            // Location option to adapt once more locations are available
            <option value="France">France</option>
          ) : (
            // Option to change according to choice in the tree
            <option value="to choose">To choose</option>
          )}
        </select>
        <select
          name="year"
          id=""
          className="year_box"
          onChange={(event) => {
            setIsYear(Number(event.target.value));
          }}
        >
          <option value="" key="option">
            {isYear}
          </option>
          {years &&
            years.map((year) => (
              <option value={year[0]} key={year[0]}>
                {year[0]}
              </option>
            ))}
        </select>
      </section>
    </>
  );
}
