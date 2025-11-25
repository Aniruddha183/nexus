'use client';

import React from 'react';
import { InterviewProvider } from '../context/InterviewContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <InterviewProvider>
      {children}
    </InterviewProvider>
  );
}