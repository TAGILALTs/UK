"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

interface VideoBackgroundProps {
  src: string
  poster?: string
  className?: string
  children?: React.ReactNode
}

export default function VideoBackground({ src, poster, className = "", children }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedData = () => {
      setIsLoaded(true)
      video.play().catch((error) => {
        console.warn("Video autoplay failed:", error)
      })
    }

    const handleError = () => {
      setHasError(true)
      console.error("Video failed to load")
    }

    video.addEventListener("loadeddata", handleLoadedData)
    video.addEventListener("error", handleError)

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData)
      video.removeEventListener("error", handleError)
    }
  }, [])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!hasError && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={poster}
          style={{
            filter: isLoaded ? "none" : "blur(10px)",
            transition: "filter 0.3s ease-in-out",
          }}
        >
          <source src={src} type="video/mp4" />
          Ваш браузер не поддерживает видео.
        </video>
      )}

      {hasError && poster && (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${poster})`,
          }}
        />
      )}

      <div className="absolute inset-0 bg-black bg-opacity-40" />

      <div className="relative z-10 h-full flex items-center justify-center">{children}</div>
    </div>
  )
}
