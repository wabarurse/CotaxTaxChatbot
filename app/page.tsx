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
  const [dragActive, setDragActive] = useState<boolean>(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Handle drag events
  const handleDrag = (e: React.DragEvent<HTMLFormElement | HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent<HTMLFormElement | HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  // Handle regular file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (files && files.length > 0) {
      let attachments: Attachment[] = [];
      let filesProcessed = 0;
      const currentFileNames = files.map(file => file.name);

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
            // console.log("fileNames", currentFileNames);
            
            const fileNamesText = currentFileNames.join(" ");
            const modifiedInput = fileNamesText + "\n" + input;
            
            handleInputChange({ 
              target: { value: modifiedInput } 
            } as React.ChangeEvent<HTMLInputElement>);
            
            setTimeout(() => {
              handleSubmit(e, {
                experimental_attachments: attachments,
              });
              
              setFiles(null);
              fileInputRef.current && (fileInputRef.current.value = "");
            }, 0);
          }
        };
        
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
        {messages.map((message) => {
          if (message.role === "user") {
            return (
              <div
                key={message.id}
                className="p-2 rounded bg-gray-300 max-w-[80%] ml-auto"
              >
                <p>{files}</p>
                <p>{message.content}</p>
              </div>
            )
          } else {
            return (
              <div
                key={message.id}
                className="p-2 rounded bg-gray-100 max-w-[80%] mr-auto"
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
              </div>
            )
          }
        })}


      </div>

      <form 
        ref={formRef}
        onSubmit={handleFormSubmit} 
        className="flex flex-col gap-2 mt-4"
        onDragEnter={handleDrag}
      >
        <div 
          className={`p-4 border-2 rounded-lg text-center cursor-pointer transition-colors ${
            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <p className="mb-2">Drag & drop files here or click to select</p>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,.pdf"
            multiple
          />
          {files && files.length > 0 && (
            <p className="text-sm mt-1">
              Files selected: {files.map(f => f.name).join(", ")}
            </p>
          )}
        </div>

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