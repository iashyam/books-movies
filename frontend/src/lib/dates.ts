const ZERO_TIME = '0001-01-01T00:00:00Z';

export function formatDate(isoString: string): string {
  if (!isoString || isoString === ZERO_TIME) {
    return '—';
  }
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      return '—';
    }
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch {
    return '—';
  }
}
