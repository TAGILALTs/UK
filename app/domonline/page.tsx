'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function DomOnline() {
  const features = [
    "Направление данных по всем приборам учёта в одном приложении",
    "Оплата квартплаты и других услуг ЖКХ",
    "Контроль за графиком работ по капитальному ремонту",
    "Направление заявки в управляющую организацию и оперативное получение ответа",
    "Участие в юридически значимых общедомовых собраниях онлайн",
    "Оценка качества услуг управляющей организации",
    "Чтение интересных статей по теме ЖКХ",
    "Информирование собственников о плановых работах и аварийных ситуациях в доме в режиме реального времени"
  ]

  const communityFeatures = [
    "Обсуждать улучшения для дома в чатах",
    "Создавать коллективные обращения в управляющую организацию одной кнопкой",
    "Проводить общие собрания собственников без бумажной волокиты"
  ]

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.h1 
        className="text-4xl font-bold text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        ДомОнлайн
      </motion.h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Госуслуги.Дом</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            
      Госуслуги.Дом — это современный и эффективный инструмент для решения вопросов ЖКХ.
          </p>
          <Link href="https://dom.gosuslugi.ru" target="_blank" rel="noopener noreferrer">
            <Button>Перейти на dom.gosuslugi.ru</Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Возможности приложения</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <motion.li 
                key={index}
                className="flex items-start"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <CheckCircle2 className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-1" />
                <span>{feature}</span>
              </motion.li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Управлять многоквартирным домом удобно вместе с соседями🏡👥</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            В приложении Госуслуги.Дом есть три функции, которые помогут собственникам квартир:
          </p>
          <ul className="space-y-2">
            {communityFeatures.map((feature, index) => (
              <motion.li 
                key={index}
                className="flex items-start"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <CheckCircle2 className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-1" />
                <span>{feature}</span>
              </motion.li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
