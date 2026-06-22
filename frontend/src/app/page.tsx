import React from 'react';
import type { Metadata } from 'next';
import HomeContent from '@/components/home/HomeContent';

export const metadata: Metadata = {
 alternates: { canonical: '/' },
};

export default function Home() {
 return <HomeContent />;
}