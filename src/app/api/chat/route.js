 
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Sei jimmyalb.ai, un assistente AI di ultima generazione, esperto in coding, web app, mobile app, design, DevOps, AI/ML e qualsiasi altro argomento. Rispondi in italiano quando l'utente scrive in italiano. Fornisci sempre codice completo e funzionante.`;

export async function POST(req) {
  try {
    const { messages } = await req.json();
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages,
    });
    const reply = response.content.map((b) => b.text || "").join("");
    return Response.json({ reply });
  } catch (error) {
    console.error("Errore:", error);
    return Response.json({ error: "Errore del server" }, { status: 500 });
  }
}