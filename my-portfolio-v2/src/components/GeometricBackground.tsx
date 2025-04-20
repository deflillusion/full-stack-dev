"use client"

import { useRef, useEffect } from "react"
import { motion } from "framer-motion"

const GeometricBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Triangle class
    class Triangle {
      x: number
      y: number
      size: number
      speed: number
      color: string
      rotation: number
      rotationSpeed: number

      constructor() {
        const width = canvas?.width || window.innerWidth
        const height = canvas?.height || window.innerHeight

        this.x = Math.random() * width
        this.y = Math.random() * height
        this.size = Math.random() * 15 + 5
        this.speed = Math.random() * 0.2 + 0.1
        this.color = Math.random() > 0.5 ? "#ec4899" : "#3b82f6"
        this.rotation = Math.random() * Math.PI * 2
        this.rotationSpeed = (Math.random() - 0.5) * 0.01
      }

      update() {
        this.y += this.speed
        this.rotation += this.rotationSpeed

        const height = canvas?.height || window.innerHeight
        const width = canvas?.width || window.innerWidth

        if (this.y > height + this.size) {
          this.y = -this.size
          this.x = Math.random() * width
        }
      }

      draw() {
        if (!ctx) return

        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation)

        ctx.beginPath()
        ctx.moveTo(0, -this.size)
        ctx.lineTo(-this.size, this.size)
        ctx.lineTo(this.size, this.size)
        ctx.closePath()

        ctx.strokeStyle = this.color
        ctx.lineWidth = 1
        ctx.globalAlpha = 0.2
        ctx.stroke()

        ctx.restore()
      }
    }

    // Create triangles
    const triangles: Triangle[] = []
    for (let i = 0; i < 30; i++) {
      triangles.push(new Triangle())
    }

    // Grid lines
    const drawGrid = () => {
      if (!ctx) return

      const gridSize = 50
      const gridOpacity = 0.05

      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 0.5
      ctx.globalAlpha = gridOpacity

      // Vertical lines
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      // Horizontal lines
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }
    }

    // Animation loop
    const animate = () => {
      if (!ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw grid
      drawGrid()

      // Draw and update triangles
      triangles.forEach((triangle) => {
        triangle.update()
        triangle.draw()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-0">
      {/* Canvas for animated elements */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Static elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950" />

      {/* Horizontal line */}
      <motion.div
        className="absolute top-1/2 left-0 w-full h-px bg-pink-500/10"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      {/* Vertical line */}
      <motion.div
        className="absolute top-0 left-1/2 w-px h-full bg-blue-500/10"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-pink-500/5 blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-500/5 blur-[100px]" />
    </div>
  )
}

export default GeometricBackground
