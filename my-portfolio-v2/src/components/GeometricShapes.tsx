import { motion } from "framer-motion"

const GeometricShapes = () => {
  return (
    <div className="fixed inset-0 z-0">
      {/* Grid lines */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Horizontal line */}
      <motion.div
        className="absolute top-1/2 left-0 w-full h-px bg-pink-500/20"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      {/* Vertical line */}
      <motion.div
        className="absolute top-0 left-1/2 w-px h-full bg-blue-500/20"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      {/* Animated shapes */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full border border-pink-500/20"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />

      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full border border-blue-500/20"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.7 }}
      />

      <motion.div
        className="absolute top-1/3 right-1/3 w-32 h-32"
        style={{
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          border: "1px solid rgba(236, 72, 153, 0.2)",
        }}
        initial={{ opacity: 0, rotate: 180 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ duration: 1, delay: 0.9 }}
      />

      <motion.div
        className="absolute bottom-1/3 left-1/3 w-48 h-48"
        style={{
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          border: "1px solid rgba(59, 130, 246, 0.2)",
        }}
        initial={{ opacity: 0, rotate: -180 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ duration: 1, delay: 1.1 }}
      />
    </div>
  )
}

export default GeometricShapes
