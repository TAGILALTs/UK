"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts"
import { Section } from "../components/ui/section"
import { SectionBlock } from "../components/ui/section-block"
import { GridLayout } from "../components/ui/grid-layout"

// Данные для графиков
const monthlyData = [
  { name: "Янв", value: 400 },
  { name: "Фев", value: 300 },
  { name: "Мар", value: 200 },
  { name: "Апр", value: 278 },
  { name: "Май", value: 189 },
  { name: "Июн", value: 239 },
]

const quarterlyData = [
  { name: "Q1", value: 900 },
  { name: "Q2", value: 700 },
  { name: "Q3", value: 800 },
  { name: "Q4", value: 1000 },
]

const pieData = [
  { name: "Выполнено", value: 85 },
  { name: "В процессе", value: 10 },
  { name: "Отложено", value: 5 },
]

const yearlyData = [
  { name: "2021", выполнено: 780, запланировано: 800 },
  { name: "2022", выполнено: 820, запланировано: 830 },
  { name: "2023", выполнено: 880, запланировано: 870 },
  { name: "2024", выполнено: 910, запланировано: 900 },
]

// Цвета для диаграмм
const COLORS = ["#307e53", "#4ca375", "#6ab892", "#88ccaf"]

export default function Statistics() {
  const [period, setPeriod] = useState("monthly")

  // Выбор данных в зависимости от периода
  const chartData = period === "monthly" ? monthlyData : quarterlyData

  // Кастомный тултип для столбчатой диаграммы
  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border shadow-sm rounded-md">
          <p className="font-medium">{`${label}: ${payload[0].value}`}</p>
        </div>
      )
    }
    return null
  }

  // Кастомный тултип для круговой диаграммы
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border shadow-sm rounded-md">
          <p className="font-medium">{`${payload[0].name}: ${payload[0].value}%`}</p>
        </div>
      )
    }
    return null
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
          <h1 className="text-4xl font-bold">Статистика и отчеты</h1>
        </motion.div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex justify-between items-center flex-wrap gap-4">
              <span>Количество обращений</span>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Выберите период" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Ежемесячно</SelectItem>
                  <SelectItem value="quarterly">Ежеквартально</SelectItem>
                </SelectContent>
              </Select>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[300px] sm:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Legend />
                  <Bar dataKey="value" name="Количество" fill="#307e53" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </Section>

      <Section background="gray">
        <SectionBlock title="Статус заявок">
          <GridLayout columns={{ default: 1, md: 2 }}>
            <Card>
              <CardHeader>
                <CardTitle>Статус заявок</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="w-full h-[300px] sm:h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomPieTooltip />} />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ключевые показатели</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { title: "Среднее время реакции", value: "40 минут" },
                    { title: "Удовлетворенность клиентов", value: "95%" },
                    { title: "Выполнено в срок", value: "98%" },
                  ].map((stat, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-muted-foreground text-xs sm:text-sm">{stat.title}</span>
                      <span className="text-base sm:text-lg md:text-2xl font-bold">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </GridLayout>
        </SectionBlock>
      </Section>

      <Section background="white">
        <SectionBlock title="Годовая динамика" align="center">
          <Card>
            <CardContent className="pt-6">
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={yearlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="выполнено" name="Выполнено" fill="#307e53" />
                    <Bar dataKey="запланировано" name="Запланировано" fill="#6ab892" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </SectionBlock>
      </Section>
    </>
  )
}
