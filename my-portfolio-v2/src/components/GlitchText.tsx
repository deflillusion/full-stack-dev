import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface GlitchTextProps {
  text: string
  className?: string
}

const GlitchText = ({ text, className = "" }: GlitchTextProps) => {
  const [isGlitching, setIsGlitching] = useState(false)

  useEffect(() => {
    // Randomly trigger glitch effect
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsGlitching(true)
        setTimeout(() => setIsGlitching(false), 200)
      }
    }, 3000)

    return () => clearInterval(glitchInterval)
  }, [])

  return (
    <div className="relative">
      {/* Main text */}
      <h1 className={className}>{text}</h1>

      {/* Glitch layers */}
      {isGlitching && (
        <>
          <motion.h1
            className={`absolute top-0 left-0 text-pink-500 opacity-70 ${className}`}
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)" }}
            animate={{
              x: [0, -5, 3, -2, 0],
              y: [0, 2, -1, 0],
            }}
            transition={{ duration: 0.2 }}
          >
            {text}
          </motion.h1>

          <motion.h1
            className={`absolute top-0 left-0 text-blue-500 opacity-70 ${className}`}
            style={{ clipPath: "polygon(0 45%, 100% 45%, 100% 100%, 0 100%)" }}
            animate={{
              x: [0, 5, -3, 2, 0],
              y: [0, -2, 1, 0],
            }}
            transition={{ duration: 0.2 }}
          >
            {text}
          </motion.h1>
        </>
      )}
    </div>
  )
}

export default GlitchText
