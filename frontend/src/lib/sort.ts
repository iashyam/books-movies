interface Sortable {
  title: string;
  startDate: string;
  endDate: string;
}

const ZERO_TIME = '0001-01-01T00:00:00Z';

function parseDate(isoString: string): Date | null {
  if (!isoString || isoString === ZERO_TIME) return null;
  const date = new Date(isoString);
  return isNaN(date.getTime()) ? null : date;
}

export function sortByRecentActivity<T extends Sortable>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const aEndDate = parseDate(a.endDate);
    const bEndDate = parseDate(b.endDate);

    // Both have endDate: sort descending
    if (aEndDate && bEndDate) {
      return bEndDate.getTime() - aEndDate.getTime();
    }

    // Only one has endDate: prioritize that one
    if (aEndDate) return -1;
    if (bEndDate) return 1;

    // Neither has endDate: fall back to startDate descending
    const aStartDate = parseDate(a.startDate);
    const bStartDate = parseDate(b.startDate);

    if (aStartDate && bStartDate) {
      return bStartDate.getTime() - aStartDate.getTime();
    }

    if (aStartDate) return -1;
    if (bStartDate) return 1;

    // Tiebreaker: title A-Z
    return a.title.localeCompare(b.title);
  });
}

export function sortByTitleAsc<T extends Sortable>(items: T[]): T[] {
  return [...items].sort((a, b) => a.title.localeCompare(b.title));
}

export function sortByTitleDesc<T extends Sortable>(items: T[]): T[] {
  return [...items].sort((a, b) => b.title.localeCompare(a.title));
}
