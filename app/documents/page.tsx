"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, FileSpreadsheet, Filter, FileCheck, FileArchive } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Section } from "../components/ui/section"
import { SectionBlock } from "../components/ui/section-block"
import { GridLayout } from "../components/ui/grid-layout"
import { SubsectionNav, type SubsectionItem } from "../components/ui/subsection-nav"
import { Subsection } from "../components/ui/subsection"

export default function Documents() {
  const [expandedItem, setExpandedItem] = useState<number | null>(null)
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [selectedAddress, setSelectedAddress] = useState<string>("all")
  const [selectedOzpYear, setSelectedOzpYear] = useState<string>("all")
  const [selectedOzpAddress, setSelectedOzpAddress] = useState<string>("all")

  const subsections: SubsectionItem[] = [
    { id: "company-docs", title: "Документы компании" },
    { id: "reports", title: "Годовые отчеты" },
    { id: "regulations", title: "Нормативные документы" },
    { id: "ozp", title: "План подготовки к ОЗП" },
  ]

  const companyDocs = [
    {
      title: "Бухгалтерская отчетность",
      description: "Финансовая отчетность за 2023 год",
      icon: FileSpreadsheet,
      file: "https://drive.google.com/file/d/1HUZganttoNNcEq4ytTgjSqJTAYKucP4c/view?usp=drive_link",
    },
    {
      title: "Проект договора управления МКД",
      description: "",
      icon: FileText,
      file: "https://drive.google.com/file/d/1jJOmV2T2D5iTNIYI98pssVKw-OlIjk7f/view?usp=drive_link",
    },
    {
      title: "Устав организации",
      description: "Основной учредительный документ",
      icon: FileText,
      file: "https://drive.google.com/file/d/1ps6578bU-vlrRbbewN8B0AurP91s3nd-/view?usp=drive_link",
    },
    {
      title: "Политика конфиденциальности",
      description: "Обработка персональных данных",
      icon: FileCheck,
      file: "https://drive.google.com/file/d/1bexaDHb9ndmQnQCvsjU4-kc9IrfrKGRA/view?usp=drive_link",
    },
  ]

  const reports = [
    {
      name: "Отчет МКД за 2021 - ул. Курортная, 53",
      url: "https://drive.google.com/file/d/1mziqt5Zp1n63SczIjCV-_KVd5jF4-Wcp/view?usp=drive_link",
      year: "2021",
      address: "ул. Курортная, 53",
    },
    {
      name: "Отчет МКД за 2022 - ул. Курортная, 53",
      url: "https://drive.google.com/file/d/1-FZIfyOZG34x_PXz3Cjgzc75LP01yVEw/view?usp=drive_link",
      year: "2022",
      address: "ул. Курортная, 53",
    },
    {
      name: "Отчет МКД за 2023 - ул. Курортная, 53",
      url: "https://drive.google.com/file/d/1uZks-Ntp_ga5vQJu11jF_4UBBNxdrzLM/view?usp=drive_link",
      year: "2023",
      address: "ул. Курортная, 53",
    },
    {
      name: "Отчет МКД за 2023 - ул. Авторемонтная, 27А",
      url: "https://drive.google.com/file/d/1MjVDjaw85UB-wMIFUX6p6PxjoS-6DhYd/view?usp=drive_link",
      year: "2023",
      address: "ул. Авторемонтная, 27А",
    },
    {
      name: "Отчет МКД за 2023 - ул. Авторемонтная, 27",
      url: "https://drive.google.com/file/d/1XOXfEZadXOFewx9g8JCA1D6qtbYMSXpG/view?usp=drive_link",
      year: "2023",
      address: "ул. Авторемонтная, 27",
    },
    {
      name: "Отчет МКД за 2023 - ул. Институтская, 6",
      url: "https://drive.google.com/file/d/10qzlfKrb4L8aK3UPK-S_22iHUk5tz3IZ/view?usp=drive_link",
      year: "2023",
      address: "ул. Институтская, 6",
    },
    {
      name: "Отчет МКД за 2024 - ул. Курортная, 53",
      url: "https://drive.google.com/file/d/1aRQC0JtEST7kxn3ilSPqil07h9lpdl92/view?usp=drive_link",
      year: "2024",
      address: "ул. Курортная, 53",
    },
    {
      name: "Отчет МКД за 2024 - ул. Авторемонтная, 27А",
      url: "https://drive.google.com/file/d/1TwUejKZ6at-1Whdud_DixbQIHeFLI5wL/view?usp=drive_link",
      year: "2024",
      address: "ул. Авторемонтная, 27А",
    },
    {
      name: "Отчет МКД за 2024 - ул. Авторемонтная, 27",
      url: "https://drive.google.com/file/d/16dTplI6ASfCeY_LlW6aVH9ZIhIrjNM2q/view?usp=drive_link",
      year: "2024",
      address: "ул. Авторемонтная, 27",
    },
    {
      name: "Отчет МКД за 2024 - ул. Институтская, 6",
      url: "https://drive.google.com/file/d/1JuXEm1rrAkIhGHKzGY1WeBcSh7SQa2KC/view?usp=drive_link",
      year: "2024",
      address: "ул. Институтская, 6",
    },
    {
      name: "Отчет МКД за 2024 - ул. Харьковская, 83",
      url: "https://drive.google.com/file/d/19cnh3PMegO5G9nDfm5OW8ELDvMRC-83p/view?usp=drive_link",
      year: "2024",
      address: "ул. Харьковская, 83",
    },
  ]

  const regulations = [
    {
      title: "Жилищный кодекс РФ",
      description: "Основной нормативный акт, регулирующий жилищные отношения",
      icon: FileArchive,
      file: "http://www.consultant.ru/document/cons_doc_LAW_51057/",
    },
    {
      title: "Постановление Правительства РФ №354",
      description: "О предоставлении коммунальных услуг собственникам и пользователям помещений",
      icon: FileText,
      file: "http://www.consultant.ru/document/cons_doc_LAW_114247/",
    },
    {
      title: "Постановление Правительства РФ №491",
      description: "Об утверждении Правил содержания общего имущества в многоквартирном доме",
      icon: FileText,
      file: "http://www.consultant.ru/document/cons_doc_LAW_62293/",
    },
  ]

  const ozpPlans = [
    {
      name: "План подготовки к ОЗП 2025-2026 - ул. Курортная, 53",
      url: "https://drive.google.com/file/d/1wggUPwIcV39yja2SiyhvDnTTPdTIcqfQ/view?usp=drive_link",
      year: "2025-2026",
      address: "ул. Курортная, 53",
    },
    {
      name: "План подготовки к ОЗП 2025-2026 - ул. Авторемонтная, 27А",
      url: "https://drive.google.com/file/d/1J9bnCjaDCEFaTLntuvrn-QUuQI277rxL/view?usp=drive_link",
      year: "2025-2026",
      address: "ул. Авторемонтная, 27А",
    },
    {
      name: "План подготовки к ОЗП 2025-2026 - ул. Авторемонтная, 27",
      url: "https://drive.google.com/file/d/1-6VYBpfCc3CYNq_hl6E91wrv0Fj7Ih8s/view?usp=drive_link",
      year: "2025-2026",
      address: "ул. Авторемонтная, 27",
    },
    {
      name: "План подготовки к ОЗП 2025-2026 - ул. Институтская, 6",
      url: "https://drive.google.com/file/d/1wRlQrzPk3KUZh1flJMPO64QvIlhUgmwj/view?usp=drive_link",
      year: "2025-2026",
      address: "ул. Институтская, 6",
    },
    {
      name: "План подготовки к ОЗП 2025-2026 - ул. Харьковская, 83",
      url: "https://drive.google.com/file/d/1L4ksCVpUil4bl_GtdZ5KJc-6-6WV86h2/view?usp=drive_link",
      year: "2025-2026",
      address: "ул. Харьковская, 83",
    },
  ]

  // Получаем уникальные годы и адреса из отчетов
  const years = useMemo(() => {
    const uniqueYears = new Set(reports.map((file) => file.year))
    return Array.from(uniqueYears).sort()
  }, [reports])

  const addresses = useMemo(() => {
    const uniqueAddresses = new Set(reports.map((file) => file.address))
    return Array.from(uniqueAddresses).sort()
  }, [reports])

  // Получаем уникальные годы и адреса из планов ОЗП
  const ozpYears = useMemo(() => {
    const uniqueYears = new Set(ozpPlans.map((file) => file.year))
    return Array.from(uniqueYears).sort()
  }, [ozpPlans])

  const ozpAddresses = useMemo(() => {
    const uniqueAddresses = new Set(ozpPlans.map((file) => file.address))
    return Array.from(uniqueAddresses).sort()
  }, [ozpPlans])

  // Фильтруем отчеты по выбранному году и адресу
  const getFilteredReports = () => {
    return reports.filter((file) => {
      const yearMatch = selectedYear === "all" || file.year === selectedYear
      const addressMatch = selectedAddress === "all" || file.address === selectedAddress
      return yearMatch && addressMatch
    })
  }

  // Фильтруем планы ОЗП по выбранному году и адресу
  const getFilteredOzpPlans = () => {
    return ozpPlans.filter((file) => {
      const yearMatch = selectedOzpYear === "all" || file.year === selectedOzpYear
      const addressMatch = selectedOzpAddress === "all" || file.address === selectedOzpAddress
      return yearMatch && addressMatch
    })
  }

  return (
    <Section background="white">
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold">Документы</h1>
      </motion.div>

      <SubsectionNav section="documents" subsections={subsections} />

      <Subsection id="company-docs">
        <SectionBlock title="Документы компании" align="center">
          <GridLayout columns={{ default: 1, md: 2 }} gap="default">
            {companyDocs.map((doc, index) => (
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

      <Subsection id="reports">
        <SectionBlock title="Годовые отчеты" align="center">
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <h3 className="text-xl font-semibold">Отчеты по многоквартирным домам</h3>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Выберите год" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все годы</SelectItem>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <Select value={selectedAddress} onValueChange={setSelectedAddress}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Выберите адрес" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все адреса</SelectItem>
                    {addresses.map((address) => (
                      <SelectItem key={address} value={address}>
                        {address}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {getFilteredReports().map((file, fileIndex) => (
                  <div key={fileIndex} className="p-4 hover:bg-gray-50">
                    <Link href={file.url} target="_blank" className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-gray-500">{file.address}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        Открыть
                      </Button>
                    </Link>
                  </div>
                ))}

                {getFilteredReports().length === 0 && (
                  <p className="text-muted-foreground text-center py-8">Нет отчетов по выбранным параметрам</p>
                )}
              </div>
            </CardContent>
          </Card>
        </SectionBlock>
      </Subsection>

      <Subsection id="regulations">
        <SectionBlock title="Нормативные документы" align="center">
          <GridLayout columns={{ default: 1, md: 2 }} gap="default">
            {regulations.map((doc, index) => (
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

      <Subsection id="ozp">
        <SectionBlock title="План подготовки к ОЗП" align="center">
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <h3 className="text-xl font-semibold">Планы подготовки к осенне-зимнему периоду</h3>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <Select value={selectedOzpYear} onValueChange={setSelectedOzpYear}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Выберите год" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все годы</SelectItem>
                    {ozpYears.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <Select value={selectedOzpAddress} onValueChange={setSelectedOzpAddress}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Выберите адрес" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все адреса</SelectItem>
                    {ozpAddresses.map((address) => (
                      <SelectItem key={address} value={address}>
                        {address}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {getFilteredOzpPlans().map((file, fileIndex) => (
                  <div key={fileIndex} className="p-4 hover:bg-gray-50">
                    <Link href={file.url} target="_blank" className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-gray-500">{file.address}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        Открыть
                      </Button>
                    </Link>
                  </div>
                ))}

                {getFilteredOzpPlans().length === 0 && (
                  <p className="text-muted-foreground text-center py-8">Нет планов по выбранным параметрам</p>
                )}
              </div>
            </CardContent>
          </Card>
        </SectionBlock>
      </Subsection>
    </Section>
  )
}
