'use client';

import { ListPageLayout } from '@/components/lists/ListPageLayout';
import { showConfig } from '@/lib/entityConfig';

export default function ShowsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ListPageLayout's generic constraint doesn't structurally match Show without a cast
  return <ListPageLayout entity={showConfig as any} />;
}
