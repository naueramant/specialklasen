export interface Wine {
  name: string;
  year: number;
  country: string;
  region: string;
  grape: string;
  kind: string;
  boughtAt: Date;
  quantity: number;
  quantityLeft?: number;
}
