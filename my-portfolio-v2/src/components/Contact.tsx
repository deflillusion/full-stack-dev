import type React from "react"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react"
import VirusAnimation from "./VirusAnimation"
// @ts-ignore
import { sendEmail } from "@/utils/email.js"
import { toast } from "sonner"

const Contact = () => {
  const ref = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.1 })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (formRef.current) {
      const formData = {
        name: (formRef.current.elements.namedItem('name') as HTMLInputElement).value,
        email: (formRef.current.elements.namedItem('email') as HTMLInputElement).value,
        // subject: (formRef.current.elements.namedItem('subject') as HTMLInputElement).value,
        message: (formRef.current.elements.namedItem('message') as HTMLTextAreaElement).value,
      };

      sendEmail(formData)
        .then(() => {
          setIsSubmitting(false);
          setIsSubmitted(true);
          formRef.current?.reset();

          // Reset form after 5 seconds
          setTimeout(() => {
            setIsSubmitted(false);
          }, 5000);
        })
        .catch((error: unknown) => {
          console.error('Error sending email:', error);
          setIsSubmitting(false);
          toast.error("Ошибка при отправке сообщения. Пожалуйста, попробуйте позже.");
        });
    }
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
            CONTACT_ME
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-blue-500 mx-auto rounded-full" />
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : { x: -50, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800 h-full">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500">
                  Контактная информация
                </h3>

                <div className="space-y-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-pink-500/10 text-pink-500 mr-4">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Email</h4>
                      <p className="text-white font-medium">defl.illusion@gmail.com</p>
                      <p className="text-gray-500 text-sm mt-1">Можно писать в любое время</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-blue-500/10 text-blue-500 mr-4">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Phone</h4>
                      <p className="text-white font-medium">+* (***) ***-****</p>
                      <p className="text-gray-500 text-sm mt-1">Доступно только Пн-Пт, 09-18</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-purple-500/10 text-purple-500 mr-4">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Локация</h4>
                      <p className="text-white font-medium">Астана, Казахстан</p>
                      <p className="text-gray-500 text-sm mt-1">Можно удалённо</p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                  <h4 className="text-lg font-medium mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500">
                    Рабочее время
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Понедельник - Пятница:</span>
                      <span className="text-white">9:00  - 18:00 </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Суббота:</span>
                      <span className="text-white">Выходной</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Воскресенье:</span>
                      <span className="text-white">Выходной</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800 overflow-hidden">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500">
                  Отправить сообщение
                </h3>

                {isSubmitted ? (
                  <motion.div
                    className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-8 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="mb-6">
                      <VirusAnimation className="text-4xl" />
                    </div>
                    <h4 className="text-xl font-bold text-pink-500 mb-2">Сообщение отправлено!</h4>
                    <p className="text-gray-300">Спасибо за обращение. Я скоро свяжусь с вами.</p>
                  </motion.div>
                ) : (
                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-gray-400">
                          Имя
                        </label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Ваше имя"
                          required
                          className="bg-gray-800/50 border-gray-700 focus:border-pink-500 text-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-gray-400">
                          Email
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="your.email@example.com"
                          required
                          className="bg-gray-800/50 border-gray-700 focus:border-pink-500 text-white"
                        />
                      </div>
                    </div>

                    {/* <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium text-gray-400">
                        Тема обращения
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="Связаться по проекту"
                        required
                        className="bg-gray-800/50 border-gray-700 focus:border-pink-500 text-white"
                      />
                    </div> */}

                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium text-gray-400">
                        Сообщение
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        rows={5}
                        placeholder="Ваше сообщение..."
                        required
                        className="bg-gray-800/50 border-gray-700 focus:border-pink-500 text-white resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-6 bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all duration-300"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          В процессе...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          ОТПРАВИТЬ
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export default Contact
