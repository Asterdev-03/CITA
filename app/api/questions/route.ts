import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { resume, job } = body;

    const key = process.env.API_KEY;

    if (key === undefined) {
      const text = [
        "Tell me about yourself.",
        "Why are you interested in this position?",
        "Why should we hire you?",
        "What are your greatest strengths and weaknesses?",
        "Where do you see yourself in five years?",
        "Why did you leave your last job?",
        "What are your salary expectations?",
        "What are your proudest professional accomplishments?",
        "What is your favorite way to learn new things?",
        "What are your current job responsibilities?",
      ];
      return NextResponse.json(text);
    } else {
      const prompt = `This is my resume: ${resume} and the job description: ${job}. Generate a list of common interview questions based on my resume and the job description provided. Each question must be in a single line without any bulletins. Avoid using bulletins or numbering. Provide questions separated by \\n.`;

      const genAI = new GoogleGenerativeAI(`${key}`);

      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      /*     const prompt = "Write a story about a magic backpack."; */

      console.log(prompt);
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      console.log(text, "\n\n");

      var sentencesArray = text.split("\n");

      // Now, 'sentencesArray' contains each sentence as an element
      console.log(sentencesArray);

      return NextResponse.json(sentencesArray);
    }
  } catch (error) {
    console.log("[COMPANION_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
