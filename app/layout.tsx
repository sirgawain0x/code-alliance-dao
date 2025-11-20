import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Providers } from "@/components/providers"
import { AppKitProvider } from "@/contexts/AppKitProvider"
import { headers } from "next/headers"

export const metadata: Metadata = {
  title: "Code Alliance DAO",
  description: "Decentralized governance for The Code Alliance Incubator",
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
      <body className="font-sans antialiased">
        <AppKitProvider cookies={cookies}>
          <Providers>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </Providers>
        </AppKitProvider>
      </body>
    </html>
  )
}
