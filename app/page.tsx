"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, Clock, Mail, Phone } from "lucide-react"

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
              <AlertTriangle className="w-12 h-12 text-white" />
            </div>
            <div className="absolute inset-0 w-24 h-24 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-ping opacity-20"></div>
          </div>
        </div>

        {/* Main heading */}
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent mb-6 animate-fade-in">
          Сайт больше не поддерживается
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-fade-in-delay-1">
          Данный веб-сайт прекратил свою работу
        </p>

        {/* Description */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8 border border-white/20 shadow-2xl animate-fade-in-delay-2">
          <div className="flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-gray-300 mr-2" />
            <span className="text-gray-300 font-medium">Статус: Не активен</span>
          </div>
          <p className="text-gray-200 leading-relaxed">
            Мы благодарим всех пользователей за время, проведенное на нашем сайте. К сожалению, поддержка данного
            ресурса была прекращена, и он больше не обновляется.
          </p>
        </div>

        {/* Contact info */}
        <div className="grid md:grid-cols-2 gap-4 animate-fade-in-delay-3">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center justify-center mb-3">
              <Phone className="w-5 h-5 text-blue-400 mr-2" />
              <span className="text-gray-300 font-medium">Телефон</span>
            </div>
            <p className="text-white font-mono">+7 (3452) 51-77-07</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center justify-center mb-3">
              <Mail className="w-5 h-5 text-green-400 mr-2" />
              <span className="text-gray-300 font-medium">Адрес</span>
            </div>
            <p className="text-white">ул. Институтская, 6/3</p>
          </div>
        </div>

        {/* Footer text */}
        <p className="text-gray-400 text-sm mt-8 animate-fade-in-delay-4">Спасибо за понимание • ООО "ДЕЛЬТА"</p>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-fade-in-delay-1 {
          animation: fade-in 1s ease-out 0.2s both;
        }

        .animate-fade-in-delay-2 {
          animation: fade-in 1s ease-out 0.4s both;
        }

        .animate-fade-in-delay-3 {
          animation: fade-in 1s ease-out 0.6s both;
        }

        .animate-fade-in-delay-4 {
          animation: fade-in 1s ease-out 0.8s both;
        }
      `}</style>
    </div>
  )
}
