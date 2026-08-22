import { MovieStatus, BookStatus, ShowStatus } from './models';

export const MOVIE_STATUS_LABELS: Record<MovieStatus, string> = {
  watchlist: 'TBW',
  currentlyWatching: 'Watching',
  watched: 'Completed',
};

export const MOVIE_STATUS_COLORS: Record<MovieStatus, { bg: string; text: string }> = {
  watchlist: { bg: 'bg-gray-100', text: 'text-gray-700' },
  currentlyWatching: { bg: 'bg-amber-100', text: 'text-amber-700' },
  watched: { bg: 'bg-green-100', text: 'text-green-700' },
};

export const BOOK_STATUS_LABELS: Record<BookStatus, string> = {
  toRead: 'TBR',
  currentlyReading: 'Reading',
  read: 'Completed',
};

export const BOOK_STATUS_COLORS: Record<BookStatus, { bg: string; text: string }> = {
  toRead: { bg: 'bg-gray-100', text: 'text-gray-700' },
  currentlyReading: { bg: 'bg-amber-100', text: 'text-amber-700' },
  read: { bg: 'bg-green-100', text: 'text-green-700' },
};

export const SHOW_STATUS_LABELS: Record<ShowStatus, string> = {
  watchlist: 'TBW',
  currentlyWatching: 'Watching',
  watched: 'Completed',
};

export const SHOW_STATUS_COLORS: Record<ShowStatus, { bg: string; text: string }> = {
  watchlist: { bg: 'bg-gray-100', text: 'text-gray-700' },
  currentlyWatching: { bg: 'bg-amber-100', text: 'text-amber-700' },
  watched: { bg: 'bg-green-100', text: 'text-green-700' },
};
