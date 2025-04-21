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
    title: "Калькулятор на Python (dev-core-101)",
    description: "Простой калькулятор на Python",
    tags: ["Python"],
    image: "../images/calc_py.jpg?height=600&width=800",
    color: "",
    url: "https://github.com/deflillusion/full-stack-dev/blob/main/dev-core-101/dev-core-101-finalproject.py"
  },
  {
    id: 2,
    title: "Сайт-портфолио (Astro) ver.1",
    description: "Первая версия сайта-портфолио",
    tags: ["Astro", "Tailwind CSS", "JavaScript"],
    image: "../images/my-website.jpg?height=600&width=800",
    color: "",
    url: "https://github.com/deflillusion/full-stack-dev/tree/f53cf8ba3390963b266ca1d8c93a7ea4eaa5c6e1/my-portfolio"
  },
  {
    id: 3,
    title: "MVP приложение для учета расходов и доходов",
    description: "Первое MVP приложение",
    tags: ["Python", "TypeScript", "SQLite"],
    image: "../images/MVP.jpg?height=600&width=800",
    color: "",
    url: "https://app.defl-illusion.com"
  },
  {
    id: 4,
    title: "Сайт-портфолио (React) ver.2",
    description: "Вторая версия сайта-портфолио",
    tags: ["React", "TypeScript", "Tailwind CSS"],
    image: "../images/Site-v2.jpg?height=600&width=800",
    color: "",
    url: "https://github.com/deflillusion/full-stack-dev/tree/main/my-portfolio-v2"
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
            Мои первые шаги в разработке — от идеи до работающего кода. Портфолио растёт вместе со мной.


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
                  {project.url ? (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-pink-500 hover:text-pink-400 hover:bg-pink-500/10 p-0 h-auto font-medium"
                    >
                      <span className="mr-2">VIEW PROJECT</span>
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </a>
                  ) : (
                    <Button
                      variant="ghost"
                      className="text-pink-500 hover:text-pink-400 hover:bg-pink-500/10 p-0 h-auto"
                      disabled
                    >
                      <span className="mr-2">COMING SOON</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  )}
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
