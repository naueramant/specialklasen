export interface Album {
  id: string;
  collectionId?: string;
  collectionName?: string;
  title: string;
  images: string[];
  files?: string[];
  date: string;
}
