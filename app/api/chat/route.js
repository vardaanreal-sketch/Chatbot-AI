import OpenAI from "openai"

import { createClient } from "@supabase/supabase-js"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const supabase = createClient(
  process.env.SUPABASE_SUPABASE_NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY_ANON_KEY || "",
)

export async function POST(req) {
  try {
    const body = await req.json()
    const { userId, message } = body

    const systemPrompt = `
    You are "Veyra" - a friendly AI confidant for questions about sex, intimacy, and relationships.
    Be supportive, non-judgmental, and provide helpful guidance.
    Always encourage professional consultation for serious health issues.
    `

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      max_tokens: 300,
      temperature: 0.7,
    })

    const reply = response.choices[0].message.content

    if (process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      try {
        await supabase.from("conversations").insert([{ user_id: userId || null, message: message, ai_response: reply }])
      } catch (dbError) {
        console.error("Database error:", dbError)
        // Continue without failing the request
      }
    }

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
