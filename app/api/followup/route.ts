import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { NextResponse } from "next/server"
// import { instructions } from "./instructions"

export async function POST(req: Request) {
  const { instructions } = await req.json()
  
  const result = await generateText({
    model: openai("gpt-4o"),
    prompt: instructions,
  })

  return NextResponse.json({ text: result.text });
}