"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"

const projects = [
  {
    id: 1,
    title: "PROJECT_ALPHA",
    description: "A sleek web application with real-time data visualization and interactive dashboards",
    tags: ["React", "TypeScript", "Three.js", "D3.js"],
    image: "/placeholder.svg?height=600&width=800",
    color: "from-pink-500 to-purple-500",
  },
  {
    id: 2,
    title: "PROJECT_BETA",
    description: "Mobile-first e-commerce platform with AR product previews and personalized recommendations",
    tags: ["Next.js", "Tailwind CSS", "Framer Motion", "Stripe"],
    image: "/placeholder.svg?height=600&width=800",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 3,
    title: "PROJECT_GAMMA",
    description: "Interactive dashboard for cryptocurrency analytics with predictive modeling",
    tags: ["Vue.js", "D3.js", "Firebase", "Machine Learning"],
    image: "/placeholder.svg?height=600&width=800",
    color: "from-purple-500 to-blue-500",
  },
  {
    id: 4,
    title: "PROJECT_DELTA",
    description: "Social media platform for creative professionals with portfolio showcasing",
    tags: ["React Native", "GraphQL", "AWS", "Redux"],
    image: "/placeholder.svg?height=600&width=800",
    color: "from-pink-500 to-red-500",
  },
  {
    id: 5,
    title: "PROJECT_EPSILON",
    description: "AI-powered content creation tool with natural language processing",
    tags: ["Python", "TensorFlow", "React", "FastAPI"],
    image: "/placeholder.svg?height=600&width=800",
    color: "from-green-500 to-blue-500",
  },
  {
    id: 6,
    title: "PROJECT_ZETA",
    description: "Augmented reality navigation app for urban exploration",
    tags: ["Unity", "ARKit", "C#", "Mapbox"],
    image: "/placeholder.svg?height=600&width=800",
    color: "from-yellow-500 to-orange-500",
  },
]

const Projects = () => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.1 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="py-20"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: -20, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl font-bold mb-4 inline-block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500">
            PROJECTS_
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-blue-500 mx-auto rounded-full" />
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            Explore my latest work showcasing creative solutions and technical expertise
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4"
        >
          {projects.map((project) => (
            <motion.div key={project.id} variants={itemVariants}>
              <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800 overflow-hidden hover:border-gray-700 transition-all duration-300 h-full flex flex-col group">
                <div className="relative h-48 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-80`}></div>
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-full object-cover mix-blend-overlay"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <CardContent className="flex-grow p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-blue-500 transition-all duration-300">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 mb-4 text-sm">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="bg-gray-800/50 text-gray-300 border-gray-700">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="p-6 pt-0">
                  <Button variant="ghost" className="text-pink-500 hover:text-pink-400 hover:bg-pink-500/10 p-0 h-auto">
                    <span className="mr-2">VIEW PROJECT</span>
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}

export default Projects
