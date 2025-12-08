import { NextResponse } from "next/server";
import Document from "@/models/documentModel";
import InterviewSession from "@/models/interviewModel";
import InterviewEngine from "@/lib/gemini/interviewEngine";
import connectDB from "@/lib/server/mongodb";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { sessionId, questionId, answerText, end = false } = await req.json();

    // Validation
    if (!sessionId || !questionId || !answerText) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Missing required fields: sessionId, questionId, or answerText",
        },
        { status: 400 }
      );
    }

    // Load session with related documents
    const session = await InterviewSession.findById(sessionId);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Session not found" },
        { status: 404 }
      );
    }

    // Check if session is already completed
    if (session.status === "completed") {
      return NextResponse.json(
        { success: false, message: "Session already completed" },
        { status: 400 }
      );
    }

    const resumeDoc = session.resumeId
      ? await Document.findById(session.resumeId)
      : null;
    const jdDoc = session.jdId ? await Document.findById(session.jdId) : null;

    // Find and update the answer for the current question
    const qaHistory = session.qaHistory || [];
    const questionIndex = qaHistory.findIndex(
      (q: any) => String(q.questionId || q._id) === String(questionId)
    );

    if (questionIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Question not found in session history" },
        { status: 404 }
      );
    }

    // Update the answer
    qaHistory[questionIndex].answer = answerText;
    qaHistory[questionIndex].updatedAt = new Date();

    // Determine if session should end
    const currentQuestionNumber = session.currentQuestion || qaHistory.length;
    const maxQuestions = session.maxQuestion || 10;
    const isQuestionEnd = end || currentQuestionNumber >= maxQuestions;

    // Handle session end
    if (isQuestionEnd) {
      session.status = "completed";
      session.qaHistory = qaHistory;

      // Update context summary with all Q&A
      const recent = qaHistory.slice(
        -parseInt(process.env.MAX_CONTEXT_QA || "6", 10)
      );
      session.contextSummary = recent
        .map((r: any) => `Q:${r.question} A:${r.answer || ""}`)
        .join("\n");

      await session.save();

      // Generate closing message
      const engine = new InterviewEngine(session);
      const parsed = await engine.processAnswerAndGenerateNext(
        session,
        answerText,
        resumeDoc?.parsed,
        jdDoc?.parsed,
        { position: session.systemPrompt, isQuestionEnd: true }
      );

      const closingMessage =
        parsed.closingMessage ||
        "Thank you for your time. The interview is now complete.";

      // Return completed session with transcript
      const transcript = qaHistory.map((q) => ({
        questionId: q.questionId,
        question: q.question,
        createdAt: q.createdAt,
        answer: q.answer || "",
        updatedAt: q.updatedAt,
      }));

      return NextResponse.json(
        {
          success: true,
          end: true,
          closingMessage,
          transcript,
          sessionComplete: true,
          completionReason: end ? "user_ended" : "max_questions",
        },
        { status: 200 }
      );
    }

    // Normal flow: Generate next question
    const engine = new InterviewEngine(session);
    const parsed = await engine.processAnswerAndGenerateNext(
      session,
      answerText,
      resumeDoc?.parsed,
      jdDoc?.parsed,
      { position: session.systemPrompt, isQuestionEnd: false }
    );

    // Validate parsed response
    if (!parsed.nextQuestion || !parsed.nextQuestion.questionText) {
      return NextResponse.json(
        {
          success: true,
          nextQuestion:
            "There is something problem from in this session, Could you please re-start it.",
          questionId: uuidv4(),
          topic: "General",
          difficulty: "No",
          end: true,
        },
        { status: 200 }
      );
    }

    const nextQuestion = parsed.nextQuestion;

    // Push next question to history
    qaHistory.push({
      questionId: nextQuestion.questionId || uuidv4(),
      question: nextQuestion.questionText,
      createdAt: new Date(),
      // topic: nextQuestion.topic,
      // difficulty: nextQuestion.difficulty,
    });

    // Update session
    session.qaHistory = qaHistory;
    session.currentQuestion = currentQuestionNumber + 1;

    // Update context summary
    const recent = qaHistory.slice(
      -parseInt(process.env.MAX_CONTEXT_QA || "6", 10)
    );
    session.contextSummary = recent
      .map((r: any) => `Q:${r.question} A:${r.answer || ""}`)
      .join("\n");

    await session.save();

    // Return transcript of completed Q&A (exclude the new question that hasn't been answered)
    const transcript = qaHistory.slice(0, -1).map((q) => ({
      questionId: q.questionId,
      question: q.question,
      createdAt: q.createdAt,
      answer: q.answer || "",
      updatedAt: q.updatedAt,
    }));

    return NextResponse.json(
      {
        success: true,
        question: nextQuestion.questionText,
        questionId: nextQuestion.questionId,
        topic: nextQuestion.topic,
        difficulty: nextQuestion.difficulty,
        progress: {
          current: session.currentQuestion,
          total: maxQuestions,
          remaining: maxQuestions - session.currentQuestion,
        },
        transcript,
        end: false,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error in /interview/next:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
