import type { Metadata } from 'next';
import PersonalityRunner from '@/components/tools/PersonalityRunner';
import { getPersonalityTest } from '@/lib/data/personality';
import { getToolKeywords } from '@/lib/data/tools';

const SLUG = 'disc';
const test = getPersonalityTest(SLUG)!;

export const metadata: Metadata = {
  title: test.title,
  description: test.subtitle,
  keywords: getToolKeywords(SLUG),
  alternates: { canonical: `/tools/${SLUG}` },
};

export default function Page() {
  return <PersonalityRunner slug={SLUG} />;
}
