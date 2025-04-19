import { motion } from "framer-motion"

interface TriangleProps {
  size?: number
  animated?: boolean
  className?: string
}

const Triangle = ({ size = 24, animated = false, className = "" }: TriangleProps) => {
  const animationProps = animated
    ? {
        animate: {
          rotate: [0, 360],
        },
        transition: {
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        },
      }
    : {}

  return (
    <motion.div {...animationProps} className={`relative ${className}`} style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-0"
        style={{
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          background: "linear-gradient(to right, #ec4899, #3b82f6)",
        }}
      />
      <motion.div
        className="absolute inset-0 scale-90"
        style={{
          clipPath: "polygon(50% 15%, 10% 90%, 90% 90%)",
          background: "#0f172a",
        }}
      />
    </motion.div>
  )
}

export default Triangle
