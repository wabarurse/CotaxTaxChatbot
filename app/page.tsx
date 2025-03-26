"use client"

import { useChat } from "ai/react"

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
  })

  return (
    <main className="p-4 max-w-2xl mx-auto">
      <div className="mb-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-2 rounded text-black ${
              message.role === "user" ? "bg-gray-200 ml-auto" : "bg-gray-100 border"
            } max-w-[80%] ${message.role === "user" ? "ml-auto" : "mr-auto"}`}
          >
            {message.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="flex-1 border border-white rounded p-2 "
          value={input}
          onChange={handleInputChange}
          placeholder="Ask about taxes..."
        />
        <button type="submit" className="border rounded px-4 py-2">
          Send
        </button>
      </form>
    </main>
  )
}

