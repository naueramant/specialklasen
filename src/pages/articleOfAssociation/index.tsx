import type { FunctionComponent } from "react";
import { BodyText, ImpactText } from "../../components/Text";
import styles from "./index.module.scss";

const ArticleOfAssociationPage: FunctionComponent = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <ImpactText>Vedtægter for Specialklasen</ImpactText>
      </header>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>§1 Logens navn</h2>
          <BodyText>
            Specialklasen (kan referes til som loge eller logen)
          </BodyText>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>§2 Logens hjemsted</h2>
          <div className={styles.subsection}>
            <p className={styles.subsectionTitle}>Stk 1.</p>
            <BodyText>Aarhus og/eller andre kommuner.</BodyText>
          </div>
          <div className={styles.subsection}>
            <p className={styles.subsectionTitle}>Stk 2.</p>
            <BodyText>
              Bestyrelsen kan ved en generalforsamling ændre logens hjemsted.
            </BodyText>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>§3 Logens formål</h2>
          <BodyText>
            Specialklasen skal styrke kendskabet til og indtagelsen af
            kvalitetsvin baseret på et bredt fagligt fundament. Derudover har
            logen til formål at sikre samvær mellem venner og bekendte –
            fremtidige som forhenværende.
          </BodyText>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>§4 Medlemskab</h2>
          <div className={styles.subsection}>
            <p className={styles.subsectionTitle}>Stk 1.</p>
            <BodyText>Logen må maksimalt bestå af seks medlemmer.</BodyText>
          </div>
          <div className={styles.subsection}>
            <p className={styles.subsectionTitle}>Stk 2.</p>
            <BodyText>
              Alle, der går ind for logens formål, kan blive medlem. Medlemskab
              skal godkendes af den siddende bestyrelse.
            </BodyText>
          </div>
          <div className={styles.subsection}>
            <p className={styles.subsectionTitle}>Stk 3.</p>
            <BodyText>
              Medlemskab af logen forudsætter betaling af kontingent såvel som
              aktiv deltagelse i logens aktiviteter. Hvis et medlem ikke er i
              stand til at betale, frafalder kontingentet for hele logen den
              pågældende måned.
            </BodyText>
          </div>
          <div className={styles.subsection}>
            <p className={styles.subsectionTitle}>Stk 4.</p>
            <BodyText>
              Bestyrelsen kan ekskludere et medlem ved afstemning, hvis
              vedkommende arbejder imod logen eller på anden vis udviser
              upassende adfærd. Det ekskluderede medlem kan skriftligt forlange,
              at eksklusionen bliver prøvet på førstkommende forsamling.
            </BodyText>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>§5 Generalforsamlingen</h2>
          <div className={styles.subsection}>
            <p className={styles.subsectionTitle}>Stk 1.</p>
            <BodyText>
              Generalforsamlingen er logens øverste myndighed og afholdes mindst
              én gang årligt.
            </BodyText>
          </div>
          <div className={styles.subsection}>
            <p className={styles.subsectionTitle}>Stk 2.</p>
            <BodyText>
              Generalforsamlingen indkaldes via sms, mail eller anden
              chat-service til alle medlemmer.
            </BodyText>
          </div>
          <div className={styles.subsection}>
            <p className={styles.subsectionTitle}>Stk 3.</p>
            <BodyText>
              Forslag til dagsordenen sendes til bestyrelsen senest 14 dage før,
              og medlemmerne skal have kendskab til den endelige dagsorden
              senest 8 dage før.
            </BodyText>
          </div>
          <div className={styles.subsection}>
            <p className={styles.subsectionTitle}>Stk 4.</p>
            <BodyText>
              Stemmeret i logen: Alle medlemmer, der er fyldt 18 år, har
              stemmeret. Alle medlemmer har én stemme.
            </BodyText>
          </div>
          <div className={styles.subsection}>
            <p className={styles.subsectionTitle}>Stk 5.</p>
            <BodyText>
              Alle, der er fyldt 18 år, kan vælges til bestyrelsen.
            </BodyText>
          </div>
          <div className={styles.subsection}>
            <p className={styles.subsectionTitle}>Stk 6.</p>
            <BodyText>
              Alle afgørelser vedtages med 80 procents enstemmighed – dog skal
              vedtægtsændringer besluttes med enstemmighed. Alle afstemninger
              afgøres ved håndsoprækning. Dog skal der være skriftlig
              afstemning, hvis dirigenten bestemmer det, eller hvis 3 medlemmer
              på generalforsamlingen ønsker det - samt ved alle kampvalg.
            </BodyText>
          </div>
          <div className={styles.subsection}>
            <p className={styles.subsectionTitle}>Stk 7.</p>
            <BodyText>
              Generalforsamlingen kan ikke afholdes, før alle
              bestyrelsesmedlemmer og fremmødte har vin i glasset og førnævnte
              glas i hånden.
            </BodyText>
          </div>
          <div className={styles.subsection}>
            <p className={styles.subsectionTitle}>Stk 8.</p>
            <BodyText>Generalforsamlingens dagsorden</BodyText>
            <ul className={styles.agenda}>
              <li>Valg af dirigent og stemmetællere</li>
              <li>Alle skal have vin i glasset</li>
              <li>Bestyrelsens beretning</li>
              <li>Fremlæggelse af regnskab til godkendelse</li>
              <li>Fastsættelse af kontingent</li>
              <li>Indkomne forslag</li>
              <li>Fremlæggelse af handlingsplan og budget</li>
              <li>Valg af bestyrelse og suppleant</li>
              <li>Valg af revisor</li>
              <li>Evt.</li>
            </ul>
          </div>
          <div className={styles.subsection}>
            <p className={styles.subsectionTitle}>Stk 9.</p>
            <BodyText>
              Bestyrelsen har ansvaret for, at der tages referat af mødet. Ved
              enstemmighed kan dette frafalde.
            </BodyText>
          </div>
          <div className={styles.subsection}>
            <p className={styles.subsectionTitle}>Stk 10.</p>
            <BodyText>
              Bestyrelsen kan beslutte, at generalforsamlingen helt eller
              delvist afvikles digitalt, hvis forhold gør det umuligt at afvikle
              generalforsamlingen som et fysisk møde.
            </BodyText>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            §6 Ekstraordinær generalforsamling
          </h2>
          <div className={styles.subsection}>
            <p className={styles.subsectionTitle}>Stk 1.</p>
            <BodyText>
              Et flertal i bestyrelsen kan indkalde til en ekstraordinær
              generalforsamling, og bestyrelsen skal indkalde til en
              ekstraordinær generalforsamling, når mindst 3 medlemmer ønsker
              det.
            </BodyText>
          </div>
          <div className={styles.subsection}>
            <p className={styles.subsectionTitle}>Stk 2.</p>
            <BodyText>
              Indkaldelsen til den ekstraordinære generalforsamling skal ske
              senest 14 dage efter modtagelsen af begæringen. Med indkaldelsen
              sendes den endelige dagsorden. Varsling som ved den ordinære
              generalforsamling.
            </BodyText>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>§7 Bestyrelsen</h2>
          <div className={styles.subsection}>
            <p className={styles.subsectionTitle}>Stk 1.</p>
            <BodyText>
              Bestyrelsen står for den daglige ledelse af logen mellem de årlige
              generalforsamlinger.
            </BodyText>
          </div>
          <div className={styles.subsection}>
            <p className={styles.subsectionTitle}>Stk 2.</p>
            <BodyText>
              Medlemmer i bestyrelsen: Bestyrelsen består af 5 medlemmer, der
              efter generalforsamlingen fordeler posterne mellem sig, med
              minimum en formand, næstformand og en kasserer.
            </BodyText>
          </div>
          <div className={styles.subsection}>
            <p className={styles.subsectionTitle}>Stk 3.</p>
            <BodyText>Bestyrelsen vælges for 1 år og kan genvælges.</BodyText>
          </div>
          <div className={styles.subsection}>
            <p className={styles.subsectionTitle}>Stk 4.</p>
            <BodyText>
              Der vælges hvert år en suppleant til rollen som kasserer eller
              næstformand. Hvis kasserer eller næstformand forlader bestyrelsen
              i valgperioden, indtræder suppleanten i stedet.
            </BodyText>
          </div>
          <div className={styles.subsection}>
            <p className={styles.subsectionTitle}>Stk 5.</p>
            <BodyText>
              Bestyrelsen er beslutningsdygtig, når mindst halvdelen af
              bestyrelsens medlemmer er til stede.
            </BodyText>
          </div>
          <div className={styles.subsection}>
            <p className={styles.subsectionTitle}>Stk 6.</p>
            <BodyText>
              Bestyrelsen kan ved en forsamling vælge at udarbejde et
              aftalepapir for dets interne samarbejde og kan nedsætte
              arbejsgrupper efter behov.
            </BodyText>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>§8 Regnskab/økonomi</h2>
          <div className={styles.subsection}>
            <p className={styles.subsectionTitle}>Stk 1.</p>
            <BodyText>
              Regnskabsåret er kalenderåret (regnskabsperioden er 1/1-31/12)
            </BodyText>
          </div>
          <div className={styles.subsection}>
            <p className={styles.subsectionTitle}>Stk 2.</p>
            <BodyText>
              Regnskabet føres af kassereren og skal indeholde oversigt over
              indtægter og udgifter samt en status. Bestyrelsen er ansvarlig for
              at udarbejde regnskabet.
            </BodyText>
          </div>
          <div className={styles.subsection}>
            <p className={styles.subsectionTitle}>Stk 3.</p>
            <BodyText>
              Regnskabet forelægges bestyrelsen løbende samt tilses og revideres
              af den af generalforsamlingen valgte revisor.
            </BodyText>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>§9 Dispositionsret</h2>
          <div className={styles.subsection}>
            <p className={styles.subsectionTitle}>Stk 1.</p>
            <BodyText>
              Det er formanden eller kassereren i logen med et andet
              bestyrelsesmedlem, der har ret til at indgå aftaler på logens
              vegne. Ved køb eller salg med logens midler og aktiver skal hele
              bestyrelsen skriftlig godkende aftalen. Bestyrelsen kan give et
              udvalg eller en person fuldmagt til at foretage dispositioner på
              vegne af logen.
            </BodyText>
          </div>
          <div className={styles.subsection}>
            <p className={styles.subsectionTitle}>Stk 2.</p>
            <BodyText>
              Resten af bestyrelsen skal orienteres ved eventuelle køb og salg
              af varer. Logens midler skal altid være minimum 0 kr., og der må
              kun undtagelsesvist være et skyldigt beløb til logen. Bestyrelsen
              skal orienteres om det skyldige beløb, og det påhviler bestyrelsen
              at genoprette balancen, således logen har minimum 0 kr.
            </BodyText>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>§10 Vedtægtsændringer</h2>
          <BodyText>
            Ændringer af vedtægterne kan vedtages på en ordinær eller
            ekstraordinær generalforsamling, når forslaget er indsendt til tiden
            og mindst 4/5 af de fremmødte stemmeberettigede stemmer for
            forslaget.
          </BodyText>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>§11 Opløsning af logen</h2>
          <div className={styles.subsection}>
            <p className={styles.subsectionTitle}>Stk 1.</p>
            <BodyText>
              Logen kan opløses på en ekstraordinær generalforsamling, hvor
              mindst halvdelen af logens medlemmer er til stede. Der kræves
              mindst 3/4 af de afgivne stemmer for at forslaget kan vedtages.
              Hvis det nødvendige flertal på 3/4 for en opløsning opnås, men med
              under halvdelen af medlemmerne til stede, indkaldes til endnu en
              ekstraordinær generalforsamling, hvor beslutning om logens
              opløsning kan vedtages med 3/4 af de afgivne stemmer uanset
              antallet af fremmødte.
            </BodyText>
          </div>
          <div className={styles.subsection}>
            <p className={styles.subsectionTitle}>Stk 2.</p>
            <BodyText>
              I tilfælde af opløsning gives logens formue til almennyttige
              formål, som besluttes på den opløsende generalforsamling.
            </BodyText>
          </div>
        </section>

        <footer className={styles.footer}>
          <div className={styles.adoption}>
            <BodyText>
              Vedtaget på den stiftende generalforsamling den 21.11.2023.
            </BodyText>
          </div>

          <div className={styles.signature}>
            <div className={styles.signatureLine}></div>
            <p className={styles.signatureLabel}>Dirigent</p>
            <p className={styles.signatureName}>Peter Ring Pedersen</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ArticleOfAssociationPage;
