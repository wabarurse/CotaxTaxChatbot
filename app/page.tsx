"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import { useChat } from "ai/react"
import { motion, AnimatePresence } from "framer-motion"

import generateFollowUpQuestions from "./utilities/followUp"
import useFileHandling from "./utilities/hooks"
import MessageList from "./components/MessageList"
import FileDropZone from "./components/FileDropZone"
import FollowUpQuestions from "./components/FollowUpQuestion"
import LoadingScreen from "./components/LoadingPage"
// Types
interface Attachment {
  name: string
  contentType?: string
  url: string
}

// Loading component


// Main component
export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>(["introduce yourself"])

  const { files, dragActive, fileInputRef, handleDrag, handleDrop, handleFileChange, clearFiles } = useFileHandling()

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
    onFinish: async (message) => {
      try {
        setSuggestedQuestions(await generateFollowUpQuestions(message.content))
      } catch (error) {
        console.error("Error generating follow-up questions:", error)
      }
    },
  })

  // Simulate loading and then hide the loading screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2500) // Show loading screen for 2.5 seconds
    
    return () => clearTimeout(timer)
  }, [])

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (files && files.length > 0) {
      const attachments: Attachment[] = []
      let filesProcessed = 0
      const currentFileNames = files.map((file) => file.name)

      files.forEach((file) => {
        const reader = new FileReader()

        reader.onload = () => {
          attachments.push({
            name: file.name,
            contentType: file.type,
            url: reader.result as string,
          })

          filesProcessed++

          if (filesProcessed === files.length) {
            const fileNamesText = currentFileNames.join(" ")
            const modifiedInput = fileNamesText + "\n" + input

            handleInputChange({
              target: { value: modifiedInput },
            } as React.ChangeEvent<HTMLInputElement>)

            setTimeout(() => {
              handleSubmit(e, {
                experimental_attachments: attachments,
              })

              clearFiles()
            }, 0)
          }
        }

        reader.readAsDataURL(file)
      })
    } else {
      handleSubmit(e)
    }
  }

  const handleSuggestedQuestionClick = (question: string) => {
    handleInputChange({ target: { value: question } } as React.ChangeEvent<HTMLInputElement>)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen />}
      </AnimatePresence>
      
      <motion.div 
        className="min-h-screen flex items-center justify-center bg-gray-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div
          className="w-full max-w-4xl h-[80vh] rounded-xl shadow-2xl overflow-hidden relative"
          style={{
            backgroundImage:
              "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/use-MK1vcgVjVJxxGBdwbcVeUqjrRXlfrT.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>

          <div className="relative h-full flex flex-col p-6 md:p-8">
            <h1 className="text-3xl font-semibold text-[#3D54A0] mb-4">Tax Assistant</h1>

            <div className="flex-1 overflow-hidden flex flex-col">
              <div className="flex-1 overflow-y-auto mb-4 pr-1">
                <MessageList messages={messages} />
              </div>

              <div className="mt-auto">
                <form ref={formRef} onSubmit={handleFormSubmit} className="flex flex-col gap-3" onDragEnter={handleDrag}>
                  {(files && files.length > 0) || dragActive ? (
                    <FileDropZone
                      dragActive={dragActive}
                      handleDrag={handleDrag}
                      handleDrop={handleDrop}
                      fileInputRef={fileInputRef}
                      handleFileChange={handleFileChange}
                      files={files}
                    />
                  ) : null}

                  <div className="flex gap-2 items-center">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-gray-500 hover:text-[#3D54A0] transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-7 w-7"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                        />
                      </svg>
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*,.pdf"
                        multiple
                      />
                    </button>

                    <input
                      ref={inputRef}
                      className="flex-1 border border-gray-200 text-gray-800 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#3D54A0] focus:border-transparent bg-white/80 backdrop-blur-sm"
                      value={input}
                      onChange={handleInputChange}
                      placeholder="Ask me anything or drag and drop files..."
                    />

                    <motion.button
                      type="submit"
                      className="bg-[#3D54A0] hover:bg-[#3D54A0]/80 text-black rounded-full p-2 transition-colors"
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="white">
                        <path
                          fillRule="evenodd"
                          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </motion.button>
                  </div>
                </form>

                <FollowUpQuestions questions={suggestedQuestions} onQuestionClick={handleSuggestedQuestionClick} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}

