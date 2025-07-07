"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, PenToolIcon as Tool, Shield, BarChart2, Zap, Trash2, Wrench, Hammer } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { Section } from "../components/ui/section"
import { SectionBlock } from "../components/ui/section-block"
import { GridLayout } from "../components/ui/grid-layout"
import { SubsectionNav, type SubsectionItem } from "../components/ui/subsection-nav"
import { Subsection } from "../components/ui/subsection"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Services() {
  const subsections: SubsectionItem[] = [
    { id: "main-services", title: "Основные услуги" },
    { id: "price-lists", title: "Прайс-листы" },
    { id: "satisfaction", title: "Удовлетворенность клиентов" },
  ]

  const mainServices = [
    {
      icon: Building,
      title: "Управление недвижимостью",
      description: "Комплексное обслуживание многоквартирных домов и коммерческих объектов",
    },
    {
      icon: Tool,
      title: "Техническое обслуживание",
      description: "Ремонт и обслуживание инженерных систем, плановые и аварийные работы",
    },
    {
      icon: Shield,
      title: "Безопасность",
      description: "Установка и обслуживание систем видеонаблюдения и контроля доступа",
    },
    {
      icon: BarChart2,
      title: "Финансовый учет",
      description: "Прозрачная отчетность, управление платежами и бюджетирование",
    },
    {
      icon: Zap,
      title: "Энергоэффективность",
      description: "Внедрение энергосберегающих технологий и оптимизация потребления ресурсов",
    },
    {
      icon: Trash2,
      title: "Вывоз мусора",
      description: "Регулярный вывоз бытовых отходов и поддержание чистоты придомовой территории",
    },
  ]

  const priceLists = [
    {
      title: "Прайс-лист электрика",
      description: "Стоимость электромонтажных работ",
      icon: Hammer,
      file: "https://drive.google.com/file/d/1OSr_aPKMAoAMOMOX3PxRWzqKn55GVpr1/view?usp=drive_link",
    },
    {
      title: "Прайс-лист сантехника",
      description: "Стоимость сантехнических работ",
      icon: Wrench,
      file: "https://drive.google.com/file/d/15smqBBhTg1ZBtdfc1fod1Sw2ef4Cy51S/view?usp=drive_link",
    },
  ]

  const satisfactionData = [
    { name: "Очень довольны", value: 60, color: "#4CAF50" },
    { name: "Довольны", value: 30, color: "#2196F3" },
    { name: "Нейтрально", value: 7, color: "#FFC107" },
    { name: "Недовольны", value: 3, color: "#F44336" },
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
    <Section background="white">
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold">Наши услуги</h1>
      </motion.div>

      <SubsectionNav section="services" subsections={subsections} />

      <Subsection id="main-services">
        <SectionBlock title="Основные услуги" align="center">
          <GridLayout columns={{ default: 1, md: 2, lg: 3 }}>
            {mainServices.map((service, index) => (
              <motion.div key={index} custom={index} initial="hidden" animate="visible" variants={fadeInUpVariants}>
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center text-sm sm:text-base md:text-lg">
                      <service.icon className="mr-2 text-primary w-4 h-4 sm:w-5 sm:h-5" />
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription className="text-xs sm:text-sm">{service.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </GridLayout>
        </SectionBlock>
      </Subsection>

      <Subsection id="price-lists">
        <SectionBlock title="Прайс-листы" align="center">
          <GridLayout columns={{ default: 1, md: 2 }} gap="default">
            {priceLists.map((doc, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <doc.icon className="h-5 w-5 text-primary" />
                      {doc.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col">
                    <p className="text-muted-foreground mb-4">{doc.description}</p>
                    {doc.file ? (
                      <Link href={doc.file} target="_blank" className="mt-auto">
                        <Button variant="outline">Открыть документ</Button>
                      </Link>
                    ) : null}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </GridLayout>
        </SectionBlock>
      </Subsection>

      <Subsection id="satisfaction">
        <SectionBlock title="Удовлетворенность клиентов" align="center">
          <div className="flex flex-col items-center">
            <motion.div
              className="w-full h-60 sm:h-80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={satisfactionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius="70%"
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {satisfactionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Легенда для круговой диаграммы */}
            <div className="flex flex-wrap justify-center mt-4">
              {satisfactionData.map((entry, index) => (
                <div key={index} className="flex items-center mr-4 mb-2">
                  <div className="w-4 h-4" style={{ backgroundColor: entry.color }} />
                  <span className="ml-2 text-sm sm:text-base">
                    {entry.name}: {entry.value}%
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 max-w-2xl mx-auto text-center">
              <p>
                Мы регулярно проводим опросы среди жильцов обслуживаемых домов для оценки качества наших услуг.
                Результаты опросов помогают нам постоянно улучшать качество обслуживания и оперативно реагировать на
                пожелания клиентов.
              </p>
            </div>
          </div>
        </SectionBlock>
      </Subsection>
    </Section>
  )
}
