export interface Event {
  id?: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;

  // PocketBase relation (events -> albums)
  album?: string;
}
