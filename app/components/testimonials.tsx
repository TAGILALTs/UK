"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const testimonials = [
  {
    name: "Теняева Ольга",
    position: "Председатель, Курортная, 53",
    text: "Спасибо большое нашей УК, перед самым Новым годом почистили снег, сразу вывезли кучи и сделали генеральную уборку в подъездах. Новый год проводим в чистоте и порядке. Ещё раз спасибо.",
    rating: 5,
    gradient: "from-blue-500 to-blue-600",
  },
  {
    name: "Анастасия",
    position: "Житель, Харьковская 83",
    text: "Пришли с лета в эту УК. Слов нет, одни эмоции. Косметика, двери, видеонаблюдение, домофон и многое другое, всего за 4 месяца сделали. А самое главное, что мы до них сидели 2 месяца без горячей воды. Спасибо вам огромное, надеемся, что так и будете работать.",
    rating: 5,
    gradient: "from-green-500 to-green-600",
  },
  {
    name: "Сергей",
    position: "Житель, Авторемонтная 27",
    text: "УК действительно работает, вопросов нет. Самое главное, что сам Директор всегда на связи с нами. Любой вопрос можно задать, никогда не откажет, поможет. Вот, что значит преданность своей работе. Спасибо Вам больше.",
    rating: 5,
    gradient: "from-purple-500 to-purple-600",
  },
  {
    name: "Житель",
    position: "Харьковская 83",
    text: "Пришли к ним после Монолита, не сравнить. Легко дозвониться, быстро решают вопросы на удивление. Посмотрим, что будет дальше, главное, чтобы уровень, как минимум, не снижался. Большая вам благодарность.",
    rating: 4,
    gradient: "from-orange-500 to-orange-600",
  },
  {
    name: "Антон",
    position: "Житель, Авторемонтная 27а",
    text: "Долго мучились с горячей водой. Бойлер был в плохом состоянии. Ребята молодцы, даже сам Директор выходил из подвала поздно ночью, но восстановили все таки его, а самое главное выбили за счет капитального ремонта замену до конца лета. Уважение такой УК.",
    rating: 5,
    gradient: "from-red-500 to-red-600",
  },
  {
    name: "Павел",
    position: "Председатель, Институтская 6",
    text: "Ребята за лето провели кучу работы в подвале. До этого они поменяли все трубы горячего и холодного водоснабжения. А начиная с августа, заменили пол подвала трубы отопления. Ну что сказать, молодцы! Спасибо за вашу работу.",
    rating: 5,
    gradient: "from-emerald-500 to-emerald-600",
  },
]

export function Testimonials() {
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
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 heading-gradient">Отзывы наших клиентов</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Мнения жильцов домов, которые мы обслуживаем
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={itemVariants} whileHover={{ y: -8 }} className="group">
              <Card className="h-full card-hover border-0 shadow-soft group-hover:shadow-strong relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${testimonial.gradient}`}></div>
                <CardContent className="p-6 md:p-8 flex flex-col h-full">
                  <div className="flex items-center mb-4">
                    <Quote className="h-8 w-8 text-primary/20 mr-2" />
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6 flex-grow leading-relaxed italic">"{testimonial.text}"</p>

                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-center">
                      <div
                        className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center mr-4 shadow-medium`}
                      >
                        <span className="text-white font-semibold text-lg">{testimonial.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                        <p className="text-sm text-gray-500">{testimonial.position}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
