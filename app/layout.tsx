import type React from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Providers } from "@/components/providers"
import { AppKitWrapper } from "@/components/appkit-wrapper"
import { ScrollToTop } from "@/components/scroll-to-top"
import { AppSerwistProvider } from "@/components/serwist-provider"
import { createSiteMetadata } from "@/lib/site-metadata"
import { headers } from "next/headers"

export const metadata = createSiteMetadata()

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersObj = await headers()
  const cookies = headersObj.get("cookie")

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#644698" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#644698" media="(prefers-color-scheme: dark)" />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <AppSerwistProvider>
          <AppKitWrapper cookies={cookies}>
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
          </AppKitWrapper>
        </AppSerwistProvider>
      </body>
    </html>
  )
}
