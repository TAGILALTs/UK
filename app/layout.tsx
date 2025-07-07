import type React from "react"
import "./globals.css"
import { Inter, Montserrat } from "next/font/google"
import Header from "./components/header"
import Footer from "./components/footer"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin", "cyrillic"] })
const montserrat = Montserrat({ subsets: ["latin", "cyrillic"] })

export const metadata = {
  title: "Управляющая Компания - ООО Дельта",
  description: "Профессиональное управление многоквартирными домами и коммерческой недвижимостью в Тюмени",
  keywords:
    "УК Дельта, ООО Дельта, управляющая компания, Тюмень, ЖКХ, многоквартирные дома, коммерческая недвижимость, УК ДЕЛЬТА, ООО ДЕЛЬТА, Дельта УК",
  verification: {
    yandex: "6747bc97425ada40",
  },
  favicon: "/favicon.ico",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/favicon-16x16-nYbTvkCL7d5MVEqw6pPNCV9v4AWf8T.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/favicon-32x32-Pc6ZQc4jPujoXIIYOBa63ADBSkIGz3.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/favicon-96x96-wWTP7Gjryyk0Y8JIeoBWvQHwtHnWrH.png",
        sizes: "96x96",
        type: "image/png",
      },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/favicon-57x57-TXOYuawY8m4E3Zq27ClZ0SpSOqqfs9.png",
        sizes: "57x57",
        type: "image/png",
      },
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/favicon-60x60-D5LD9jflCQqaaKqRcfciFud6KAEVMQ.png",
        sizes: "60x60",
        type: "image/png",
      },
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/favicon-72x72-ga8xmswdmACKImL3eEgcwFSTbRS2Tc.png",
        sizes: "72x72",
        type: "image/png",
      },
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/favicon-76x76-NnWINCwd2ygztg2dReRlQLTzjVMWAt.png",
        sizes: "76x76",
        type: "image/png",
      },
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/favicon-114x114-deI0UieHRMxj5Cw5I4gN755tS2POP6.png",
        sizes: "114x114",
        type: "image/png",
      },
    ],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Управляющая Компания - ООО Дельта",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://www.ykdelta.ru/",
    siteName: "Управляющая Компания - ООО Дельта",
    title: "Управляющая Компания - ООО Дельта",
    description: "Профессиональное управление многоквартирными домами и коммерческой недвижимостью в Тюмени",
    images: [
      {
        url: "https://opengraph.b-cdn.net/production/images/3d8cbd31-cf34-4562-b63f-cfc38f42b3d1.png?token=JEN9_tG6S4byDA0ZVEQg7OST4RgSIeIAqh1w0nZg7Ug&height=848&width=1200&expires=33272527550",
        width: 1200,
        height: 848,
        alt: "Управляющая Компания - ООО Дельта",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@ykdelta",
    title: "Управляющая Компания - ООО Дельта",
    description: "Профессиональное управление многоквартирными домами и коммерческой недвижимостью в Тюмени",
    images: [
      "https://opengraph.b-cdn.net/production/images/3d8cbd31-cf34-4562-b63f-cfc38f42b3d1.png?token=JEN9_tG6S4byDA0ZVEQg7OST4RgSIeIAqh1w0nZg7Ug&height=848&width=1200&expires=33272527550",
    ],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta property="og:title" content="Управляющая Компания - ООО Дельта" />
        <meta
          property="og:description"
          content="Профессиональное управление многоквартирными домами и коммерческой недвижимостью в Тюмени"
        />
        <meta
          property="og:image"
          content="https://opengraph.b-cdn.net/production/images/3d8cbd31-cf34-4562-b63f-cfc38f42b3d1.png?token=JEN9_tG6S4byDA0ZVEQg7OST4RgSIeIAqh1w0nZg7Ug&height=848&width=1200&expires=33272527550"
        />
        <meta property="og:url" content="https://www.ykdelta.ru/" />
        <meta property="vk:title" content="Управляющая Компания - ООО Дельта" />
        <meta
          property="vk:description"
          content="Профессиональное управление многоквартирными домами и коммерческой недвижимостью в Тюмени"
        />
        <meta
          property="vk:image"
          content="https://opengraph.b-cdn.net/production/images/3d8cbd31-cf34-4562-b63f-cfc38f42b3d1.png?token=JEN9_tG6S4byDA0ZVEQg7OST4RgSIeIAqh1w0nZg7Ug&height=848&width=1200&expires=33272527550"
        />
        <meta property="vk:url" content="https://www.ykdelta.ru/" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "УК Дельта",
            "alternateName": ["ООО Дельта", "Управляющая Компания Дельта"],
            "url": "https://www.ykdelta.ru/",
            "logo": "https://www.ykdelta.ru/logo.png",
            "description": "Профессиональное управление многоквартирными домами и коммерческой недвижимостью в Тюмени",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "ул. Институтская, д. 6/3",
              "addressLocality": "Тюмень",
              "postalCode": "625000",
              "addressCountry": "RU"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+7-3452-51-77-07",
              "contactType": "customer service"
            }
          }
        `,
          }}
        />
      </head>
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-16">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
