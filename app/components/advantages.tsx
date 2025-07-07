"use client"

import { motion } from "framer-motion"
import { Shield, Clock, Users, Sparkles, Award, Leaf } from "lucide-react"

const advantages = [
  {
    icon: Shield,
    title: "Надежность",
    description: "15 лет успешной работы на рынке управления недвижимостью",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    icon: Clock,
    title: "Оперативность",
    description: "Круглосуточная диспетчерская служба и быстрое реагирование",
    gradient: "from-green-500 to-green-600",
  },
  {
    icon: Users,
    title: "Профессионализм",
    description: "Команда сертифицированных специалистов с многолетним опытом",
    gradient: "from-purple-500 to-purple-600",
  },
  {
    icon: Sparkles,
    title: "Инновации",
    description: "Внедрение современных технологий управления",
    gradient: "from-orange-500 to-orange-600",
  },
  {
    icon: Award,
    title: "Качество",
    description: "Высокие стандарты обслуживания и контроль качества",
    gradient: "from-red-500 to-red-600",
  },
  {
    icon: Leaf,
    title: "Экологичность",
    description: "Применение экологически безопасных материалов и технологий",
    gradient: "from-emerald-500 to-emerald-600",
  },
]

export function Advantages() {
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
    hidden: { opacity: 0, y: 30 },
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
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 heading-gradient">Почему мы лучше других</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Наши преимущества, которые делают нас надежным партнером в управлении недвижимостью
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {advantages.map((advantage, index) => (
            <motion.div key={index} variants={itemVariants} whileHover={{ y: -8 }} className="group">
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-soft hover:shadow-strong transition-all duration-300 h-full flex flex-col border border-gray-100">
                <div
                  className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br ${advantage.gradient} flex items-center justify-center shadow-medium group-hover:scale-110 transition-transform duration-300`}
                >
                  <advantage.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors">
                  {advantage.title}
                </h3>
                <p className="text-gray-600 flex-grow leading-relaxed">{advantage.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
