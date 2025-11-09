import type { FunctionComponent } from "react";
import { BodyText } from "../../components/Text";
import { useWines } from "../../services/api/wines";
import WineTable from "./components/WineTable";

const CellarPage: FunctionComponent = () => {
  const { data: wines } = useWines();

  const remainingWines = wines?.reduce(
    (total, wine) => total + wine.quantity,
    0
  );

  const drunkWines = wines?.reduce(
    (total, wine) =>
      total +
      (wine.remaining !== undefined ? wine.quantity - wine.remaining : 0),
    0
  );

  return (
    <>
      <BodyText>
        Vi har i øjeblikket {remainingWines} vine i vores kælder og {drunkWines}{" "}
        vine er blevet konsumeret 🎉
      </BodyText>

      <WineTable wines={wines} />
    </>
  );
};

export default CellarPage;
