import type { FunctionComponent } from 'react';
import LedgerSection from '../../components/LedgerSection';
import MemberPhoto from '../../components/MemberPhoto';
import PageIntro from '../../components/PageIntro';
import { BOARD_TERMS, type BoardPost } from '../../data/board';
import { getMember } from '../../data/members';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { formatDate } from '../../utils/format';
import styles from './index.module.scss';

const CHAIR = 'Formand';

// The four standing posts get a column each; whatever the fifth seat was called that year shares the last
const STANDING_POSTS = [CHAIR, 'Næstformand', 'Kasserer', 'Revisor'];
const otherPosts = [...new Set(BOARD_TERMS.flatMap((term) => term.posts.map((p) => p.post)).filter((post) => !STANDING_POSTS.includes(post)))];

const columns = [
  ...STANDING_POSTS.map((label) => ({ label, matches: (p: BoardPost) => p.post === label })),
  ...(otherPosts.length ? [{ label: otherPosts.join(' / '), matches: (p: BoardPost) => !STANDING_POSTS.includes(p.post) }] : []),
];

// One seat on the sitting board, set like a bottle label: vintage, name, origin
const Seat: FunctionComponent<{ post: BoardPost; year: number; lead: boolean }> = ({ post, year, lead }) => {
  const member = getMember(post.member);

  return (
    <li className={`${styles.seat} ${lead ? styles.lead : ''}`}>
      {member && <MemberPhoto image={member.image} alt={member.name} className={styles.seatPhoto} />}
      <div className={styles.label}>
        <span className={styles.vintage}>
          {year} · {post.post}
        </span>
        <span className={styles.nickname}>{post.title ?? post.post}</span>
        <span className={styles.member}>{member?.name ?? post.member}</span>
      </div>
    </li>
  );
};

const BoardPage: FunctionComponent = () => {
  useDocumentTitle('Bestyrelsen');

  const [current] = BOARD_TERMS;
  // the chair leads the sitting board
  const seats = current ? [...current.posts].sort((a, b) => Number(b.post === CHAIR) - Number(a.post === CHAIR)) : [];

  return (
    <>
      <PageIntro title="Bestyrelsen">
        <p>Klassens øverste ledelse, valgt på generalforsamlingen. Med titler derefter.</p>
      </PageIntro>

      {current && (
        <LedgerSection
          title="Siddende bestyrelse"
          tally={current.elected ? `Valgt ${formatDate(current.elected, { day: 'numeric', month: 'short', year: 'numeric' })}` : String(current.year)}
        >
          <ul className={styles.seats}>
            {seats.map((post) => (
              <Seat key={post.post} post={post} year={current.year} lead={post.post === CHAIR} />
            ))}
          </ul>
        </LedgerSection>
      )}

      <LedgerSection title="Gennem årene">
        {/* one row per year, so the table grows downwards as the years go by */}
        <table className={styles.history}>
          <thead>
            <tr>
              <th scope="col">År</th>
              {columns.map((column) => (
                <th key={column.label} scope="col">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BOARD_TERMS.map((term) => (
              <tr key={term.year}>
                <th scope="row" className={styles.year}>
                  {term.year}
                </th>
                {term.posts.length === 0 && (
                  <td colSpan={columns.length} className={styles.pending}>
                    Udfyldes snart
                  </td>
                )}
                {term.posts.length > 0 &&
                  columns.map((column) => {
                    const post = term.posts.find(column.matches);
                    const member = post && getMember(post.member);
                    return (
                      <td key={column.label} data-label={post?.post ?? column.label}>
                        {post ? (
                          <span className={styles.holder}>
                            {member && <MemberPhoto image={member.image} alt="" className={styles.avatar} />}
                            <span className={styles.holderText}>
                              <span className={styles.holderTitle}>{post.title ?? post.post}</span>
                              <span className={styles.holderName}>{member?.name.split(' ')[0] ?? post.member}</span>
                            </span>
                          </span>
                        ) : (
                          <span className={styles.empty}>—</span>
                        )}
                      </td>
                    );
                  })}
              </tr>
            ))}
          </tbody>
        </table>
      </LedgerSection>
    </>
  );
};

export default BoardPage;
