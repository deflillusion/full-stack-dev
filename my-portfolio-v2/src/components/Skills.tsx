"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const skills = [
  {
    category: "Frontend",
    items: [
      { name: "React", level: 95 },
      { name: "TypeScript", level: 90 },
      { name: "Next.js", level: 85 },
      { name: "Vue.js", level: 80 },
      { name: "Tailwind CSS", level: 95 },
      { name: "Framer Motion", level: 85 },
    ],
    color: "from-pink-500 to-purple-500",
    icon: "💻",
  },
  {
    category: "Backend",
    items: [
      { name: "Node.js", level: 85 },
      { name: "Express", level: 80 },
      { name: "Firebase", level: 90 },
      { name: "MongoDB", level: 75 },
      { name: "GraphQL", level: 70 },
      { name: "REST APIs", level: 90 },
    ],
    color: "from-blue-500 to-cyan-500",
    icon: "🔧",
  },
  {
    category: "Tools",
    items: [
      { name: "Git", level: 90 },
      { name: "Webpack", level: 75 },
      { name: "Vite", level: 85 },
      { name: "Docker", level: 65 },
      { name: "Figma", level: 80 },
      { name: "VS Code", level: 95 },
    ],
    color: "from-purple-500 to-blue-500",
    icon: "🛠️",
  },
  {
    category: "Other",
    items: [
      { name: "UI/UX Design", level: 85 },
      { name: "Responsive Design", level: 95 },
      { name: "Performance Optimization", level: 80 },
      { name: "SEO", level: 75 },
      { name: "Accessibility", level: 85 },
      { name: "Testing", level: 70 },
    ],
    color: "from-green-500 to-blue-500",
    icon: "🎨",
  },
]

const Skills = () => {
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
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: -20, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl font-bold mb-4 inline-block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500">
            SKILLS_
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-blue-500 mx-auto rounded-full" />
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            Technical expertise and proficiencies developed over years of professional experience
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {skills.map((skillGroup, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800 overflow-hidden h-full hover:border-gray-700 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl mr-3 bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700">
                      {skillGroup.icon}
                    </div>
                    <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r bg-gradient-to-r from-pink-500 to-blue-500">
                      {skillGroup.category}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {skillGroup.items.map((skill) => (
                      <div key={skill.name} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">{skill.name}</span>
                          <span className="text-xs text-gray-500">{skill.level}%</span>
                        </div>
                        <Progress
                          value={skill.level}
                          className="h-1.5 bg-gray-800"
                          indicatorClassName={`bg-gradient-to-r ${skillGroup.color}`}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16"
        >
          <Card className="bg-gray-900/30 backdrop-blur-sm border-gray-800 overflow-hidden">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-full md:w-1/3 flex justify-center">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full blur opacity-25 animate-pulse-slow"></div>
                    <div className="relative bg-gray-900 p-1 rounded-full">
                      <div className="w-32 h-32 flex items-center justify-center rounded-full bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700">
                        <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500">
                          5+
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-2/3 text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500">
                    Years of Experience
                  </h3>
                  <p className="text-gray-300">
                    With over 5 years of experience in web development, I've worked on a diverse range of projects from
                    small business websites to complex enterprise applications. My focus is on creating clean,
                    efficient, and maintainable code that delivers exceptional user experiences.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default Skills
