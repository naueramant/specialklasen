const isValidDate = (date: Date) => !Number.isNaN(date.getTime());

// PocketBase returns an empty string for unset dates, so guard before formatting
export const parseDate = (value: string | undefined): Date | null => {
  if (!value) return null;
  const date = new Date(value);
  return isValidDate(date) ? date : null;
};

export const formatDate = (value: string | undefined, options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }, fallback = '—') => {
  const date = parseDate(value);
  return date ? date.toLocaleDateString('da-DK', options) : fallback;
};

export const formatTime = (value: string | undefined) => {
  const date = parseDate(value);
  return date ? date.toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit', hour12: false }) : '';
};

// Wines without a vintage are stored with year 0
export const formatVintage = (year: number | undefined) => (year ? String(year) : 'NV');

const WINE_KIND_LABELS: Record<string, string> = {
  red: 'Rød',
  white: 'Hvid',
  rosé: 'Rosé',
  sparkling: 'Mousserende',
  dessert: 'Dessert',
};

export const formatWineKind = (kind: string | undefined) => {
  if (!kind) return '—';
  return WINE_KIND_LABELS[kind.toLowerCase()] ?? kind;
};

const VIDEO_EXTENSIONS = ['mp4', 'mov', 'webm', 'm4v'];

export const isVideoFile = (fileName: string) => VIDEO_EXTENSIONS.includes(fileName.split('.').pop()?.toLowerCase() ?? '');

// "Specialklasen - …" in album and event titles is redundant on the club's own site; "Vinlotteriet - …" stays
export const stripClubPrefix = (title: string) => title.replace(/^specia(l)?klasen\s*[-–]\s*/i, '');
