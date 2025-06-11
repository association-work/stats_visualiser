import { Link } from "react-router-dom";
import "./Navbar.css";
import data from "../../data.json";

export default function Navbar() {
  const years = data.themes[0].values;

  return (
    <>
      <section className="logo">
        <Link to="/">
          <h1>Logo</h1>
        </Link>
      </section>
      <section className="navigation">
        <select name="country" id="" className="country_box" disabled>
          <option value="France">France</option>
        </select>
        <select name="year" id="" className="year_box">
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
