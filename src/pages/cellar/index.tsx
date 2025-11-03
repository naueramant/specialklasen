import type { FunctionComponent } from "react";
import { BodyText } from "../../components/Text";
import WineTable from "./components/WineTable";
import wines from "./data";

const CellarPage: FunctionComponent = () => {
  const remainingWines = wines.reduce(
    (total, wine) => total + wine.quantity,
    0
  );

  const drunkWines = wines.reduce(
    (total, wine) =>
      total +
      (wine.quantityLeft !== undefined ? wine.quantity - wine.quantityLeft : 0),
    0
  );

  return (
    <>
      <BodyText>
        We currently have {remainingWines} wines in our cellar and {drunkWines}{" "}
        wines have been consumed 🎉
      </BodyText>

      <WineTable wines={wines} />
    </>
  );
};

export default CellarPage;
