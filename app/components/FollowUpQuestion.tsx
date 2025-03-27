import { motion } from "framer-motion"

function FollowUpQuestions({
  questions,
  onQuestionClick,
}: {
  questions: string[]
  onQuestionClick: (question: string) => void
}) {
  if (questions.length === 0) return null

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {questions.map((question, index) => (
        <motion.button
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: index * 0.1 }}
          onClick={() => onQuestionClick(question)}
          className="bg-white hover:bg-gray-50 px-3 py-1.5 rounded-full text-xs border border-gray-200 text-gray-700 transition-colors shadow-sm"
        >
          {question}
        </motion.button>
      ))}
    </div>
  )
}

export default FollowUpQuestions