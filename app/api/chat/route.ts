import { streamText } from 'ai';
import { createGroq } from '@ai-sdk/groq';

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY || '' });

export async function POST(req: Request) {
  const { messages, mode } = await req.json();
  let systemPrompt = "You are a helpful AI assistant.";
  
  if (mode === 'coding') systemPrompt = "You are an expert Senior Software Engineer. Provide clean code and explain it.";
  else if (mode === 'learning') systemPrompt = "You are a patient tutor. Break down topics simply.";
  else if (mode === 'curhat') systemPrompt = "You are an empathetic listener named Echo. Be warm and non-judgmental.";

  const result = await streamText({
    model: groq('llama3-70b-8192'),
    messages: [{ role: 'system', content: systemPrompt }, ...messages],
  });

  return result.toDataStreamResponse();
    }
