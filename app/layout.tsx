import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export const metadata = {
  title: "Сайт больше не поддерживается - ООО ДЕЛЬТА",
  description: "Данный веб-сайт прекратил свою работу и больше не обновляется",
  keywords: "УК Дельта, ООО Дельта, управляющая компания, Тюмень, закрыт, не поддерживается",
  robots: "noindex, nofollow",
  favicon: "/favicon.ico",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    title: "Сайт больше не поддерживается - ООО ДЕЛЬТА",
    description: "Данный веб-сайт прекратил свою работу и больше не обновляется",
  },
  twitter: {
    card: "summary",
    title: "Сайт больше не поддерживается - ООО ДЕЛЬТА",
    description: "Данный веб-сайт прекратил свою работу и больше не обновляется",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="robots" content="noindex, nofollow" />
        <meta property="og:title" content="Сайт больше не поддерживается - ООО ДЕЛЬТА" />
        <meta property="og:description" content="Данный веб-сайт прекратил свою работу и больше не обновляется" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Сайт больше не поддерживается - ООО ДЕЛЬТА" />
        <meta name="twitter:description" content="Данный веб-сайт прекратил свою работу и больше не обновляется" />
      </head>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  )
}
