import type { FunctionComponent } from 'react';
import { IoArrowForward } from 'react-icons/io5';
import { Link } from 'react-router';
import Card from '../components/Card';
import MemberPhoto from '../components/MemberPhoto';
import LedgerSection from '../components/LedgerSection';
import PageIntro from '../components/PageIntro';
import { BodyText } from '../components/Text';
import { MEMBERS } from '../data/members';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useEvents } from '../services/api/events';
import type { Event } from '../models/event';
import { formatDate, parseDate, stripClubPrefix } from '../utils/format';
import styles from './index.module.scss';

// The next planned evening on the calendar; hidden when nothing is dated
const NextEvent: FunctionComponent = () => {
  const { data: events } = useEvents();
  if (!events) return null;

  const startOf = (event: Event) => parseDate(event.startDate)?.getTime() ?? 0;
  const event = events.filter((e) => startOf(e) > Date.now()).sort((a, b) => startOf(a) - startOf(b))[0];
  if (!event) return null;

  return (
    <Link to="/calendar" className={styles.nextEvent}>
      <span className={styles.nextDate}>{formatDate(event.startDate, { day: 'numeric', month: 'short' })}</span>
      <span className={styles.nextBody}>
        <span className={styles.nextLabel}>Næste gang · {formatDate(event.startDate, { weekday: 'long' })}</span>
        <span className={styles.nextTitle}>{stripClubPrefix(event.title)}</span>
        {event.location && <span className={styles.nextLocation}>{event.location}</span>}
      </span>
      <IoArrowForward aria-hidden className={styles.arrow} />
    </Link>
  );
};

const IndexPage: FunctionComponent = () => {
  useDocumentTitle();

  return (
    <>
      <PageIntro title="Hvad fanden er det her?">
        <p>
          Specialklasen TM blev grundlagt i 2023 med missionen at fejre møder, drikke vin og tale om hvor fattig verden er. Vi tror på, at det at være anderledes er det, der gør os
          specielle, og vi er dedikerede til at fremvise de mest ekstraordinære individer og begivenheder, der udfordrer konventionelle normer.
        </p>
      </PageIntro>

      <NextEvent />

      <LedgerSection title="Mød medlemmerne" tally={`${MEMBERS.length} medlemmer`}>
        <BodyText>
          Vi består af en række unikke individer, der hver bringer deres egne specielle talenter og perspektiver til gruppen. Fra journalister, musikere, innovatører og tænkere. De
          fleste af dem er bare her for vinen.
        </BodyText>

        <ul className={styles.members}>
          {MEMBERS.map((member) => (
            <li key={member.name}>
              <Card className={styles.memberCard}>
                <MemberPhoto image={member.image} alt={member.name} className={styles.imageFrame} />
                <div className={styles.memberBody}>
                  <blockquote className={styles.quote}>»{member.quote}«</blockquote>
                  <h3 className={styles.memberName}>{member.name}</h3>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </LedgerSection>
    </>
  );
};

export default IndexPage;
