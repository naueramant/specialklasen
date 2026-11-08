// Files offered on the Downloads page. Put the file (and an optional preview image) in
// public/ and add an entry here; the page lists them in this order.

export interface Download {
  title: string;
  description: string;
  // path under public/
  file: string;
  // the name the file is saved as
  fileName: string;
  // shown on the button, e.g. "PDF, 1 MB"
  format: string;
  // optional preview image under public/, ideally the first page
  preview?: string;
}

export const DOWNLOADS: Download[] = [
  {
    title: 'Smagsark',
    description: 'Print og tag med til smagningen. To ark pr. A4-side, med en nem udgave nederst for dem, der bare vil vælge en smiley.',
    file: '/tasting/tasting_sheet.pdf',
    fileName: 'specialklasen-smagsark.pdf',
    format: 'PDF, 1 MB',
    preview: '/tasting/tasting_sheet.png',
  },
];
