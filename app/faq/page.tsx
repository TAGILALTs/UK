"use client"

import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"
import { Section } from "../components/ui/section"
import { SectionBlock } from "../components/ui/section-block"
import { SubsectionNav, type SubsectionItem } from "../components/ui/subsection-nav"
import { Subsection } from "../components/ui/subsection"

export default function FAQ() {
  const [openItem, setOpenItem] = useState<string | null>(null)

  const subsections: SubsectionItem[] = [
    { id: "general", title: "Общие вопросы" },
    { id: "services", title: "Услуги и тарифы" },
    { id: "payments", title: "Оплата и счета" },
    { id: "maintenance", title: "Обслуживание и ремонт" },
  ]

  const faqItemsGeneral = [
    {
      question: "Как подать заявку на ремонт?",
      answer:
        "Вы можете подать заявку на ремонт через наш сайт в разделе 'Услуги', по телефону горячей линии или обратившись в офис компании.",
    },
    {
      question: "Как часто проводится уборка в подъездах?",
      answer: (
        <>
          Уборка в подъездах производится согласно минимальному перечню услуг, утвержденному Администрацией города
          Тюмени:
          <ul className="list-disc list-inside mt-2 mb-4">
            <li>Сухая уборка мест общего пользования производится в ежедневном порядке.</li>
            <li>Влажная уборка мест общего пользования производится два раза в месяц.</li>
            <li>Генеральная уборка подъездов производится два раза в год.</li>
          </ul>
        </>
      ),
    },
    {
      question: "Что делать в случае аварийной ситуации?",
      answer:
        "В случае аварийной ситуации немедленно свяжитесь с нашей круглосуточной диспетчерской службой по номеру, указанному на сайте и в подъездах домов.",
    },
  ]

  const faqItemsServices = [
    {
      question: "Какие услуги включены в ежемесячную плату?",
      answer: (
        <>
          В ежемесячную плату по жилищным услугам входит:
          <ul className="list-disc list-inside mt-2 mb-4">
            <li>Уборка мест общего пользования и дворовых территорий</li>
            <li>Обслуживание инженерных сетей и конструктивных элементов</li>
            <li>Проведение дератизации и дезинсекции</li>
            <li>Круглосуточная диспетчеризация</li>
            <li>Обслуживание лифтов и их страхование</li>
            <li>Сбор ртутьсодержащих веществ и их утилизация</li>
            <li>Проведение текущего ремонта</li>
            <li>Механизированная уборка и вывоз снега</li>
            <li>Обрезка деревьев</li>
          </ul>
          С полным перечнем вы можете ознакомиться во вкладке{" "}
          <Link href="/documents" className="text-primary underline">
            "Документы" - "Тарифы и услуги"
          </Link>
          .
        </>
      ),
    },
  ]

  const faqItemsPayments = [
    {
      question: "Как оплатить жилищно-коммунальные услуги?",
      answer: (
        <>
          Жилищно-коммунальные услуги вы можете оплатить в АО "Тюменский расчетно-информационный центр" (АО "ТРИЦ"),
          либо через личный кабинет на сайте АО "ТРИЦ". Также платежи принимаются в почтовых отделениях.
          <br />
          Перейти на сайт АО "ТРИЦ":{" "}
          <Link href="https://www.itpc.ru" className="text-primary underline" target="_blank" rel="noopener noreferrer">
            www.itpc.ru
          </Link>
        </>
      ),
    },
  ]

  const faqItemsMaintenance = [
    {
      question: "Как часто проводится уборка в подъездах?",
      answer: (
        <>
          Уборка в подъездах производится согласно минимальному перечню услуг, утвержденному Администрацией города
          Тюмени:
          <ul className="list-disc list-inside mt-2 mb-4">
            <li>Сухая уборка мест общего пользования производится в ежедневном порядке.</li>
            <li>Влажная уборка мест общего пользования производится два раза в месяц.</li>
            <li>Генеральная уборка подъездов производится два раза в год.</li>
          </ul>
        </>
      ),
    },
  ]

  return (
    <>
      <Section background="white">
        <SectionBlock title="Часто задаваемые вопросы" align="center">
          <SubsectionNav section="faq" subsections={subsections} />

          <Subsection id="general">
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {faqItemsGeneral.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </Subsection>

          <Subsection id="services">
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {faqItemsServices.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </Subsection>

          <Subsection id="payments">
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {faqItemsPayments.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </Subsection>

          <Subsection id="maintenance">
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {faqItemsMaintenance.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </Subsection>
        </SectionBlock>
      </Section>
    </>
  )
}
