'use client';

import { ListPageLayout } from '@/components/lists/ListPageLayout';
import { bookConfig } from '@/lib/entityConfig';

export default function BooksPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ListPageLayout's generic constraint doesn't structurally match Book without a cast
  return <ListPageLayout entity={bookConfig as any} />;
}
