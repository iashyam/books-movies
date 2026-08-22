'use client';

import { useMemo } from 'react';
import { BookOpen, Film, Clock, FileText } from 'lucide-react';
import { useEntityList } from '@/lib/queries';
import { Book, Movie } from '@/types/models';

function isSameYear(dateStr: string, year: number): boolean {
  const d = new Date(dateStr);
  return !isNaN(d.getTime()) && d.getFullYear() === year;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-5 flex items-center gap-4">
      <div className="w-11 h-11 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-semibold text-foreground leading-tight">{value}</p>
        <p className="text-sm text-muted">{label}</p>
      </div>
    </div>
  );
}

export default function StatsPage() {
  const { data: books = [], isLoading: booksLoading } = useEntityList('books');
  const { data: movies = [], isLoading: moviesLoading } = useEntityList('movies');

  const currentYear = new Date().getFullYear();

  const stats = useMemo(() => {
    const typedBooks = (books as Book[]) || [];
    const typedMovies = (movies as Movie[]) || [];

    const readBooks = typedBooks.filter((b) => b.status === 'read');
    const watchedMovies = typedMovies.filter((m) => m.status === 'watched');

    const readBooksThisYear = readBooks.filter((b) => isSameYear(b.endDate, currentYear));
    const watchedMoviesThisYear = watchedMovies.filter((m) => isSameYear(m.endDate, currentYear));

    const totalPages = readBooks.reduce((sum, b) => sum + (b.pages || 0), 0);
    const pagesThisYear = readBooksThisYear.reduce((sum, b) => sum + (b.pages || 0), 0);

    const totalMinutes = watchedMovies.reduce((sum, m) => sum + (m.length || 0), 0);
    const minutesThisYear = watchedMoviesThisYear.reduce((sum, m) => sum + (m.length || 0), 0);

    return {
      booksRead: readBooks.length,
      moviesWatched: watchedMovies.length,
      booksReadThisYear: readBooksThisYear.length,
      moviesWatchedThisYear: watchedMoviesThisYear.length,
      totalPages,
      pagesThisYear,
      totalHours: Math.round((totalMinutes / 60) * 10) / 10,
      hoursThisYear: Math.round((minutesThisYear / 60) * 10) / 10,
    };
  }, [books, movies, currentYear]);

  if (booksLoading || moviesLoading) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted text-sm">
        Loading…
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-8 py-5 md:py-6 border-b border-border bg-surface">
        <h2 className="text-xl md:text-2xl font-semibold text-foreground tracking-tight">
          Stats
        </h2>
      </div>

      <div className="p-4 sm:p-8 space-y-8 max-w-[1400px] w-full">
        <section>
          <h3 className="text-sm font-semibold text-muted uppercase tracking-widest mb-4">
            All Time
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={<BookOpen size={20} />} label="Books read" value={stats.booksRead} />
            <StatCard icon={<Film size={20} />} label="Movies watched" value={stats.moviesWatched} />
            <StatCard icon={<FileText size={20} />} label="Pages read" value={stats.totalPages.toLocaleString()} />
            <StatCard icon={<Clock size={20} />} label="Hours watched" value={stats.totalHours} />
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-muted uppercase tracking-widest mb-4">
            {currentYear}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={<BookOpen size={20} />} label="Books read" value={stats.booksReadThisYear} />
            <StatCard icon={<Film size={20} />} label="Movies watched" value={stats.moviesWatchedThisYear} />
            <StatCard icon={<FileText size={20} />} label="Pages read" value={stats.pagesThisYear.toLocaleString()} />
            <StatCard icon={<Clock size={20} />} label="Hours watched" value={stats.hoursThisYear} />
          </div>
        </section>
      </div>
    </div>
  );
}
