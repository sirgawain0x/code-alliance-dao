"use client"

import { useState } from "react"

import { Skeleton } from "@/components/ui/skeleton"
import { CREATIVE_ORG_LOGO_SRC } from "@/config/constants"
import { cn } from "@/lib/utils"

interface DaoLogoImageProps {
  src?: string | null
  alt: string
  className?: string
  skeletonClassName?: string
  fallbackSrc?: string
}

export function DaoLogoImage({
  src,
  alt,
  className,
  skeletonClassName,
  fallbackSrc = CREATIVE_ORG_LOGO_SRC,
}: DaoLogoImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  const resolvedSrc = src || fallbackSrc
  const displaySrc = hasError ? fallbackSrc : resolvedSrc
  const showSkeleton = !isLoaded

  return (
    <div className={cn("relative flex-shrink-0", className)}>
      {showSkeleton && (
        <Skeleton
          className={cn("absolute inset-0 animate-pulse", skeletonClassName || "rounded-md")}
          aria-hidden
        />
      )}
      <img
        src={displaySrc}
        alt={alt}
        className={cn(
          className,
          "transition-opacity duration-200",
          showSkeleton ? "opacity-0" : "opacity-100",
        )}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          if (!hasError) {
            setHasError(true)
            setIsLoaded(false)
            return
          }
          setIsLoaded(true)
        }}
      />
    </div>
  )
}
