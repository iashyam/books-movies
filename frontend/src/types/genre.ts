export type Genre =
  | 'anyBook'
  | 'travel'
  | 'thriller'
  | 'scienceFiction'
  | 'popularScience'
  | 'classic'
  | 'magicRealism'
  | 'contemporaryFiction'
  | 'fantasy';

export const GENRE_LABELS: Record<Genre, string> = {
  anyBook: 'General',
  travel: 'Travel',
  thriller: 'Thriller',
  scienceFiction: 'Science Fiction',
  popularScience: 'Popular Science',
  classic: 'Classic',
  magicRealism: 'Magic Realism',
  contemporaryFiction: 'Contemporary Fiction',
  fantasy: 'Fantasy',
};

export const GENRE_COLORS: Record<Genre, { bg: string; text: string }> = {
  anyBook: { bg: 'bg-gray-100', text: 'text-gray-700' },
  travel: { bg: 'bg-amber-100', text: 'text-amber-700' },
  thriller: { bg: 'bg-red-100', text: 'text-red-700' },
  scienceFiction: { bg: 'bg-indigo-100', text: 'text-indigo-700' },
  popularScience: { bg: 'bg-teal-100', text: 'text-teal-700' },
  classic: { bg: 'bg-stone-100', text: 'text-stone-700' },
  magicRealism: { bg: 'bg-purple-100', text: 'text-purple-700' },
  contemporaryFiction: { bg: 'bg-pink-100', text: 'text-pink-700' },
  fantasy: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
};
