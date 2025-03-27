import { motion } from "framer-motion"
import { useRef, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

function MessageList({ messages }: { messages: any[] }) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="mb-4 space-y-3 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
      {messages.map((message) =>
        message.role === "user" ? (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-3 rounded-lg bg-indigo-100 max-w-[80%] ml-auto shadow-sm"
          >
            <p className="text-gray-800">{message.content}</p>
          </motion.div>
        ) : (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-3 rounded-lg bg-white max-w-[80%] mr-auto shadow-sm border border-gray-100"
          >
            <div className="prose prose-sm max-w-none text-gray-700">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
            </div>
          </motion.div>
        ),
      )}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default MessageList
