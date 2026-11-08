export interface Event {
  id?: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;

  // PocketBase relation (events -> albums)
  album?: string;

  // Use an existing file from the related album as cover (store filename only; no reupload)
  coverFromAlbum?: string;

  // Optionally expanded album record (used to generate file URLs for coverFromAlbum)
  albumExpanded?: {
    id: string;
    collectionId?: string;
    collectionName?: string;
    images: string[];
    title?: string;
    date?: string;
  };

  // Optional PocketBase file field (single file) used as a cover image
  coverImage?: string;

  // PocketBase metadata (required for pb.files.getURL)
  collectionId?: string;
  collectionName?: string;
}
