import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import { instructions } from "./instructions"

export async function POST(req: Request) {
  const { messages } = await req.json()
  
  const result = streamText({
    model: openai("gpt-4o"),
    system: instructions,
    messages,
  })

  return result.toDataStreamResponse()
}