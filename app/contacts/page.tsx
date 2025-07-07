"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react"
import { GoogleMap } from "../components/google-map"
import { Section } from "../components/ui/section"
import { SectionBlock } from "../components/ui/section-block"
import { GridLayout } from "../components/ui/grid-layout"

export default function Contacts() {
  const contactInfo = [
    { icon: Phone, title: "Единый номер", value: "+7 (3452) 51-77-07", description: "Круглосуточная поддержка" },
    { icon: Mail, title: "Email", value: "Office.delta@bk.ru", description: "Для общих вопросов" },
    { icon: MapPin, title: "Адрес", value: "г. Тюмень, ул. Институтская, д. 6/3", description: "Главный офис" },
    { icon: MessageCircle, title: "Telegram", value: "@uk_example_support", description: "Оперативная поддержка" },
    {
      icon: MessageCircle,
      title: "Telegram канал",
      value: "https://t.me/YKdelta72",
      description: "Новости и объявления",
    },
  ]

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  }

  return (
    <>
      <Section background="white">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold">Контакты</h1>
        </motion.div>

        <GridLayout columns={{ default: 1, md: 2, lg: 3 }}>
          {contactInfo.map((contact, index) => (
            <motion.div key={index} custom={index} initial="hidden" animate="visible" variants={fadeInUpVariants}>
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <contact.icon className="mr-2 text-primary" />
                    {contact.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between">
                  <p className="font-semibold">{contact.value}</p>
                  <p className="text-sm text-gray-500">{contact.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </GridLayout>
      </Section>

      <Section background="gray">
        <SectionBlock title="Наш офис на карте">
          <div className="h-[400px] rounded-lg overflow-hidden">
            <GoogleMap />
          </div>
        </SectionBlock>
      </Section>

      {/* Дополнительный раздел для демонстрации */}
      <Section background="white">
        <SectionBlock title="Часы работы" align="center">
          <div className="max-w-2xl mx-auto bg-secondary p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Офис</h3>
                <ul className="space-y-2">
                  <li>
                    <span className="font-medium">Пн-Чт:</span> с 09:00 до 18:00
                  </li>
                  <li>
                    <span className="font-medium">Пт:</span> с 09:00 до 17:00
                  </li>
                  <li>
                    <span className="font-medium">Обед:</span> с 12:00 до 13:00
                  </li>
                  <li>
                    <span className="font-medium">Сб-Вс:</span> выходной
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Аварийно-диспетчерская служба</h3>
                <p>Работает круглосуточно без выходных</p>
                <p className="mt-2 font-medium">Телефон: +7 (3452) 51-77-07</p>
              </div>
            </div>
          </div>
        </SectionBlock>
      </Section>
    </>
  )
}
