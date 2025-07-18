import { Link } from "react-router-dom";
import "./DetailsButton.css";
import { useContext } from "react";
import GlobalContext from "../../contexts/GlobalContext";
import type { topicBranch } from "../../types/dataTypes";

interface DetailsBouttonProps {
  details: topicBranch;
}

export default function DetailsButton({ details }: DetailsBouttonProps) {
  const { isYear } = useContext(GlobalContext);

  const isvalue = details.values.filter((info) => info[0] === isYear);
  return (
    <Link
      to={`/Details/${details.id}`}
      className="branch_value"
      // ajout du chemin dans le breadcrumb ?
    >
      <p>{isvalue[0][1].toFixed(2) + " Mt CO2e"}</p>
      <p>{"+"}</p>
    </Link>
  );
}
