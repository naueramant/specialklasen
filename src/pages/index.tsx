import type { FunctionComponent } from "react";
import Card from "../components/Card";
import { BodyText, ImpactText } from "../components/Text";

const IndexPage: FunctionComponent = () => {
  return (
    <>
      <ImpactText>What the hell is this?</ImpactText>

      <BodyText>
        Specialklasen TM was founded in 2023 with the mission to celebrate to
        meetup, drink wine and talk about how poor the world is. We believe that
        being different is what makes us special, and we are dedicated to
        showcasing the most extraordinary individuals and events that defy
        conventional norms.
      </BodyText>

      <ImpactText>The members</ImpactText>

      <BodyText>
        We consists of a variety of unique individuals, each bringing their own
        special talents and perspectives to the group. From journalists,
        musicians, innovators, and thinkers. Most of them are just here for the
        wine.
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
