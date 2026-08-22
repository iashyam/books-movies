import { Genre, GENRE_LABELS, WatchGenre, WATCH_GENRE_LABELS } from '@/types/genre';

interface GenrePillProps {
  genre: Genre | WatchGenre;
  isWatchGenre?: boolean;
}

export function GenrePill({ genre, isWatchGenre }: GenrePillProps) {
  const label = isWatchGenre
    ? WATCH_GENRE_LABELS[genre as WatchGenre]
    : GENRE_LABELS[genre as Genre];

  return <span className="text-sm text-muted">{label}</span>;
}
