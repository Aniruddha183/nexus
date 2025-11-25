'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { InterviewConfig, Difficulty, TranscriptItem, AnalyticsData } from '../lib/types';

interface InterviewContextType {
  config: InterviewConfig;
  setConfig: (config: InterviewConfig) => void;
  transcript: TranscriptItem[];
  addTranscriptItem: (item: TranscriptItem) => void;
  analytics: AnalyticsData | null;
  setAnalytics: (data: AnalyticsData) => void;
  resetInterview: () => void;
}

const defaultContext: InterviewContextType = {
  config: { domain: '', difficulty: Difficulty.MID, candidateName: '', resumeText: '' },
  setConfig: () => {},
  transcript: [],
  addTranscriptItem: () => {},
  analytics: null,
  setAnalytics: () => {},
  resetInterview: () => {}
};

const InterviewContext = createContext<InterviewContextType>(defaultContext);

export const InterviewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<InterviewConfig>({
    domain: '',
    difficulty: Difficulty.MID,
    candidateName: '',
    resumeText: ''
  });
  const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  const addTranscriptItem = (item: TranscriptItem) => {
    setTranscript(prev => [...prev, item]);
  };

  const resetInterview = () => {
    setTranscript([]);
    setAnalytics(null);
  };

  return (
    <InterviewContext.Provider value={{
      config,
      setConfig,
      transcript,
      addTranscriptItem,
      analytics,
      setAnalytics,
      resetInterview
    }}>
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterview = () => useContext(InterviewContext);