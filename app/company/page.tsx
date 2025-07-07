"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, FileCheck, Building, Award, Shield } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Section } from "../components/ui/section"
import { SectionBlock } from "../components/ui/section-block"
import { GridLayout } from "../components/ui/grid-layout"
import { SubsectionNav, type SubsectionItem } from "../components/ui/subsection-nav"
import { Subsection } from "../components/ui/subsection"

export default function Company() {
  const [expandedItem, setExpandedItem] = useState<number | null>(null)

  const subsections: SubsectionItem[] = [
    { id: "documents", title: "Документы" },
    { id: "licenses", title: "Лицензии и сертификаты" },
    { id: "mission", title: "Миссия и ценности" },
  ]

  const documents = [
    {
      title: "Карточка компании",
      description: "Основная информация о компании",
      icon: Building,
      file: "https://drive.google.com/file/d/11fpmB5T2rg57Ip5KwoFBhhUiNaHCcS59/view?usp=drive_link",
    },
    {
      title: "Выписка из ЕГРЮЛ",
      description: "",
      icon: FileText,
      file: "https://drive.google.com/file/d/1uZfG1QdZAobcviXc48_oQljR6CLYJqxZ/view?usp=drive_link",
    },
    {
      title: "Устав организации",
      description: "Основной учредительный документ",
      icon: FileText,
      file: "https://drive.google.com/file/d/1ps6578bU-vlrRbbewN8B0AurP91s3nd-/view?usp=drive_link",
    },
    {
      title: "Аттестат квалификации",
      description: "по управлению многоквартирными домами",
      icon: FileCheck,
      file: "https://drive.google.com/file/d/1eBsRC5LM4AE_x3TuGXuSvpiK55oHXYE2/view?usp=drive_link",
    },
    {
      title: "Выписка из реестра лицензий на 24.06.2021",
      description: "Лицензия на осуществление деятельности",
      icon: Award,
      file: "https://drive.google.com/file/d/1sKQxV-pxNMZizHDPQNvF90aRKGFs-Jmw/view?usp=drive_link",
    },
    {
      title: "Политика конфиденциальности",
      description: "Обработка персональных данных",
      icon: Shield,
      file: "https://drive.google.com/file/d/1bexaDHb9ndmQnQCvsjU4-kc9IrfrKGRA/view?usp=drive_link",
    },
  ]

  const licenses = [
    {
      title: "Лицензия на управление МКД",
      description: "Лицензия на осуществление предпринимательской деятельности по управлению многоквартирными домами",
      number: "№072-000123",
      date: "15.03.2015",
      file: "https://drive.google.com/file/d/1sKQxV-pxNMZizHDPQNvF90aRKGFs-Jmw/view?usp=drive_link",
    },
  ]

  const missionValues = {
    mission:
      "Наша миссия — создавать комфортные и безопасные условия проживания для жильцов, обеспечивая профессиональное управление и обслуживание многоквартирных домов.",
    values: [
      {
        title: "Профессионализм",
        description:
          "Мы постоянно повышаем квалификацию наших сотрудников и внедряем современные технологии управления.",
      },
      {
        title: "Ответственность",
        description:
          "Мы несем полную ответственность за качество предоставляемых услуг и выполнение взятых на себя обязательств.",
      },
      {
        title: "Прозрачность",
        description: "Мы обеспечиваем полную прозрачность нашей деятельности и финансовой отчетности.",
      },
      {
        title: "Клиентоориентированность",
        description: "Мы всегда учитываем пожелания и потребности наших клиентов при принятии решений.",
      },
    ],
  }

  return (
    <Section background="white">
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold">Компания</h1>
      </motion.div>

      <SubsectionNav section="company" subsections={subsections} />

      <Subsection id="documents">
        <SectionBlock title="Документы компании" align="center">
          <GridLayout columns={{ default: 1, md: 2 }} gap="default">
            {documents.map((doc, index) => (
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

      <Subsection id="licenses">
        <SectionBlock title="Лицензии и сертификаты" align="center">
          <div className="space-y-6">
            {licenses.map((license, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="bg-primary/10 p-6 flex items-center justify-center md:w-1/4">
                    <Award className="h-16 w-16 text-primary" />
                  </div>
                  <div className="p-6 md:w-3/4">
                    <h3 className="text-xl font-semibold mb-2">{license.title}</h3>
                    <p className="text-gray-600 mb-4">{license.description}</p>
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div>
                        <span className="text-sm text-gray-500">Номер:</span>
                        <p className="font-medium">{license.number}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Дата выдачи:</span>
                        <p className="font-medium">{license.date}</p>
                      </div>
                    </div>
                    <Link href={license.file} target="_blank">
                      <Button variant="outline" size="sm">
                        Посмотреть документ
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </SectionBlock>
      </Subsection>

      <Subsection id="mission">
        <SectionBlock title="Миссия и ценности" align="center">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Наша миссия</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">{missionValues.mission}</p>
            </CardContent>
          </Card>

          <h3 className="text-2xl font-semibold mb-6 text-center">Наши ценности</h3>
          <GridLayout columns={{ default: 1, md: 2 }} gap="default">
            {missionValues.values.map((value, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <CardTitle>{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </GridLayout>
        </SectionBlock>
      </Subsection>
    </Section>
  )
}
