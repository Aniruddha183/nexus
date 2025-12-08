import { GoogleGenAI } from "@google/genai";
import { parseJDPrompt, parseResumePrompt } from "../constants";
import speech from "@google-cloud/speech";
import { protos } from "@google-cloud/speech";
import textToSpeech, { protos as protosV2 } from "@google-cloud/text-to-speech";

const apiKey = process.env.GEMINI_API_KEY as string;

const ai = new GoogleGenAI({ apiKey });
const client = new speech.SpeechClient();
const ttsClient = new textToSpeech.TextToSpeechClient();

export const parseWithGemini = async (text: string, type: "JD" | "Resume") => {
  const prompt =
    type === "Resume" ? parseResumePrompt(text) : parseJDPrompt(text);
  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const response = result.text;
    if (!response) {
      throw new Error("Text is not generated");
    }
    // Clean up markdown code blocks if present
    const text = response
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Error parsing resume with Gemini:", error);
  }
};

export async function callLLM(
  prompt: string,
  opts?: { temperature?: number; maxTokens?: number }
) {
  try {
    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { temperature: opts?.temperature },
    });
    return res.text;
  } catch (error) {
    throw new Error("Implement callLLM with your provider", error.message);
  }
}

export async function transcribeAudioBuffer(buffer: Buffer) {
  const audio = { content: buffer.toString("base64") };
  const config = {
    encoding:
      protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.LINEAR16,
    sampleRateHertz: 16000,
    languageCode: "en-US",
  };

  const [response] = await client.recognize({ audio, config });
  return (
    response.results?.map((r) => r.alternatives?.[0].transcript).join("\n") ||
    ""
  );
}

export async function ttsFromText(text: string) {
  const request = {
    input: { text },
    voice: {
      languageCode: "en-US",
      ssmlGender: protosV2.google.cloud.texttospeech.v1.SsmlVoiceGender.NEUTRAL,
    },
    audioConfig: {
      audioEncoding: protosV2.google.cloud.texttospeech.v1.AudioEncoding.MP3,
    },
  };

  const [response] = await ttsClient.synthesizeSpeech(request);
  const audioBase64 = response.audioContent?.toString("base64");

  return { audioBase64 };
}
