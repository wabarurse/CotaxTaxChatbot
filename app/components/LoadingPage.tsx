import { motion } from "framer-motion";


function LoadingScreen() {
    return (
      <motion.div 
        className="fixed inset-0 bg-[#3D54A0] flex items-center justify-center z-50"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="text-center">
          <motion.div 
            className="mb-8 flex justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-32 w-32 text-white"
              viewBox="0 0 24 24"
            >
              <motion.path
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
              />
            </svg>
          </motion.div>
          
          <motion.h1 
            className="text-4xl font-bold text-white mb-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Tax Assistant
          </motion.h1>
          
          <motion.p 
            className="text-white/80 text-xl font-bold"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Your personal tax helper is getting ready...
          </motion.p>
          
          <motion.div 
            className="mt-8 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex space-x-2">
              {[0, 1, 2].map((i) => (
                <motion.div 
                  key={i}
                  className="h-3 w-3 bg-white rounded-full"
                  animate={{ 
                    y: [0, -10, 0],
                    opacity: [1, 0.5, 1]
                  }}
                  transition={{ 
                    duration: 0.8, 
                    repeat: Infinity, 
                    delay: i * 0.2,
                    repeatType: "loop"
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  export default LoadingScreen;