"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface VirusAnimationProps {
  className?: string
}

const VirusAnimation = ({ className = "" }: VirusAnimationProps) => {
  const [frame, setFrame] = useState(0)

  // The different frames of the Virus animation from the game
  const frames = [
    "r(^ω^✿)r", // Both hands up as 'r'
    "L(^ω^✿)r", // Left hand as 'L', right hand as 'r'
    "r(^ω^✿)L", // Left hand as 'r', right hand as 'L'
    "L(^ω^✿)L", // Both hands as 'L'
  ]

  // Cycle through frames
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prevFrame) => (prevFrame + 1) % frames.length)
    }, 500) // Change frame every 500ms

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      className={`flex items-center justify-center ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <span className="text-5xl font-bold text-pink-500 filter drop-shadow-glow">{frames[frame]}</span>
    </motion.div>
  )
}

export default VirusAnimation
