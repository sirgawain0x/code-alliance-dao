import type { ReactNode } from "react"
import { hasCapability, type CapabilityKey, type MembershipProfile } from "@/lib/permissions"

interface CanProps {
  profile?: MembershipProfile
  capability: CapabilityKey
  fallback?: ReactNode
  children: ReactNode
}

export function Can({ profile, capability, fallback = null, children }: CanProps) {
  if (!hasCapability({ profile, capability })) return <>{fallback}</>
  return <>{children}</>
}
