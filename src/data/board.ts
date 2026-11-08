// The board as elected at each general meeting (from the minutes in notes/).
// Add a new term at the top; the page lists terms in this order.

export interface BoardPost {
  post: string;
  // the post's nickname that year, e.g. "Stordruen"
  title?: string;
  name: string;
}

export interface BoardTerm {
  year: number;
  // date of the general meeting that elected this board (YYYY-MM-DD)
  elected: string;
  posts: BoardPost[];
}

export const BOARD_TERMS: BoardTerm[] = [
  {
    year: 2025,
    elected: '2025-11-08',
    posts: [
      { post: 'Formand', title: 'Pinot Noirhty', name: 'Jeppe Bo Kibsgaard' },
      { post: 'Næstformand', title: 'Nippleolo', name: 'Mads Sejer' },
      { post: 'Kasserer', title: 'Tempranillhoe', name: 'Jonas Tranberg' },
      { post: 'Revisor', title: 'Cabaret Sissyvignon', name: 'Peter Ring' },
      { post: 'Pøbel', title: 'Zinfandelicious', name: 'Jacob Winther' },
    ],
  },
  {
    year: 2023,
    elected: '2023-11-23',
    posts: [
      { post: 'Formand', title: 'Stordruen', name: 'Jonas Tranberg' },
      { post: 'Næstformand', title: 'Ædeldruen', name: 'Jacob Winther' },
      { post: 'Kasserer', title: 'Stokken', name: 'Peter Ring' },
      { post: 'Suppleant', title: 'Lilledruen', name: 'Mads Sejer' },
      { post: 'Revisor', title: 'Plukkeren', name: 'Jeppe Bo Kibsgaard' },
    ],
  },
];
