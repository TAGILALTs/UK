"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, MapPin, Globe, AlertCircle, Store, Building, Users } from "lucide-react"
import Link from "next/link"
import { Section } from "../components/ui/section"
import { SectionBlock } from "../components/ui/section-block"
import { GridLayout } from "../components/ui/grid-layout"
import { SubsectionNav, type SubsectionItem } from "../components/ui/subsection-nav"
import { Subsection } from "../components/ui/subsection"

export default function UsefulPhones() {
  const subsections: SubsectionItem[] = [
    { id: "emergency", title: "Экстренные службы" },
    { id: "utilities", title: "Коммунальные службы" },
    { id: "government", title: "Государственные органы" },
    { id: "social", title: "Социальные службы" },
  ]

  const emergencyNumbers = [
    {
      organization: "УМВД – 02 (дежурный)",
      phone: "+7 (3452) 79‒30‒23",
      address: "625000 г. Тюмень; ул. Водопроводная, 38, Володарского, 36",
      website: "72.мвд.рф",
    },
    {
      organization: "УФСБ",
      phone: "8 (3452)468-945",
      address: "Россия, Тюмень, Советская улица, 40",
      website: "www.fsb.ru",
    },
    {
      organization: "ГУ МЧС – 01",
      phone: "+7 (3452) 59‒05‒64",
      address: "Максима Горького, 72 Центральный округ, Тюмень, 625048",
      website: "72.mchs.gov.ru",
    },
  ]

  const utilityNumbers = [
    {
      organization: "ОАО Триц",
      phone: "+7(3452)399-399",
      address: "625000, г.Тюмень, ул.Первомайская, д.40",
      website: "www.itpc.ru",
    },
    {
      organization: 'ООО "Газпром межрегионгаз Север"',
      phone: "+7 (3452) 63‒17‒00",
      address: "Россия, Тюмень, улица Энергетиков, 165",
      website: "sevrg.ru",
    },
    {
      organization: 'ООО "Тюмень Водоканал"',
      phone: "+7(3452) 540-940",
      address: "Россия, Тюмень, улица 30 лет Победы, 38с10",
      website: "www.vodokanal.info",
    },
    {
      organization: 'АО "Энергосбытовая компания Восток"',
      phone: "+7(3452)386-501",
      address: "625002, РФ, Тюменская обл., г. Тюмень, ул. Северная, д.32а",
      website: "www.vostok-electra.ru",
    },
    {
      organization: 'АО "Урало-Сибирская теплоэнергетическая компания"',
      phone: "+7 (3452) 38-62-00",
      address: "г. Тюмень, ул. Одесская, 5",
      website: "ao-ustek.ru",
    },
  ]

  const governmentNumbers = [
    {
      organization: "Телефон доверия для детей, подростков и их родителей",
      phone: "8 (800) 200-01-22",
      address: "",
      website: "telefon-doveria.ru",
    },
  ]

  const socialNumbers = [
    {
      organization: "Департамент социальной защиты населения",
      phone: "+7 (3452) 63-67-44",
      address: "Тюмень, ул. Республики, 83а",
      website: "https://soc.admtyumen.ru",
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

  const getIconForSubsection = (subsectionId: string) => {
    switch (subsectionId) {
      case "emergency":
        return AlertCircle
      case "utilities":
        return Store
      case "government":
        return Building
      case "social":
        return Users
      default:
        return Phone
    }
  }

  return (
    <Section background="white">
      <motion.h1
        className="text-4xl font-bold text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Полезные телефоны
      </motion.h1>

      <SubsectionNav section="useful-phones" subsections={subsections} />

      <Subsection id="emergency">
        <SectionBlock title="Экстренные службы" align="center">
          <GridLayout columns={{ default: 1, md: 2, lg: 3 }} gap="default">
            {emergencyNumbers.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      <AlertCircle className="h-4 w-4 mr-2 text-primary" />
                      {item.organization}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-primary" />
                        <p>{item.phone}</p>
                      </div>
                      {item.address && (
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 mr-2 mt-1 text-primary" />
                          <p>{item.address}</p>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-primary" />
                      <Link
                        href={`https://${item.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {item.website}
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </GridLayout>
        </SectionBlock>
      </Subsection>

      <Subsection id="utilities">
        <SectionBlock title="Коммунальные службы" align="center">
          <GridLayout columns={{ default: 1, md: 2, lg: 3 }} gap="default">
            {utilityNumbers.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      <Store className="h-4 w-4 mr-2 text-primary" />
                      {item.organization}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-primary" />
                        <p>{item.phone}</p>
                      </div>
                      {item.address && (
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 mr-2 mt-1 text-primary" />
                          <p>{item.address}</p>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-primary" />
                      <Link
                        href={`https://${item.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {item.website}
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </GridLayout>
        </SectionBlock>
      </Subsection>

      <Subsection id="government">
        <SectionBlock title="Государственные органы" align="center">
          <GridLayout columns={{ default: 1, md: 2, lg: 3 }} gap="default">
            {governmentNumbers.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      <Building className="h-4 w-4 mr-2 text-primary" />
                      {item.organization}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-primary" />
                        <p>{item.phone}</p>
                      </div>
                      {item.address && (
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 mr-2 mt-1 text-primary" />
                          <p>{item.address}</p>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-primary" />
                      <Link
                        href={`https://${item.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {item.website}
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </GridLayout>
        </SectionBlock>
      </Subsection>

      <Subsection id="social">
        <SectionBlock title="Социальные службы" align="center">
          <GridLayout columns={{ default: 1, md: 2, lg: 3 }} gap="default">
            {socialNumbers.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      <Users className="h-4 w-4 mr-2 text-primary" />
                      {item.organization}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-primary" />
                        <p>{item.phone}</p>
                      </div>
                      {item.address && (
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 mr-2 mt-1 text-primary" />
                          <p>{item.address}</p>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-primary" />
                      <Link
                        href={`https://${item.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {item.website}
                      </Link>
                    </div>
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
