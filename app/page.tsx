"use client"

import type React from "react"

import { useChat } from "ai/react"
import { useRef, useState } from "react"
import ReactMarkdown from 'react-markdown'


async function generateFollowUpQuestions(previousResponse: string): Promise<string[]> {
  const prompt = `Based on this previous response: "${previousResponse.slice(0, 500)}${previousResponse.length > 500 ? '...' : ''}"
  
Please generate 3 natural follow-up questions that a user might ask next. The questions should be:
1. Directly related to the content of the response
2. Clear and concise (under 100 characters if possible)
3. Phrased as a question a real user would ask
  
Return only the 3 questions, one per line.`;

  try {
    // Call the API with the prompt
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: prompt }]
      })
    });

    if (!response.ok) throw new Error("Failed to get follow-up questions");
    
    // Parse the response
    const data = await response.json();
    const content = data.content || "";
    
    // Extract questions (one per line, or separated by numbers)
    const questions = content.split(/\n+|\d+\./).map(q => q.trim()).filter(q => q.endsWith("?") && q.length > 0);
    
    // Return up to 3 questions
    return questions.slice(0, 3);
  } catch (error) {
    console.error("Error generating follow-up questions:", error);
    // Fallback questions if the API call fails
    return [
      "Can you tell me more about this?",
      "What are the most important things to know?",
      "How does this apply in practice?"
    ];
  }
}


export default function Home() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
    onFinish: async (message) => {
      try {
        const questions = await generateFollowUpQuestions(message.content);
        setSuggestedQuestions(questions);
      } catch (error) {
        console.error("Error generating follow-up questions:", error);
      }
    },
  })

  const [files, setFiles] = useState<FileList | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([
    "How do tax brackets work?",
    "Tell me about deductions",
  ])

  // Add a new ref for the text input
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const filesToSubmit: FileList | null = files;

    // Reset file input
    setFiles(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Call the submit function with the file attachments
    handleSubmit(e, {
      experimental_attachments: filesToSubmit,
    });
  };

  const handleSuggestedQuestionClick = (question: string) => {
    // Set the input value to the suggested question
    handleInputChange({ target: { value: question } } as React.ChangeEvent<HTMLInputElement>)
    
    // Focus the input using the ref
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }


  return (
    <main className="p-4 max-w-2xl mx-auto text-black">
      <div className="mb-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-2 rounded ${
              message.role === "user" ? "bg-gray-300" : "bg-gray-100"
            } max-w-[80%] ${message.role === "user" ? "ml-auto" : "mr-auto"}`}
          >
            {message.role === "user" ? (
              message.content
            ) : (
              <ReactMarkdown>{message.content}</ReactMarkdown>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleFormSubmit} className="flex flex-col gap-2 mt-4">
        <input
          ref={fileInputRef}
          type="file"
          onChange={(e) => setFiles(e.target.files)}
          className="mb-2"
          accept="image/*,.pdf"
        />

        <div className="flex gap-2">
          <input
            ref={inputRef}
            className="flex-1 border border-white rounded p-2"
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about taxes..."
          />
          <button type="submit" className="border rounded px-4 py-2">
            Send
          </button>
        </div>

        {files && files.length > 0 && <p className="text-sm mt-1">File selected: {files[0].name}</p>}

      </form>

      {suggestedQuestions.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {suggestedQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleSuggestedQuestionClick(question)}
              className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm"
            >
              {question}
            </button>
          ))}
        </div>
      )}
    </main>
  )
}