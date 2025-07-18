import { Link } from "react-router-dom";
import "./Navbar.css";
import { useContext, useEffect, useState } from "react";
import GlobalContext from "../../contexts/GlobalContext";
import { GetTopics } from "../../functions/GetTopic";

export default function Navbar() {
  const {
    setIsYear,
    isYear,
    setChosenPath,
    currentBranch,
    setCurrentBranch,
    setTopicOrigin,
    topicOrigin,
  } = useContext(GlobalContext);

  const [location, setlocation] = useState(true);

  const changeParameter = () => {
    if (location === true) {
      setlocation(false);
    } else {
      setlocation(true);
    }
  };

  useEffect(() => {
    GetTopics().then((data) => {
      setChosenPath([currentBranch, data[0]]);
      setCurrentBranch(data[0]);
      setTopicOrigin(data[0]);
    });
  }, []);

  const years = topicOrigin.values;

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
