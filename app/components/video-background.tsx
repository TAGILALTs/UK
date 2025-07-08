"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import "../globals.css"

interface WeatherData {
  weather: { id: number; description: string }[]
  main: { temp: number; humidity: number }
  wind: { speed: number }
}

const VideoBackground = () => {
  const [isNight, setIsNight] = useState(false)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isRaining, setIsRaining] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  useEffect(() => {
    const fetchWeather = async () => {
      const API_KEY = "0cc56ad5396c8e5d9bda3882acc0395d"
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Tyumen,ru&units=metric&appid=${API_KEY}&lang=ru`
        )
        
        if (!response.ok) throw new Error("Сеть не отвечает")
        const data = await response.json()
        setWeather(data)
        setIsRaining(data.weather[0].id >= 200 && data.weather[0].id < 600)
      } catch (error) {
        console.error("Ошибка при получении данных о погоде:", error)
      } finally {
        setLoading(false)
      }
    }

    const checkTime = () => {
      const currentHour = new Date().getHours()
      setIsNight(currentHour < 6 || currentHour >= 18)
    }

    checkTime()
    fetchWeather()

    const timeInterval = setInterval(checkTime, 60000)
    const weatherInterval = setInterval(fetchWeather, 600000)

    return () => {
      clearInterval(timeInterval)
      clearInterval(weatherInterval)
    }
  }, [])

  const getWeatherIcon = (weatherCode: number | undefined) => {
    if (!weatherCode) return "❓"
    if (weatherCode >= 200 && weatherCode < 300) return "⛈️"
    if (weatherCode >= 300 && weatherCode < 500) return "🌧️"
    if (weatherCode >= 500 && weatherCode < 600) return "🌧️"
    if (weatherCode >= 600 && weatherCode < 700) return "❄️"
    if (weatherCode >= 700 && weatherCode < 800) return "🌫️"
    if (weatherCode === 800) return isNight ? "🌙" : "☀️"
    if (weatherCode > 800) return "☁️"
    return "❓"
  }

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden flex flex-col">
      <div
        className={`absolute inset-x-0 ${isMobile ? "h-[65vh]" : "h-[158vh]"} bg-cover z-10 overflow-hidden`}
        style={{
          bottom: isMobile ? '-50px' : '-710px',
          backgroundImage: isNight
            ? "url('https://i.imgur.com/ecXG0Li.png')"
            : "url('https://i.imgur.com/Y6Cmyb4.png')",
          filter: "brightness(50%)",
          backgroundSize: "cover",
          backgroundPosition: "bottom center",
          transform: `scale(${isMobile ? 4 : 2})`,
        }}
      />
      <div className={`relative w-full h-full flex-1 ${isNight ? "night" : "day"}`}>
        <motion.div
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 1 }}
          animate={{ opacity: isNight ? 0 : 1 }}
          transition={{ duration: 2 }}
        >
          <div className="w-full h-full bg-gradient-to-b from-blue-300 to-blue-100 z-0">
            <div className="clouds-container">
              <div className="cloud-realistic cloud-1"></div>
              <div className="cloud-realistic cloud-2"></div>
              <div className="cloud-realistic cloud-3"></div>
              <div className="cloud-realistic cloud-4"></div>
            </div>
            <div className="sun"></div>
          </div>
        </motion.div>

        <motion.div
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: isNight ? 1 : 0 }}
          transition={{ duration: 2 }}
        >
          <div className="w-full h-full bg-gradient-to-b from-blue-900 to-purple-900 z-0">
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <div className="stars"></div>
              <div className="twinkling"></div>
              <div className="moon"></div>
            </div>
          </div>
        </motion.div>

        {isRaining && <div className="rain"></div>}

        {/* Условный рендеринг информации о погоде для мобильных устройств */}
        {!isMobile && (
          <div className="absolute bottom-10 left-10 bg-black bg-opacity-50 p-4 rounded-lg text-white z-30">
            {loading ? (
              <>
                <h2 className="text-2xl font-bold mb-2">Тюмень</h2>
                <p className="text-lg">Загрузка погоды...</p>
              </>
            ) : weather ? (
              <>
                <h2 className="text-2xl font-bold mb-2">Тюмень</h2>
                <p className="text-4xl mb-2">
                  {getWeatherIcon(weather.weather[0]?.id)} {Math.round(weather.main?.temp || 0)}°C
                </p>
                <p className="text-lg">{weather.weather[0]?.description || "Загрузка..."}</p>
                <p>Влажность: {weather.main?.humidity || 0}%</p>
                <p>Ветер: {weather.wind?.speed || 0} м/с</p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-2">Тюмень</h2>
                <p className="text-lg">Ошибка загрузки погоды. Попробуйте позже.</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoBackground
