import type { FunctionComponent } from "react";
import Card from "../components/Card";
import { BodyText, ImpactText } from "../components/Text";

const IndexPage: FunctionComponent = () => {
  return (
    <>
      <ImpactText>Hvad fanden er det her?</ImpactText>

      <BodyText>
        Specialklasen TM blev grundlagt i 2023 med missionen at fejre møder,
        drikke vin og tale om hvor fattig verden er. Vi tror på, at det at være
        anderledes er det, der gør os specielle, og vi er dedikerede til at
        fremvise de mest ekstraordinære individer og begivenheder, der udfordrer
        konventionelle normer.
      </BodyText>

      <br />

      <ImpactText>Mød medlemmerne</ImpactText>

      <BodyText>
        Vi består af en række unikke individer, der hver bringer deres egne
        specielle talenter og perspektiver til gruppen. Fra journalister,
        musikere, innovatører og tænkere. De fleste af dem er bare her for
        vinen.
      </BodyText>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1rem",
        }}
      >
        <Card>
          <Image src="/images/members/1.jpg" />
          <h3>Jeppe Bo Kibsgaard</h3>
          <p>Jeg er her bare for vinen 🍷</p>
        </Card>
        <Card>
          <Image src="/images/members/3.jpg" />
          <h3>Mads Sejer</h3>
          <p>Fuck det er fattigt 💸</p>
        </Card>
        <Card>
          <Image src="/images/members/6.jpg" />
          <h3>Jonas Tranberg</h3>
          <p>Om vi kan!</p>
        </Card>
        <Card>
          <Image src="/images/members/7.jpg" />
          <h3>Jacob Winther</h3>
          <p>Vil du med hjem og se mit vinkøleskab? 🍆</p>
        </Card>
        <Card>
          <Image src="/images/members/4.jpg" zoom={1.5} top={-50} left={-50} />
          <h3>Peter Ring</h3>
          <p>Wauw, det fortov ser blødt ud! ⭐⭐⭐⭐⭐</p>
        </Card>
      </div>
    </>
  );
};

interface ImageProps {
  src: string;
  zoom?: number;
  top?: number;
  left?: number;
}

const Image: FunctionComponent<ImageProps> = ({ src, zoom, top, left }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "200px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${zoom || 1})`,
          position: "absolute",
          top: `${top || 0}px`,
          left: `${left || 0}px`,
        }}
      />
    </div>
  );
};

export default IndexPage;
