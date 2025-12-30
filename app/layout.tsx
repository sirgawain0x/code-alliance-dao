import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Providers } from "@/components/providers"
import { AppKitProvider } from "@/contexts/AppKitProvider"
import { ScrollToTop } from "@/components/scroll-to-top"
import { headers } from "next/headers"

export const metadata: Metadata = {
  title: "Creative Organization DAO",
  description: "Decentralized governance for The Creative Organization DAO",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersObj = await headers()
  const cookies = headersObj.get('cookie')

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <AppKitProvider cookies={cookies}>
          <Providers>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <ScrollToTop />
            </ThemeProvider>
          </Providers>
        </AppKitProvider>
      </body>
    </html>
  )
}
