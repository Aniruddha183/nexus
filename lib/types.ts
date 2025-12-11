import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";
import { Type } from "@google/genai";

export enum InterviewStatus {
  IDLE = "IDLE",
  SETUP = "SETUP",
  CONNECTING = "CONNECTING",
  LIVE = "LIVE",
  ANALYZING = "ANALYZING",
  COMPLETED = "COMPLETED",
}

export enum Difficulty {
  JUNIOR = "Junior",
  MID = "Mid-Level",
  SENIOR = "Senior",
  PRINCIPAL = "Principal",
}

export interface InterviewConfig {
  domain: string;
  difficulty: Difficulty;
  candidateName: string;
  resumeText?: string;
  jd?: string;
}

export interface TranscriptItem {
  role: "user" | "model";
  text: string;
  timestamp: number;
}

export interface ISetting {
  candidateName: string;
  position: string;
  language: string;
  difficulty: string;
}

export interface AnalyticsData {
  score: number;
  technicalAccuracy: number;
  communicationClarity: number;
  domainKnowledge: number;
  strengths: string[];
  weaknesses: string[];
  summary: string;
}

export interface NextQuestion {
  closingMessage?: string;
  nextQuestion: {
    questionId: string;
    questionText: string;
    topic?: string;
    difficulty?: string;
  } | null;
}

export const AnalyticsSchema = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.NUMBER, description: "Overall score out of 100" },
    technicalAccuracy: { type: Type.NUMBER, description: "Score out of 100" },
    communicationClarity: {
      type: Type.NUMBER,
      description: "Score out of 100",
    },
    domainKnowledge: { type: Type.NUMBER, description: "Score out of 100" },
    strengths: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of key strengths",
    },
    weaknesses: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of areas for improvement",
    },
    summary: {
      type: Type.STRING,
      description: "A paragraph summarizing the interview performance",
    },
  },
  required: [
    "score",
    "technicalAccuracy",
    "communicationClarity",
    "domainKnowledge",
    "strengths",
    "weaknesses",
    "summary",
  ],
};

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
  }
}
