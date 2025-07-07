'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, MapPin, Home, Users, X, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

const houses = [
  {
    address: "ул. Институтская, 6",
    images: [
      "https://i.imgur.com/mDfMlXi.jpeg",
      "https://i.imgur.com/fDUU7Va.jpeg",
    ],
    yearBuilt: "1988",
    floors: "5",
    residentialUnits: "75",
    nonResidentialUnits: "3",
    area: "3747.2",
    residents: "432",
    description: "Это идеальное место для тех, кто ценит спокойствие и комфорт. Дом расположен вдали от шумных улиц, всего в пяти минутах ходьбы от живописного эко-парка Затюменский, где вы сможете наслаждаться прогулками на свежем воздухе и проводить время с семьёй."
  },
  {
    address: "ул. Харьковская, 83",
    images: [
      "https://i.imgur.com/1X9OBV1.jpeg",
      "https://i.imgur.com/UowgvEz.jpeg",
      "https://i.imgur.com/JHxFkPf.jpeg",
    ],
    yearBuilt: "1981",
    floors: "8",
    residentialUnits: "185",
    nonResidentialUnits: "2",
    area: "4820",
    residents: "576",
    description: "Инфраструктура данного района полностью развита, есть все необходимое для комфортного проживания: магазины, ТЦ Магнит, аптеки, школа, детский сад, медицинские учреждения, транспортная развязка отличная, марш. такси №50."
  },
  {
    address: "ул. Курортная, 53",
    images: [
      "https://i.imgur.com/qIatwRw.jpeg",
      "https://i.imgur.com/lIIiWbk.jpeg",
      "https://i.imgur.com/kNBeHp9.jpeg",
    ],
    yearBuilt: "1994",
    floors: "5",
    residentialUnits: "69",
    nonResidentialUnits: "0",
    area: "3325.3",
    residents: "576",
    description: `
      Безопасность вашего проживания обеспечивается системой видео-наблюдения, установленной вокруг дома и у подъездов. Для удобства жильцов предусмотрены большие парковочные места. Во дворе вас ждет детская площадка и уголок со спортивными тренажерами, где вы сможете проводить время с семьей и друзьями.

      Район тихий и спокойный, с удобной транспортной развязкой. В шаговой доступности находятся магазины "Пятерочка" и "Крепыж", а также круглосуточные магазины для ваших нужд. Для семей с детьми рядом расположена школа. Остановка общественного транспорта находится всего в нескольких шагах от дома, что делает передвижение по городу легким и удобным.
    `
  },
  {
    address: "ул. Авторемонтная, 27",
    images: [
      "https://i.imgur.com/raBId0j.png", 
      "https://i.imgur.com/TeKxOOu.jpeg",
    ],
    yearBuilt: "1968",
    floors: "5",
    residentialUnits: "38",
    nonResidentialUnits: "1", 
    area: "1800.8",
    residents: "100",
    description: `
      Расположение и инфраструктура:
      • Дом надежный, теплый
      • Соседи доброжелательные
      • Комфортная инфраструктура
      • Все удобства в пешей доступности
      • Рядом Валберис, Красное Белое, Магнит
      • Есть детский сад и школа
    `
  },
  {
    address: "ул. Авторемонтная, 27а",
    images: [
      "https://i.imgur.com/GjqV9qv.jpeg", 
    ],
    yearBuilt: "1985",
    floors: "5",
    residentialUnits: "42",
    nonResidentialUnits: "1", 
    area: "2442.2",
    residents: "80",
    description: "Школа в 2х остановках от дома. Дом расположен в самом развивающемся районе, рядом автобусные остановки. Поблизости продуктовые магазины, посудный-хозяйственный торговый центр, а также база отдыха 'Спорт Мода' и парк Затюменский, где можно с пользой для здоровья провести выходные или просто прогуляться по лесу и подышать свежим воздухом. Удачное расположение дома во дворе, в зеленой части. Тихие дома района дома обороны, уже давно полюбились жителям и гостям нашего города. Всегда есть парковочные места, что особенно приятно."
  }
]

export default function Houses() {
  const [expandedHouse, setExpandedHouse] = useState<number | null>(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const nextImage = () => {
    if (expandedHouse !== null) {
      setActiveImageIndex((prevIndex) => 
        (prevIndex + 1) % houses[expandedHouse].images.length
      )
    }
  }

  const prevImage = () => {
    if (expandedHouse !== null) {
      setActiveImageIndex((prevIndex) => 
        (prevIndex - 1 + houses[expandedHouse].images.length) % houses[expandedHouse].images.length
      )
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.h1 
        className="text-4xl font-bold text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Дома в управлении
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {houses.map((house, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full flex flex-col">
              <div className="relative h-48">
                {house.images.length > 0 && (
                  <Image
                    src={house.images[0]}
                    alt={house.address}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {house.address}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    <span>Год постройки: {house.yearBuilt}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>Этажей: {house.floors}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span>Жилых помещений: {house.residentialUnits}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span>Нежилых помещений: {house.nonResidentialUnits}</span>
                  </div>
                </div>
                <Button 
                  className="mt-auto" 
                  onClick={() => {
                    setExpandedHouse(expandedHouse === index ? null : index)
                    setActiveImageIndex(0)
                  }}
                >
                  {expandedHouse === index ? 'Свернуть' : 'Подробнее'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {expandedHouse !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">{houses[expandedHouse].address}</h2>
                  <Button variant="ghost" onClick={() => setExpandedHouse(null)}>
                    <X className="h-6 w-6" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="relative h-64 md:h-96">
                      {houses[expandedHouse].images.length > 0 && (
                        <Image
                          src={houses[expandedHouse].images[activeImageIndex]}
                          alt={`${houses[expandedHouse].address} - фото ${activeImageIndex + 1}`}
                          fill
                          className="object-cover rounded-lg"
                        />
                      )}
                      <Button 
                        variant="ghost" 
                        className="absolute left-2 top-1/2 transform -translate-y-1/2"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-6 w-6" />
                      </Button>
                    </div>
                    <div className="flex justify-center space-x-2">
                      {houses[expandedHouse].images.map((_, idx) => (
                        <Button
                          key={idx}
                          variant={idx === activeImageIndex ? "default" : "outline"}
                          size="sm"
                          onClick={() => setActiveImageIndex(idx)}
                        >
                          {idx + 1}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p>{houses[expandedHouse].description}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold">Год постройки</h3>
                        <p>{houses[expandedHouse].yearBuilt}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold">Этажей</h3>
                        <p>{houses[expandedHouse].floors}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold">Жилых помещений</h3>
                        <p>{houses[expandedHouse].residentialUnits}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold">Нежилых помещений</h3>
                        <p>{houses[expandedHouse].nonResidentialUnits}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold">Площадь</h3>
                        <p>{houses[expandedHouse].area} м²</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
