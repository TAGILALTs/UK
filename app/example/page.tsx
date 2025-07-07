"use client"

import { Section } from "../components/ui/section"
import { SectionBlock } from "../components/ui/section-block"
import { GridLayout } from "../components/ui/grid-layout"
import { ContentBlock } from "../components/ui/content-block"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Info, AlertTriangle, FileText } from "lucide-react"

export default function ExamplePage() {
  return (
    <>
      <Section background="white">
        <SectionBlock
          title="Пример многоблочного раздела"
          subtitle="Здесь показаны различные варианты блоков, которые можно добавить в один раздел"
          align="center"
        >
          <ContentBlock background="gray" className="mb-8">
            <p className="text-center">
              Этот раздел демонстрирует возможность добавления множества блоков с разным содержимым и оформлением. Вы
              можете комбинировать различные типы блоков для создания уникальных разделов.
            </p>
          </ContentBlock>

          <GridLayout columns={{ default: 1, md: 2, lg: 3 }} className="mb-8">
            {[
              { title: "Информационный блок", icon: Info, color: "bg-blue-100" },
              { title: "Предупреждение", icon: AlertTriangle, color: "bg-yellow-100" },
              { title: "Успешное действие", icon: Check, color: "bg-green-100" },
            ].map((item, index) => (
              <ContentBlock key={index} background="white" shadow border>
                <div className="flex items-start">
                  <div className={`p-3 rounded-full ${item.color} mr-4`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600">
                      Пример блока с иконкой и текстом. Можно использовать для различных типов информации.
                    </p>
                  </div>
                </div>
              </ContentBlock>
            ))}
          </GridLayout>

          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Карточка с информацией</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Вы можете использовать компоненты Card внутри разделов для структурирования информации. Это особенно
                  полезно для отображения данных, статистики или других структурированных блоков.
                </p>
              </CardContent>
            </Card>
          </div>

          <GridLayout columns={{ default: 1, md: 2 }} className="mb-8">
            <ContentBlock background="primary">
              <h3 className="text-xl font-semibold mb-4">Блок с акцентным фоном</h3>
              <p>
                Этот блок использует основной цвет в качестве фона, что делает его заметным на странице. Такие блоки
                можно использовать для важной информации или призывов к действию.
              </p>
              <Button variant="secondary" className="mt-4">
                Подробнее
              </Button>
            </ContentBlock>

            <ContentBlock background="secondary">
              <h3 className="text-xl font-semibold mb-4">Блок с дополнительным фоном</h3>
              <p>
                Этот блок использует вторичный цвет в качестве фона. Такие блоки можно использовать для дополнительной
                информации или второстепенных элементов.
              </p>
              <Button variant="outline" className="mt-4">
                Подробнее
              </Button>
            </ContentBlock>
          </GridLayout>

          <ContentBlock background="white" shadow className="mb-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <FileText className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Документация</h3>
                <p className="text-gray-600">
                  Пример блока с иконкой и текстом в одной колонке. Можно использовать для различных типов информации.
                </p>
              </div>
              <div className="md:w-2/3">
                <h3 className="text-xl font-semibold mb-4">Подробное описание</h3>
                <p className="mb-4">
                  Здесь можно разместить более подробную информацию о функциональности или услугах. Такой формат
                  позволяет эффективно использовать пространство на странице.
                </p>
                <p>
                  Вы можете добавить сколько угодно текста, изображений или других элементов в этот блок. Гибкая
                  структура позволяет адаптировать содержимое под ваши потребности.
                </p>
              </div>
            </div>
          </ContentBlock>
        </SectionBlock>
      </Section>

      <Section background="gray">
        <SectionBlock title="Еще один раздел с блоками" align="center">
          <p className="text-center mb-8">
            Вы можете создавать сколько угодно разделов с различными блоками на странице. Каждый раздел может иметь свой
            фон, заголовок и набор блоков.
          </p>

          <GridLayout columns={{ default: 1, md: 3 }}>
            {[1, 2, 3].map((item) => (
              <Card key={item} className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle>Блок {item}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p>Содержимое блока {item}. Здесь может быть любая информация.</p>
                </CardContent>
              </Card>
            ))}
          </GridLayout>
        </SectionBlock>
      </Section>
    </>
  )
}
