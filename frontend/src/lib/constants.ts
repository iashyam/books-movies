export const PAGE_SIZE = 25;

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export const MY_LISTS = [
  { label: 'To be Watched', resource: 'movies', status: 'watchlist' },
  { label: 'TBR (Books)', resource: 'books', status: 'toRead' },
];
