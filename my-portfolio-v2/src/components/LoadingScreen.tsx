"use client"

import { motion } from "framer-motion"
import Triangle from "./Triangle"
import MotherEmoticon from "./MotherEmoticon"

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-gray-950 flex items-center justify-center z-50">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
          }}
          className="mb-8 flex justify-center"
        >
          <Triangle size={60} animated />
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
          <h1 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500">
            DATA_DEV
          </h1>
          <div className="flex justify-center mb-4">
            <MotherEmoticon className="text-xl" />
          </div>

          <div className="relative h-1 w-48 mx-auto bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-500 to-blue-500"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </div>

          <p className="text-gray-500 mt-4 text-sm font-mono">INITIALIZING SYSTEM...</p>
        </motion.div>
      </div>
    </div>
  )
}

export default LoadingScreen
