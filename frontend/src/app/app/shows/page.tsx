'use client';

import { ListPageLayout } from '@/components/lists/ListPageLayout';
import { showConfig } from '@/lib/entityConfig';

export default function ShowsPage() {
  return <ListPageLayout entity={showConfig} />;
}
