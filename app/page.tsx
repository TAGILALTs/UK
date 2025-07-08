"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HomeIcon, BarChart2, Shield, PenTool, ArrowRight, X, Sparkles, Phone, MapPin, Clock } from "lucide-react"
import { Advantages } from "./components/advantages"
import { Testimonials } from "./components/testimonials"
import { ContactForm } from "./components/contact-form"
import VideoBackground from "./components/video-background"

export default function Home() {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  const [isNight, setIsNight] = useState(false)

  useEffect(() => {
    const checkTime = () => {
      const currentHour = new Date().getHours()
      setIsNight(currentHour < 6 || currentHour >= 18)
    }

    checkTime()
    const interval = setInterval(checkTime, 60000)

    return () => clearInterval(interval)
  }, [])

  const handleOpenVideo = () => {
    setIsVideoOpen(true)
  }

  const handleCloseVideo = () => {
    setIsVideoOpen(false)
  }

  const handleOpenContactForm = () => {
    setIsContactFormOpen(true)
  }

  const handleCloseContactForm = () => {
    setIsContactFormOpen(false)
  }

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  }

  return (
    <div className="page-transition">
      {/* Hero Section - оптимизирован для мобильных */}
      <section className="relative h-screen flex items-center justify-center text-white overflow-hidden">
        <VideoBackground />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            <h1
              className={`text-xl sm:text-3xl md:text-5xl font-bold mb-4 text-white ${isNight ? "" : "text-shadow-outline"}`}
            >
              Управляющая организация
            </h1>
          </motion.div>

<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
>
  <p 
    className="text-2xl sm:text-4xl md:text-6xl font-bold mb-6 heading-gradient"
    style={{
      background: "linear-gradient(90deg, #1B5E20 0%, #2E7D32 50%, #388E3C 100%)",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
      textShadow: "2px 2px 4px rgba(0,0,0,0.2)"
    }}
  >
    <strong>ООО "ДЕЛЬТА"</strong>
  </p>
</motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <p className={`text-base sm:text-lg md:text-2xl mb-8 text-white ${isNight ? "" : "text-shadow-outline"}`}>
              Профессионализм рождает доверие
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="btn-gradient text-sm sm:text-base md:text-lg py-3 md:py-4 px-6 md:px-8 shadow-strong w-full sm:w-auto"
                onClick={handleOpenVideo}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Узнать больше
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                variant="outline"
                className="text-sm sm:text-base md:text-lg py-3 md:py-4 px-6 md:px-8 bg-white/10 border-white/30 text-white hover:bg-white/20 w-full sm:w-auto"
                onClick={handleOpenContactForm}
              >
                <Phone className="mr-2 h-4 w-4" />
                Связаться
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Quick Info Section - новая секция для мобильных */}
      <section className="py-8 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-center space-x-2"
            >
              <Phone className="h-5 w-5" />
              <div>
                <p className="text-sm font-semibold">Круглосуточно</p>
                <p className="text-xs opacity-90">+7 (3452) 51-77-07</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-center space-x-2"
            >
              <MapPin className="h-5 w-5" />
              <div>
                <p className="text-sm font-semibold">Тюмень</p>
                <p className="text-xs opacity-90">ул. Институтская, 6/3</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center space-x-2"
            >
              <Clock className="h-5 w-5" />
              <div>
                <p className="text-sm font-semibold">Работаем</p>
                <p className="text-xs opacity-90">Пн-Пт 8:00-17:00</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section - компактнее для мобильных */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-3 heading-gradient">Наши услуги</h2>
            <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Комплексное обслуживание и управление недвижимостью
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                icon: HomeIcon,
                title: "Управление",
                description: "Комплексное обслуживание домов",
                gradient: "from-blue-500 to-blue-600",
              },
              {
                icon: PenTool,
                title: "Техобслуживание",
                description: "Ремонт инженерных систем",
                gradient: "from-green-500 to-green-600",
              },
              {
                icon: Shield,
                title: "Безопасность",
                description: "Видеонаблюдение и контроль",
                gradient: "from-purple-500 to-purple-600",
              },
              {
                icon: BarChart2,
                title: "Учет",
                description: "Прозрачная отчетность",
                gradient: "from-orange-500 to-orange-600",
              },
            ].map((service, index) => (
              <motion.div key={index} variants={itemVariants} whileHover={{ y: -4 }} className="group">
                <Card className="h-full card-hover border-0 shadow-soft group-hover:shadow-strong">
                  <CardHeader className="text-center pb-3">
                    <div
                      className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-medium`}
                    >
                      <service.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-base md:text-lg group-hover:text-primary transition-colors">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center pt-0">
                    <CardDescription className="text-xs md:text-sm leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Advantages />

      <Testimonials />

      {/* CTA Section - более компактная */}
      <section className="py-12 md:py-16 gradient-bg text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">Готовы улучшить качество жизни?</h2>
            <p className="text-sm md:text-lg mb-6 opacity-90 max-w-xl mx-auto">
              Получите консультацию и индивидуальное предложение
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={handleOpenContactForm}
                  className="text-sm md:text-base py-3 md:py-4 px-6 md:px-8 shadow-strong hover:shadow-medium w-full sm:w-auto"
                >
                  Связаться с нами
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleOpenVideo}
                  className="text-sm md:text-base py-3 md:py-4 px-6 md:px-8 bg-white/10 border-white/30 text-white hover:bg-white/20 w-full sm:w-auto"
                >
                  Смотреть видео
                  <Sparkles className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Улучшенное модальное окно для видео */}
      {isVideoOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-full h-full max-w-4xl max-h-[80vh] bg-black rounded-2xl overflow-hidden shadow-strong"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <button
              onClick={handleCloseVideo}
              className="absolute top-4 right-4 p-3 text-white bg-black/50 rounded-full z-10 hover:bg-black/70 transition-colors focus-ring"
            >
              <X className="w-6 h-6" />
            </button>
            <iframe
              src="https://rutube.ru/play/embed/9074c3ba883be88de703ace0e8f5ed36"
              allow="autoplay; fullscreen; picture-in-picture"
              className="w-full h-full rounded-2xl"
            ></iframe>
          </motion.div>
        </motion.div>
      )}

      {/* Улучшенное модальное окно для формы контакта */}
      {isContactFormOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-md shadow-strong max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-bold heading-gradient">Оставить заявку</h2>
              <Button variant="ghost" onClick={handleCloseContactForm} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </div>
            <ContactForm />
          </motion.div>
        </motion.div>
      )}

      <style jsx>{`
        .text-shadow-outline {
          text-shadow: 
            -2px -2px 0 #000,
            2px -2px 0 #000,
            -2px 2px 0 #000,
            2px 2px 0 #000,
            0 0 10px rgba(0,0,0,0.5);
        }
      `}</style>
    </div>
  )
}
