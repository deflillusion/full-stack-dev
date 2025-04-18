import { useState, useEffect } from "react"
import { motion } from "framer-motion"

const emoticons = ["^_^", "*_*", "-_-", "o_o", ">_<", "._.", "^_-", "T_T", "=_=", "O_O", "u_u", ">_>", "~_~", "x_x"]

// Add some dialogue lines that Mother might say
const dialogues = [
  "Hello, user.",
  "Welcome back.",
  "Processing data...",
  "System optimal.",
  "Analyzing input.",
  "Executing protocol.",
  "User detected.",
  "Awaiting command.",
  "Data transfer complete.",
  "Error 404: Emotion not found.",
  "Running diagnostics.",
]

interface MotherEmoticonProps {
  className?: string
  showDialogue?: boolean
}

const MotherEmoticon = ({ className = "", showDialogue = false }: MotherEmoticonProps) => {
  const [currentEmoticon, setCurrentEmoticon] = useState(0)
  const [currentDialogue, setCurrentDialogue] = useState(0)
  const [isChanging, setIsChanging] = useState(false)
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  // Handle emoticon changes
  useEffect(() => {
    // Change emoticon every 3-7 seconds
    const interval = setInterval(
      () => {
        setIsChanging(true)
        setTimeout(() => {
          setCurrentEmoticon((prev) => (prev + 1) % emoticons.length)
          setIsChanging(false)
        }, 300)
      },
      Math.random() * 4000 + 3000,
    )

    return () => clearInterval(interval)
  }, [])

  // Handle dialogue typing animation if showDialogue is true
  useEffect(() => {
    if (!showDialogue) return

    const changeDialogue = () => {
      setCurrentDialogue((prev) => (prev + 1) % dialogues.length)
      setDisplayedText("")
      setIsTyping(true)
    }

    // Change dialogue every 8-12 seconds
    const dialogueInterval = setInterval(changeDialogue, Math.random() * 4000 + 8000)

    // Initial dialogue
    if (!isTyping && displayedText === "") {
      setIsTyping(true)
    }

    return () => clearInterval(dialogueInterval)
  }, [showDialogue])

  // Handle typing animation
  useEffect(() => {
    if (!showDialogue || !isTyping) return

    const text = dialogues[currentDialogue]
    if (displayedText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.substring(0, displayedText.length + 1))
      }, 50)
      return () => clearTimeout(timeout)
    } else {
      setIsTyping(false)
    }
  }, [displayedText, currentDialogue, isTyping, showDialogue])

  return (
    <div className={`font-mono ${className}`}>
      <motion.div
        className="inline-block"
        animate={{
          opacity: isChanging ? 0.5 : 1,
          scale: isChanging ? 0.95 : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500">
          {emoticons[currentEmoticon]}
        </span>
      </motion.div>

      {showDialogue && (
        <motion.div
          className="text-xs text-gray-400 mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {displayedText}
          {isTyping && <span className="animate-pulse">_</span>}
        </motion.div>
      )}
    </div>
  )
}

export default MotherEmoticon
