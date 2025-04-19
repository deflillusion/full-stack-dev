import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Github, Linkedin, Twitter } from "lucide-react"

const About = () => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.1 })

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
            ABOUT_ME
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-blue-500 mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : { x: -50, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-pink-500 to-blue-500 rounded-lg blur opacity-20 animate-pulse-slow"></div>
              <Card className="relative bg-gray-900/70 backdrop-blur-md border-gray-800 overflow-hidden h-full">
                <CardContent className="p-1">
                  <img src="/placeholder.svg?height=600&width=600" alt="Developer" className="w-full h-auto rounded" />
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-gray-700 hover:border-pink-500 hover:text-pink-500"
              >
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-gray-700 hover:border-blue-500 hover:text-blue-500"
              >
                <Linkedin className="h-4 w-4" />
                <span>LinkedIn</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-gray-700 hover:border-cyan-500 hover:text-cyan-500"
              >
                <Twitter className="h-4 w-4" />
                <span>Twitter</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-gray-700 hover:border-purple-500 hover:text-purple-500"
              >
                <FileText className="h-4 w-4" />
                <span>Resume</span>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-3"
          >
            <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800 h-full">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500">
                  Hello, I'm [Your Name]
                </h3>

                <div className="space-y-6 text-gray-300">
                  <p>
                    I'm a passionate frontend developer with a love for creating immersive digital experiences. My
                    journey in web development began 5 years ago, and I've been crafting beautiful, functional
                    interfaces ever since.
                  </p>

                  <p>
                    With expertise in React, TypeScript, and modern CSS frameworks, I build applications that are not
                    only visually stunning but also performant and accessible. I believe that great design should be
                    both beautiful and functional, creating memorable experiences for users.
                  </p>

                  <p>
                    My approach combines technical expertise with creative problem-solving. I'm constantly exploring new
                    technologies and design trends to push the boundaries of what's possible on the web.
                  </p>

                  <p>
                    When I'm not coding, you can find me exploring new technologies, contributing to open-source
                    projects, or playing indie games like DATA WING that inspire my design aesthetic.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-lg font-semibold mb-2 text-pink-500">Education</h4>
                    <p className="text-gray-300 text-sm">B.S. Computer Science</p>
                    <p className="text-gray-400 text-xs">University of Technology, 2018</p>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-lg font-semibold mb-2 text-blue-500">Experience</h4>
                    <p className="text-gray-300 text-sm">Senior Frontend Developer</p>
                    <p className="text-gray-400 text-xs">Tech Innovations Inc., 2020-Present</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export default About
