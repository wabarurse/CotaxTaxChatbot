"use client"

import type React from "react"

import { useChat } from "ai/react"
import { useRef, useState } from "react"

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
  })

  const [files, setFiles] = useState<FileList | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const filesToSubmit: FileList | null = files

    setFiles(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }

    handleSubmit(e, {
      experimental_attachments: filesToSubmit,
    })
  }


  return (
    <main className="p-4 max-w-2xl mx-auto text-black">
      <div className="mb-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-2 rounded  ${message.role === "user" ? "bg-gray-300" : "bg-gray-100"
              } max-w-[80%] ${message.role === "user" ? "ml-auto" : "mr-auto"}`}
          >
            {message.content}
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
    </main>
  )
}