export interface MemberImage {
  src: string;
  // where the face is, as a CSS position (default: centre); also the point to zoom into
  focus?: string;
  zoom?: number;
}

export interface Member {
  id: string;
  name: string;
  quote: string;
  image: MemberImage;
}

export const MEMBERS: Member[] = [
  { id: 'jeppe', name: 'Jeppe Bo Kibsgaard', quote: 'Jeg er her bare for vinen 🍷', image: { src: '/images/members/1.jpg' } },
  { id: 'mads', name: 'Mads Sejer', quote: 'Fuck det er fattigt 💸', image: { src: '/images/members/2.jpg' } },
  { id: 'jonas', name: 'Jonas Tranberg', quote: 'Om vi kan!', image: { src: '/images/members/3.jpg' } },
  { id: 'jacob', name: 'Jacob Winther', quote: 'Vil du med hjem og se mit vinkøleskab? 🍆', image: { src: '/images/members/4.jpg' } },
  // a group photo, so zoom in on Peter in the bottom right corner
  { id: 'peter', name: 'Peter Ring', quote: 'Wauw, det fortov ser blødt ud! ⭐⭐⭐⭐⭐', image: { src: '/images/members/5.jpg', focus: '80% 72%', zoom: 1.8 } },
];

export const getMember = (id: string) => MEMBERS.find((member) => member.id === id);
