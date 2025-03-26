import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export async function POST(req: Request) {
  const { messages } = await req.json()

  const systemMessage =
    "You are a helpful tax assistant specializing in individual tax returns (Form 1040). Provide concise, accurate information about tax-related questions."

  const result = streamText({
    model: openai("gpt-4o"),
    system: systemMessage,
    messages,
  })

  return result.toDataStreamResponse()
}