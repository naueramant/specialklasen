import type { FunctionComponent } from "react";
import WineTable from "./components/WineTable";
import wines from "./data";

const CellarPage: FunctionComponent = () => {
  return (
    <>
      <WineTable wines={wines} />
    </>
  );
};

export default CellarPage;
