import { Genre, GENRE_LABELS, GENRE_COLORS } from '@/types/genre';

interface GenrePillProps {
  genre: Genre;
}

export function GenrePill({ genre }: GenrePillProps) {
  const label = GENRE_LABELS[genre];
  const colors = GENRE_COLORS[genre];

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${colors.bg} ${colors.text}`}>
      {label}
    </span>
  );
}
