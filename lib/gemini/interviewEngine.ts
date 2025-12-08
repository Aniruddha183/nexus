import { callLLM } from "./llmServices";
import { IInterviewSession } from "@/models/interviewModel";
import { NextQuestion } from "@/lib/types";

const MAX_HISTORY = parseInt(process.env.MAX_CONTEXT_QA || "6", 10);

export default class InterviewEngine {
  session: IInterviewSession;

  constructor(session: IInterviewSession) {
    this.session = session;
  }

  buildSystemPrompt(resumeParsed: any, jdParsed: any, settings: any) {
    // concise system instruction that will be passed to the LLM for creating questions & evaluations
    const persona = `You are a senior technical interviewer for role: ${
      settings.position || "Full Stack Engineer"
    }.
    l;
Level: ${settings.difficulty || "medium"}.
Use resume + job description context to ask job-focused questions.`;
    const resumeSummary = resumeParsed?.resume_summary || "";
    const jdSummary = jdParsed?.job_summary || "";

    return `${persona}\n\nRESUME_SUMMARY:\n${resumeSummary}\n\nJOB_DISCRIPTION_SUMMARY:\n${jdSummary}\n\nRules:
- Ask one question at a time.
- Keep questions short and clear.
- If candidate lacks a skill in JD, ask targeted follow-ups.
- When evaluating, return only JSON when asked for evaluation.`;
  }

  // ----- Summarize the Resume --------
  summarizeResume(parsed: any) {
    console.log("Summarizing RESUME");
    if (!parsed) return "";
    // attempt short summary or use parsed.summary if exists
    return `${parsed.title || ""} with ~${
      parsed.experience_years || ""
    } years. Top skills: ${
      (parsed.skills &&
        Object.values(parsed.skills).flat().slice(0, 5).join(", ")) ||
      ""
    }`;
  }

  async generateFirstQuestion(resumeParsed: any, jdParsed: any, settings: any) {
    const systemPrompt = this.buildSystemPrompt(
      resumeParsed,
      jdParsed,
      settings
    );
    this.session.systemPrompt = systemPrompt;

    const prompt = `${systemPrompt}
CONTEXT: no previous Q/A.

Task: Generate the first interview question (one). Return a JSON object:
{ "questionId": "<uuid>", "questionText": "<short question>", "topic": "string", "difficulty": "medium" }`;

    const text = await callLLM(prompt, { temperature: 0.2 });
    try {
      const cleaned = text?.replace(/```json\s*|\s*```/g, "").trim();
      return JSON.parse(cleaned as string);
    } catch (e) {
      // fallback: wrap raw text
      return {
        questionId: String(Date.now()),
        questionText:
          text?.trim() ||
          "Sorry there is some issues, can you start interview again ?",
        topic: "general",
        difficulty: "medium",
      };
    }
  }

  buildLoopPrompt(
    lastQA: any[],
    resumeParsed: object,
    jdParsed: object,
    settings: {
      position: string;
      isQuestionEnd: boolean;
    }
  ): string {
    const summary = this.session.contextSummary || "";
    const shortHistory = lastQA
      .slice(-MAX_HISTORY)
      .map(
        (q: any, i: number) =>
          `Q${i + 1}: ${q.question}\nA${i + 1}: ${q.answer || "(no answer)"}`
      )
      .join("\n---\n");

    // Handle session end conditions
    if (settings.isQuestionEnd) {
      return `
${this.session.systemPrompt}

---
SESSION END REQUESTED

Task: Generate a brief closing message for the candidate (2-3 sentences max).

The message should:
- Thank them for their time
- Be encouraging and professional
- Keep it short and friendly

Return ONLY a JSON object in this exact format:
{
  "closingMessage": "<your brief closing message>",
  "nextQuestion": null,
}

Do NOT include any evaluation. Just a simple, friendly closing message.
`;
    }

    // Normal question generation flow

    return `
${this.session.systemPrompt}

CONTEXT SUMMARY: ${summary}

RECENT INTERVIEW HISTORY:
${shortHistory}

CANDIDATE RESUME:
${JSON.stringify(resumeParsed, null, 2)}

JOB DESCRIPTION:
${JSON.stringify(jdParsed, null, 2)}

POSITION: ${settings.position}
---
Task: 
1. Evaluate the candidate's latest answer
2. Generate the next interview question based on:
   - Their performance so far
   - Areas that need deeper exploration
   - Topics from the JD that haven't been covered
   - Natural interview progression

Guidelines for next question:
- Build upon previous answers when relevant
- Adapt difficulty based on candidate's performance
- Cover diverse topics from the job requirements
- Ask practical, scenario-based questions when appropriate
- Avoid repeating similar questions

Return ONLY a JSON object in this exact format:
{
  "nextQuestion": {
    "questionId": "<generate a UUID>",
    "questionText": "<the actual question to ask>",
    "topic": "<main topic/skill being tested>",
    "difficulty": "<easy|medium|hard>"
  },
}

IMPORTANT: 
- Do NOT include any text outside the JSON object
- Ensure all JSON is properly formatted
- The questionId should be a valid UUID v4
- Base difficulty on candidate's performance trend
`;
  }

  async processAnswerAndGenerateNext(
    sessionModel: IInterviewSession,
    userAnswer: string,
    resumeParsed: object,
    jdParsed: object,
    settings: any
  ) {
    // sessionModel is the Mongoose document for the session (with qaHistory)
    const lastQA = sessionModel.qaHistory || [];
    // Append the user's answer locally for prompt context
    const qaForPrompt = [...lastQA];
    const lastQ = qaForPrompt[qaForPrompt.length - 1];
    if (lastQ) {
      lastQ.answer = userAnswer;
    } else {
      // Shouldn't happen
    }

    const prompt = this.buildLoopPrompt(
      qaForPrompt,
      resumeParsed,
      jdParsed,
      settings
    );
    const modelResponse = await callLLM(prompt, { temperature: 0.2 });

    // Parse response (expect JSON)
    let parsed: NextQuestion;
    try {
      const cleaned = modelResponse?.replace(/```json\s*|\s*```/g, "").trim();
      parsed = JSON.parse(cleaned as string);
    } catch (e) {
      // fallback: attempt manual parsing or generate simpler next question
      parsed = {
        nextQuestion: {
          questionId: String(Date.now()),
          questionText: "Can you explain your recent project?",
          topic: "projects",
          difficulty: "medium",
        },
      };
    }

    return parsed;
  }
}
