// The board as elected at each general meeting (from the minutes in notes/).
// Add a new term at the top; the page lists terms in this order.

export interface BoardPost {
  post: string;
  // the post's nickname that year, e.g. "Stordruen"
  title?: string;
  // id from src/data/members.ts
  member: string;
}

export interface BoardTerm {
  year: number;
  // date of the general meeting that elected this board (YYYY-MM-DD), when known
  elected?: string;
  posts: BoardPost[];
}

export const BOARD_TERMS: BoardTerm[] = [
  {
    year: 2026,
    posts: [
      { post: 'Formand', title: 'Vinfaderen', member: 'jacob' },
      { post: 'Næstformand', title: 'Helligårgangen', member: 'jonas' },
      { post: 'Kasserer', title: 'Kirken', member: 'jeppe' },
      { post: 'Revisor', title: 'Pontius Bilatus', member: 'mads' },
      { post: 'Pøbel', title: 'Joseph', member: 'peter' },
    ],
  },
  {
    year: 2025,
    elected: '2025-11-08',
    posts: [
      { post: 'Formand', title: 'Pinot Noirhty', member: 'jeppe' },
      { post: 'Næstformand', title: 'Nippleolo', member: 'mads' },
      { post: 'Kasserer', title: 'Tempranillhoe', member: 'jonas' },
      { post: 'Revisor', title: 'Cabaret Sissyvignon', member: 'peter' },
      { post: 'Pøbel', title: 'Zinfandelicious', member: 'jacob' },
    ],
  },
  // not in the minutes yet; an empty list shows as "Udfyldes snart"
  {
    year: 2024,
    posts: [],
  },
  {
    year: 2023,
    elected: '2023-11-23',
    posts: [
      { post: 'Formand', title: 'Stordruen', member: 'jonas' },
      { post: 'Næstformand', title: 'Ædeldruen', member: 'jacob' },
      { post: 'Kasserer', title: 'Stokken', member: 'peter' },
      { post: 'Suppleant', title: 'Lilledruen', member: 'mads' },
      { post: 'Revisor', title: 'Plukkeren', member: 'jeppe' },
    ],
  },
];
