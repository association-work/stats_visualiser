import { Link } from "react-router-dom";
import "./Navbar.css";
import type { topicBranch } from "../../types/dataTypes";
import dropDownArrow from "../../assets/chevron-down.svg";

interface NavBarProps {
  setIsYear: React.Dispatch<React.SetStateAction<number>>;
  topicOrigin: topicBranch;
  currentBranch: topicBranch;
}

export default function Navbar({
  setIsYear,
  topicOrigin,
  currentBranch,
}: NavBarProps) {
  // à mettre en place une fois les données géographiques ajouter à la BDD pour activer le toggle boutton
  // const [location, setlocation] = useState(true);

  // const changeParameter = () => {
  //   if (location === true) {
  //     setlocation(false);
  //   } else {
  //     setlocation(true);
  //   }
  // };

  const years = topicOrigin.values.sort((a, b) => b[0] - a[0]);

  return (
    <>
      <section className="topNav">
        <Link to="/">
          <h1>Logo</h1>
        </Link>
        {/* <label className="switch">
          <input type="checkbox" onChange={() => changeParameter()} />
          <span className="slider" />
        </label>
        à mettre en place une fois les données géographiques ajouter à la BDD */}
      </section>
      {currentBranch.unit !== "" && (
        <section className="navigation">
          <div className="environnement_list">
            <select name="country" id="" className="country_box" disabled>
              {/* {location === true ? (A activer quand le choix est possible !!*/}
              // Location option to adapt once more locations are available
              <option value="France">France</option>
              {/* ) : (
              // Option to change according to choice in the tree
              <option value="to choose">To choose</option>
            )} A activer quand le choix est possible !!*/}
            </select>
            {/* <img src={dropDownArrow} alt="dropdown-arrow" />  A activer quand le choix est possible !!*/}
          </div>
          <div className="year_list">
            <select
              name="year"
              id=""
              className="year_box"
              onChange={(event) => {
                setIsYear(Number(event.target.value));
              }}
              defaultValue={""}
            >
              {years &&
                years.map((year) => (
                  <option value={year[0]} key={year[0]}>
                    {year[0]}
                  </option>
                ))}
            </select>
            <img src={dropDownArrow} alt="dropdown-arrow" />
          </div>
        </section>
      )}
    </>
  );
}
