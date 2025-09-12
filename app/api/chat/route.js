import OpenAI from "openai";
import supabase from "../../../lib/supabaseClient";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, message } = body;

    const systemPrompt = `
    You are "Dost" - a friendly sexual health educator for Indian youth (16–30).
    Be supportive, culturally sensitive, and medically accurate.
    Always encourage professional consultation for serious issues.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4.o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const reply = response.choices[0].message.content;

    // Save in Supabase
    await supabase.from("conversations").insert([
      { user_id: userId || null, message: message, ai_response: reply },
    ]);

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
