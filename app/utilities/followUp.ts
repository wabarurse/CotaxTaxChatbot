async function generateFollowUpQuestions(previousResponse: string): Promise<string[]> {
  const prompt = `Based on this previous response: "${previousResponse.slice(0, 500)}${previousResponse.length > 500 ? "..." : ""}"
    imagine yourself as the user and you just received that response. Please generate 3 natural follow-up questions that a user might ask next. short quick follow up questions.
  Return only the 3 questions, one per line.`

  try {
    const response = await fetch("/api/followup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ instructions: prompt }),
    })

    if (!response.ok) {
      throw new Error(`Failed to get follow-up questions: ${response.status}`)
    }

    const data = await response.json()
    if (!data.text) {
      return ["How does this work?", "Can you explain more?", "What should I do next?"]
    }

    const questions = data.text.split("\n").filter((q: string) => q.trim().length > 0)
    return questions.slice(0, 3)
  } catch (error) {
    console.error("Error generating follow-up questions:", error)
    return [
      "Can you tell me more about this?",
      "What are the most important things to know?",
      "How does this apply in practice?",
    ]
  }
}

export default generateFollowUpQuestions