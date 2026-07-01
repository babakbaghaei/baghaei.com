import type { PersonalityTest } from './types';
import mbti from './mbti';
import bigFive from './big-five';
import enneagram from './enneagram';
import disc from './disc';
import holland from './holland';
import zabanEshgh from './zaban-eshgh';
import eq from './eq';

/** رجیستری تست‌های شخصیت‌شناسی، کلید = اسلاگ ابزار در tools.ts. */
export const PERSONALITY_TESTS: Record<string, PersonalityTest> = {
  mbti,
  'big-five': bigFive,
  enneagram,
  disc,
  holland,
  'zaban-eshgh': zabanEshgh,
  eq,
};

export const ALL_PERSONALITY_TESTS = Object.values(PERSONALITY_TESTS);

export const getPersonalityTest = (slug: string): PersonalityTest | undefined =>
  PERSONALITY_TESTS[slug];

export type { PersonalityTest };
