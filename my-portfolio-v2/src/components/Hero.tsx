import { useRef, useEffect } from "react"
import { motion } from "framer-motion"
import Triangle from "./Triangle"
import GlitchText from "./GlitchText"
import MotherEmoticon from "./MotherEmoticon"
import { Button } from "@/components/ui/button"

// Функция для получения setActiveSection из пропсов
interface HeroProps {
  onNavigate?: (section: string) => void
}

const Hero = ({ onNavigate }: HeroProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  // Принудительная прокрутка наверх при монтировании компонента
  useEffect(() => {
    window.scrollTo(0, 0)

    // Дополнительная проверка для гарантированного отображения
    const timer = setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.style.opacity = "1"
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Обработчики для кнопок
  const handleProjectsClick = () => {
    if (onNavigate) {
      onNavigate("projects")
    }
  }

  const handleContactClick = () => {
    if (onNavigate) {
      onNavigate("contact")
    }
  }

  return (
    <motion.section
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col justify-center items-center relative py-20"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[40rem] h-[40rem] rounded-full bg-gradient-to-r from-pink-500/5 to-blue-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-8 flex justify-center"
        >
          <Triangle size={80} animated className="filter drop-shadow-glow" />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-6"
        >
          <GlitchText
            text="DEFL ILLUSION"
            className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500"
          />
          <div className="flex justify-center mt-2">
            <MotherEmoticon className="text-2xl" showDialogue={true} />
          </div>
        </motion.div>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-xl text-gray-300 mb-10 font-light tracking-wider"
        >
          <span className="text-pink-500">FRONTEND&BACKEND</span> DEVELOPER // <span className="text-blue-500">UI</span>{" "}
          DESIGNER // <span className="text-purple-500">VIBE</span> CODER
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            variant="default"
            size="lg"
            className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 border-none"
            onClick={handleProjectsClick}
          >
            VIEW PROJECTS
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-blue-500 text-blue-500 hover:bg-blue-500/10"
            onClick={handleContactClick}
          >
            CONTACT ME
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="flex flex-col items-center">
          <motion.div
            className="w-0.5 h-8 bg-gradient-to-b from-pink-500 to-transparent"
            animate={{
              scaleY: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>
    </motion.section>
  )
}

export default Hero
