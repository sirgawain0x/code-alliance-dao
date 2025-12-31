'use client'

import dynamic from "next/dynamic"
import React, { type ReactNode } from "react"

// Dynamically import the provider with SSR disabled
const AppKitProvider = dynamic(
    () => import("@/contexts/AppKitProvider").then((mod) => mod.AppKitProvider),
    {
        ssr: false,
        loading: () => null // Option to add a loading spinner or skeleton here
    }
)

export function AppKitWrapper({
    children,
    cookies
}: {
    children: ReactNode
    cookies: string | null
}) {
    return (
        <AppKitProvider cookies={cookies}>
            {children}
        </AppKitProvider>
    )
}
