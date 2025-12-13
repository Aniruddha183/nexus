import { NextResponse } from "next/server";
import User from "@/models/userModel";
import Document from "@/models/documentModel";
import InterviewSession from "@/models/interviewModel";
import InterviewEngine from "@/lib/gemini/interviewEngine";
import connectDB from "@/lib/server/mongodb";
import { v4 as uuidv4 } from "uuid";
import { ISetting } from "@/lib/types";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const { userId, resumeId, jdId, maxQuestion = 5 } = body;
    // Load user and docs
    const user = await User.findById(userId);
    if (!user)
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );

    const documents = await Document.find({ userId: user._id });
    const resumeDoc = documents.find((d) => d.type === "Resume") || null;
    const jdDoc = documents.find((d) => d.type === "JD") || null;

    // Create session
    const session = await InterviewSession.create({
      userId: user._id,
      resumeId: resumeDoc?._id,
      jdId: jdDoc?._id,
      status: "ongoing",
      maxQuestion,
      currentQuestion: 1,
      qaHistory: [],
    });

    // Build engine and generate first question
    const engine = new InterviewEngine(session);
    const resumeParsed = resumeDoc?.parsed || null;
    const jdParsed = jdDoc?.parsed || null;

    const settings: ISetting = {
      candidateName: user.name,
      position: user.role,
      language: user.language,
      difficulty: user.difficulty,
    };
    const q = await engine.generateFirstQuestion(
      resumeParsed,
      jdParsed,
      settings
    );

    // push to session
    await InterviewSession.findByIdAndUpdate(session._id, {
      $push: {
        qaHistory: {
          questionId: q.questionId || uuidv4(),
          question: q.questionText,
          createdAt: new Date(),
        },
      },
      systemPrompt: session.systemPrompt || engine.session.systemPrompt,
    });

    return NextResponse.json({
      success: true,
      sessionId: session._id,
      question: q.questionText,
      questionId: q.questionId,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
