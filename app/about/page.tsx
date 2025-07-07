"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, Users, Clock, ThumbsUp, Award, Shield, Sparkles, Leaf } from "lucide-react"
import { Section } from "../components/ui/section"
import { SectionBlock } from "../components/ui/section-block"
import { GridLayout } from "../components/ui/grid-layout"
import { SubsectionNav, type SubsectionItem } from "../components/ui/subsection-nav"
import { Subsection } from "../components/ui/subsection"

export default function About() {
  const subsections: SubsectionItem[] = [
    { id: "overview", title: "Обзор" },
    { id: "team", title: "Наша команда" },
    { id: "advantages", title: "Преимущества" },
  ]

  const stats = [
    { icon: Building, value: "5+", label: "Обслуживаемых домов" },
    { icon: Users, value: "1,000+", label: "Довольных жильцов" },
    { icon: Clock, value: "24/7", label: "Поддержка" },
    { icon: ThumbsUp, value: "95%", label: "Удовлетворенность клиентов" },
  ]

  const teamMembers = [
    { name: "Дюков Артём Игоревич", position: "Директор", image: "https://i.imgur.com/yFPerU4.jpeg" },
    { name: "Ковалев Иван Васильевич", position: "Заместитель директора", image: "https://i.imgur.com/T63iH8f.jpeg" },
    { name: "Балюнов Антон Валерьевич", position: "Начальник участка", image: "https://i.imgur.com/oF2GDR6.jpeg" },
  ]

  const advantages = [
    {
      icon: Shield,
      title: "Надежность",
      description: "15 лет успешной работы на рынке управления недвижимостью",
    },
    {
      icon: Clock,
      title: "Оперативность",
      description: "Круглосуточная диспетчерская служба и быстрое реагирование",
    },
    {
      icon: Users,
      title: "Профессионализм",
      description: "Команда сертифицированных специалистов с многолетним опытом",
    },
    {
      icon: Sparkles,
      title: "Инновации",
      description: "Внедрение современных технологий управления",
    },
    {
      icon: Award,
      title: "Качество",
      description: "Высокие стандарты обслуживания и контроль качества",
    },
    {
      icon: Leaf,
      title: "Экологичность",
      description: "Применение экологически безопасных материалов и технологий",
    },
  ]

  return (
    <Section background="white">
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold">О нашей компании</h1>
      </motion.div>

      <SubsectionNav section="about" subsections={subsections} />

      <Subsection id="overview">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-base md:text-lg text-center mb-4 md:mb-8">
            Специалисты компании ООО «Дельта» более шести лет производят профессиональные электромонтажные работы любой
            сложности и на постоянной основе осуществляют текущий ремонт и обслуживание сетей электроснабжения,
            электроосвещения в сотнях объектов по городу Тюмени и Тюменской области. Специалисты-электрики нашей
            компании имеют обширный инженерный опыт, глубокие знания современных технологий и электроматериалов, а также
            высокие квалификационные разряды, что гарантирует качество и сроки исполнения всех видов работ.
          </p>
          <p className="text-base md:text-lg text-center">
            С 2015 года по 2021 год компания занималась проведением капитальных ремонтов сетей теплоснабжения и
            водоснабжения. Полный спектр сантехнических работ при проведении капитальных ремонтов: монтаж систем
            отопления, водоснабжения, канализации. Установка радиаторов отопления, счетчиков воды, сантехнических
            приборов и оборудования. Монтаж водопроводных и канализационных колодцев. Выгребные ямы, септики. Врезка в
            магистраль.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-8 md:mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="text-center h-full flex flex-col justify-between">
                <CardHeader>
                  <CardTitle className="flex justify-center">
                    <stat.icon size={36} className="text-primary" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-center">
                  <p className="text-2xl md:text-3xl font-bold mb-2">{stat.value}</p>
                  <CardDescription>{stat.label}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Subsection>

      <Subsection id="team">
        <SectionBlock title="Наша команда" align="center">
          <GridLayout columns={{ default: 1, sm: 2, md: 3 }}>
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col justify-between">
                  <CardHeader className="flex flex-col items-center">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden mb-4">
                      <img
                        src={member.image || "/placeholder.svg"}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardTitle className="text-center text-lg md:text-xl">{member.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">{member.position}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </GridLayout>
        </SectionBlock>
      </Subsection>

      <Subsection id="advantages">
        <SectionBlock title="Наши преимущества" align="center">
          <GridLayout columns={{ default: 1, sm: 2, lg: 3 }}>
            {advantages.map((advantage, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <advantage.icon className="mr-3 h-6 w-6 text-primary" />
                      {advantage.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{advantage.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </GridLayout>
        </SectionBlock>
      </Subsection>
    </Section>
  )
}
