import fs from "fs";
import PDFParser from "pdf-parse-fork";

export async function extractTextFromPdf(filePath: string): Promise<string> {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await PDFParser(dataBuffer);
    return data.text;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
