import { Link } from "react-router-dom";
import "./DetailsButton.css";
import { useContext } from "react";
import GlobalContext from "../../contexts/GlobalContext";
import type { branch } from "../../types/dataTypes";

interface DetailsBouttonProps {
  details: branch;
}

export default function DetailsButton({ details }: DetailsBouttonProps) {
  const { isYear } = useContext(GlobalContext);

  const isvalue = details.values.filter((info) => info.year === isYear)[0];
  return (
    <Link
      to={`/Details/${details.id}`}
      className="branch_value"
      // ajout du chemin dans le breadcrumb ?
    >
      <p>{isvalue.value.toFixed(2) + " Mt CO2e"}</p>
      <p>{"+"}</p>
    </Link>
  );
}
