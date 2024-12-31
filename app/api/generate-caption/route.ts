import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { prompt, platform } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'No prompt provided' },
        { status: 400 }
      );
    }

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const systemPrompt = platform === 'instagram'
      ? "You are a social media expert. Generate 5 different engaging Instagram captions for the following content. Each caption should:\n" +
        "1. Be under 2200 characters\n" +
        "2. Include relevant and trending hashtags\n" +
        "3. Be attention-grabbing and engaging\n" +
        "4. Use appropriate emojis\n" +
        "5. Be unique from the other captions\n" +
        "Format the response as 5 separate captions with a line break between each."
      : "You are a social media expert. Generate 5 different engaging Twitter captions for the following content. Each caption should:\n" +
        "1. Be under 280 characters\n" +
        "2. Include 2-3 relevant hashtags\n" +
        "3. Be concise but engaging\n" +
        "4. Use emojis sparingly\n" +
        "5. Be unique from the other captions\n" +
        "Format the response as 5 separate captions with a line break between each.";

    try {
      const result = await model.generateContent(`${systemPrompt}\n\nContent to create captions for: ${prompt}`);
      const response = await result.response;
      const text = response.text();

      if (!text) {
        throw new Error('No captions generated');
      }

      // Split the text into separate captions
      const captions = text.split('\n\n').filter(caption => caption.trim());

      return NextResponse.json({ captions: captions.slice(0, 5) });
    } catch (genError: any) {
      console.error('Gemini API Error:', genError?.message || genError);
      return NextResponse.json(
        { error: 'Failed to generate captions. Please try again.' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Server Error:', error?.message || error);
    return NextResponse.json(
      { error: 'Failed to process request. Please try again.' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}; 