"use client"

import { SerwistProvider } from "@serwist/next/react"
import type { ReactNode } from "react"

interface AppSerwistProviderProps {
  children: ReactNode
}

export function AppSerwistProvider({ children }: AppSerwistProviderProps) {
  return (
    <SerwistProvider swUrl="/sw.js" disable={process.env.NODE_ENV === "development"}>
      {children}
    </SerwistProvider>
  )
}
