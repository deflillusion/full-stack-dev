import { useState, useEffect, useRef } from "react"

const Cursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 })
  const [prevTargetPosition, setPrevTargetPosition] = useState({ x: 0, y: 0 })
  const [angle, setAngle] = useState(0)
  const [isPointer, setIsPointer] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const frameRef = useRef<number | null>(null)
  const smoothingFactor = 0.3 // Adjust between 0-1: higher = more responsive, lower = smoother

  useEffect(() => {
    // Show cursor only after it has moved to prevent it from showing at 0,0 initially
    const handleFirstMove = (e: MouseEvent) => {
      const newPosition = { x: e.clientX, y: e.clientY }
      setPosition(newPosition)
      setTargetPosition(newPosition)
      setPrevTargetPosition(newPosition)
      setIsVisible(true)
      window.removeEventListener("mousemove", handleFirstMove)
    }
    window.addEventListener("mousemove", handleFirstMove)

    const handleMouseMove = (e: MouseEvent) => {
      // Store previous target position before updating
      setPrevTargetPosition(targetPosition)

      // Update target position immediately
      setTargetPosition({ x: e.clientX, y: e.clientY })

      // Calculate angle based on mouse movement direction
      const dx = e.clientX - prevTargetPosition.x
      const dy = e.clientY - prevTargetPosition.y

      // Only update angle if there's significant movement
      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
        const newAngle = Math.atan2(dy, dx) * (180 / Math.PI)
        setAngle(newAngle)
      }

      const target = e.target as HTMLElement
      setIsPointer(
        window.getComputedStyle(target).cursor === "pointer" ||
          target.tagName === "A" ||
          target.tagName === "BUTTON" ||
          target.closest("a") !== null ||
          target.closest("button") !== null,
      )
    }

    const handleMouseDown = () => setIsActive(true)
    const handleMouseUp = () => setIsActive(false)
    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)
    window.addEventListener("mouseleave", handleMouseLeave)
    window.addEventListener("mouseenter", handleMouseEnter)

    // Animation loop for smooth movement
    const animatePosition = () => {
      // Calculate the difference between current and target position
      const dx = targetPosition.x - position.x
      const dy = targetPosition.y - position.y

      // Only update if there's a significant difference
      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        // Apply smoothing
        const newX = position.x + dx * smoothingFactor
        const newY = position.y + dy * smoothingFactor

        // Update position
        setPosition({ x: newX, y: newY })
      }

      frameRef.current = requestAnimationFrame(animatePosition)
    }

    frameRef.current = requestAnimationFrame(animatePosition)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("mouseleave", handleMouseLeave)
      window.removeEventListener("mouseenter", handleMouseEnter)
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [position, targetPosition, prevTargetPosition, smoothingFactor])

  // Hide default cursor
  useEffect(() => {
    document.body.style.cursor = "none"

    return () => {
      document.body.style.cursor = "auto"
    }
  }, [])

  if (!isVisible) return null

  const cursorColor = isPointer
    ? "linear-gradient(to bottom, #ec4899, #db2777)"
    : "linear-gradient(to bottom, #3b82f6, #2563eb)"

  const glowColor = isPointer ? "0 0 10px rgba(236, 72, 153, 0.7)" : "0 0 10px rgba(59, 130, 246, 0.7)"

  return (
    <div
      className="fixed top-0 left-0 z-50 pointer-events-none"
      style={{
        transform: `translate(${position.x}px, ${position.y}px) translate(-50%, -50%) rotate(${angle + 90}deg) scale(${
          isPointer ? 1.2 : isActive ? 0.8 : 1
        })`,
        transition: isActive ? "transform 0.1s" : "none", // Only add transition for click effect
      }}
    >
      {/* Triangle shape */}
      <div className="relative w-6 h-6">
        {/* Glow effect */}
        <div
          className="absolute inset-0 blur-sm opacity-70"
          style={{
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
            background: cursorColor,
          }}
        />

        {/* Main triangle */}
        <div
          className="absolute inset-0"
          style={{
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
            background: cursorColor,
            boxShadow: glowColor,
          }}
        />

        {/* Inner triangle */}
        <div
          className="absolute inset-0 scale-75"
          style={{
            clipPath: "polygon(50% 15%, 15% 90%, 85% 90%)",
            background: "#0f172a",
          }}
        />
      </div>
    </div>
  )
}

export default Cursor
