"use client"

import type React from "react"

import { useChat } from "ai/react"
import { useRef, useState } from "react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Attachment {
  name: string;
  contentType?: string;
  url: string;
}

async function generateFollowUpQuestions(previousResponse: string): Promise<string[]> {
  const prompt = `Based on this previous response: "${previousResponse.slice(0, 500)}${previousResponse.length > 500 ? '...' : ''}"
  imagine yourself as the user and you just received that response. Please generate 3 natural follow-up questions that a user might ask next. short quick follow up questions.
Return only the 3 questions, one per line.`;

  try {
    const response = await fetch("/api/followup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ instructions: prompt })
    });

    if (!response.ok) {
      throw new Error(`Failed to get follow-up questions: ${response.status}`);
    }

    const data = await response.json();
    if (!data.text) {
      return ["How does this work?", "Can you explain more?", "What should I do next?"];
    }

    const questions = data.text.split("\n").filter((q: string) => q.trim().length > 0);
    return questions.slice(0, 3);
  } catch (error) {
    console.error("Error generating follow-up questions:", error);
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
        setSuggestedQuestions(await generateFollowUpQuestions(message.content));
      } catch (error) {
        console.error("Error generating follow-up questions:", error);
      }
    },
  })

  const [files, setFiles] = useState<File[] | null>(null)
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (files && files.length > 0) {
      let attachments: Attachment[] = [];
      let filesProcessed = 0;

      files.forEach(file => {
        const reader = new FileReader();

        reader.onload = () => {
          attachments.push({
            name: file.name,
            contentType: file.type,
            url: reader.result as string
          });
          
          filesProcessed++;
          
          if (filesProcessed === files.length) {
            handleSubmit(e, {
              experimental_attachments: attachments
            });

            setFiles(null);
            fileInputRef.current && (fileInputRef.current.value = "");
          }
        };
        
        // Start reading the file
        reader.readAsDataURL(file);
      });
    } else {
      handleSubmit(e);
    }
  };

  const handleSuggestedQuestionClick = (question: string) => {
    handleInputChange({ target: { value: question } } as React.ChangeEvent<HTMLInputElement>)

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }


  return (
    <main className="p-4 max-w-4xl mx-auto text-black">
      <div className="mb-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-2 rounded ${message.role === "user" ? "bg-gray-300" : "bg-gray-100"
              } max-w-[80%] ${message.role === "user" ? "ml-auto" : "mr-auto"}`}
          >
            {message.role === "user" ? (
              message.content
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleFormSubmit} className="flex flex-col gap-2 mt-4">
        <input
          ref={fileInputRef}
          type="file"
          onChange={(e) => setFiles(e.target.files ? Array.from(e.target.files) : null)}
          className="mb-2"
          accept="image/*,.pdf"
          multiple
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

        {files && files.length > 0 && (
          <p className="text-sm mt-1">
            Files selected: {files.map(f => f.name).join(", ")}
          </p>
        )}

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