import { GoogleGenerativeAI } from "@google/generative-ai";

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const generatePrompt = (platform: string) => {
  const basePrompt = platform === 'instagram'
    ? "You are a social media expert. Generate an engaging Instagram caption for this image. Include 5 relevant and trending hashtags. Keep it under 2200 characters. Make it attention-grabbing and engaging. Analyze the image and create a relevant caption."
    : "You are a social media expert. Generate a Twitter-friendly caption for this image. Include 2-3 relevant hashtags. Keep it under 280 characters. Make it concise but engaging. Analyze the image and create a relevant caption.";

  return basePrompt;
}; 