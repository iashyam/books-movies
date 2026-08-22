'use client';

import { ListPageLayout } from '@/components/lists/ListPageLayout';
import { movieConfig } from '@/lib/entityConfig';

export default function MoviesPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ListPageLayout's generic constraint doesn't structurally match Movie without a cast
  return <ListPageLayout entity={movieConfig as any} />;
}
