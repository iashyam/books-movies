'use client';

import { ListPageLayout } from '@/components/lists/ListPageLayout';
import { bookConfig } from '@/lib/entityConfig';

export default function BooksPage() {
  return <ListPageLayout entity={bookConfig} />;
}
