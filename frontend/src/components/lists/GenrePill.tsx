import { Genre, GENRE_LABELS } from '@/types/genre';

interface GenrePillProps {
  genre: Genre;
}

export function GenrePill({ genre }: GenrePillProps) {
  const label = GENRE_LABELS[genre];

  return <span className="text-sm text-muted">{label}</span>;
}
