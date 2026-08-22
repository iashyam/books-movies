'use client';

import { ListPageLayout } from '@/components/lists/ListPageLayout';
import { movieConfig } from '@/lib/entityConfig';

export default function MoviesPage() {
  return <ListPageLayout entity={movieConfig} />;
}
