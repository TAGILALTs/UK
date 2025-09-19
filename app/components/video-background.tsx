"use client"

import { useEffect, useRef, useState } from "react"

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.addEventListener("loadeddata", () => {
        setIsLoaded(true)
      })
    }
  }, [])

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Fallback background */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Video element */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src="/videos/hero-background.mp4" type="video/mp4" />
        <source src="/videos/hero-background.webm" type="video/webm" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />
    </div>
  )
}
