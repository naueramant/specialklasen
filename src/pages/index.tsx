import type { FunctionComponent } from "react";
import Card from "../components/Card";
import { BodyText, ImpactText } from "../components/Text";
import styles from "./index.module.scss";

const IndexPage: FunctionComponent = () => {
  return (
    <div className={styles.indexPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <ImpactText>Welcome to Specialklasen</ImpactText>
          <div className={styles.subtitle}>
            <BodyText>
              Est. 2023 • A Danish wine society dedicated to extraordinary tastings, 
              meaningful conversations, and celebrating life's finest moments.
            </BodyText>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className={styles.about}>
        <div className={styles.aboutContent}>
          <h2 className={styles.sectionTitle}>Our Story</h2>
          <BodyText>
            Specialklasen was founded in 2023 with a simple mission: to bring together 
            curious minds over exceptional wines. We believe that the best conversations 
            happen when great people share great wine, and we're dedicated to creating 
            memorable experiences that celebrate both.
          </BodyText>
          <BodyText>
            Whether we're exploring rare vintages, discussing life's complexities, or 
            simply enjoying each other's company, every gathering is an opportunity to 
            discover something new.
          </BodyText>
        </div>
      </section>

      {/* Members Section */}
      <section className={styles.members}>
        <div className={styles.membersHeader}>
          <h2 className={styles.sectionTitle}>Meet Our Members</h2>
          <BodyText>
            A diverse group of journalists, musicians, innovators, and free thinkers. 
            Each bringing their unique perspective to our tastings... though let's be honest, 
            most are just here for the wine.
          </BodyText>
        </div>

        <div className={styles.memberGrid}>
          <Card>
            <Image src="/images/members/1.jpg" />
            <div className={styles.memberInfo}>
              <h3>Jeppe Bo Kibsgaard</h3>
              <p className={styles.memberQuote}>Jeg er her bare for vinen 🍷</p>
            </div>
          </Card>
          
          <Card>
            <Image src="/images/members/3.jpg" />
            <div className={styles.memberInfo}>
              <h3>Mads Sejer</h3>
              <p className={styles.memberQuote}>Fuck det er fattigt 💸</p>
            </div>
          </Card>
          
          <Card>
            <Image src="/images/members/6.jpg" />
            <div className={styles.memberInfo}>
              <h3>Jonas Tranberg</h3>
              <p className={styles.memberQuote}>Om vi kan!</p>
            </div>
          </Card>
          
          <Card>
            <Image src="/images/members/7.jpg" />
            <div className={styles.memberInfo}>
              <h3>Jacob Winther</h3>
              <p className={styles.memberQuote}>Vil du med hjem og se mit vinkøleskab? 🍆</p>
            </div>
          </Card>
          
          <Card>
            <Image src="/images/members/4.jpg" zoom={1.5} top={-50} left={-50} />
            <div className={styles.memberInfo}>
              <h3>Peter Ring</h3>
              <p className={styles.memberQuote}>Wauw, det fortov ser blødt ud! ⭐⭐⭐⭐⭐</p>
            </div>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2 className={styles.sectionTitle}>Join Our Next Tasting</h2>
          <BodyText>
            Curious about our upcoming events? Check out our calendar to see when 
            we're gathering next, or explore our cellar to discover what we've been enjoying.
          </BodyText>
          <div className={styles.ctaButtons}>
            <Card variant="outlined">
              <a href="/calendar" className={styles.ctaLink}>
                View Calendar
              </a>
            </Card>
            <Card variant="outlined">
              <a href="/cellar" className={styles.ctaLink}>
                Explore Cellar
              </a>
            </Card>
          </div>
        </div>
      </section>
    </div>
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
