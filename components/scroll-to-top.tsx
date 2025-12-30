"use client"

import React, { useState, useEffect } from "react"
import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false)

    // Show button when page is scrolled down
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true)
            } else {
                setIsVisible(false)
            }
        }

        window.addEventListener("scroll", toggleVisibility)

        return () => window.removeEventListener("scroll", toggleVisibility)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        })
    }

    return (
        <>
            {isVisible && (
                <Button
                    onClick={scrollToTop}
                    size="icon"
                    className="fixed bottom-8 right-8 z-40 h-12 w-12 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110"
                    aria-label="Scroll to top"
                >
                    <ArrowUp className="h-5 w-5" />
                </Button>
            )}
        </>
    )
}
