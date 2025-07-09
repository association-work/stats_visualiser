import { Link } from "react-router-dom";
import "./Navbar.css";
import data from "../../data.json";
import { useContext, useState } from "react";
import GlobalContext from "../../contexts/GlobalContext";

export default function Navbar() {
  const years = data.themes[0].values;
  const { setIsYear } = useContext(GlobalContext);

  const [location, setlocation] = useState(true);

  const changeParameter = () => {
    if (location === true) {
      setlocation(false);
    } else {
      setlocation(true);
    }
  };

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
            Année
          </option>
          {years &&
            years.map((year) => (
              <option value={year.year} key={year.year}>
                {year.year}
              </option>
            ))}
        </select>
      </section>
    </>
  );
}
