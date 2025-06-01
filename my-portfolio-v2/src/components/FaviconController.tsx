"use client"

import { useEffect, useState } from "react"

type FaviconType = "static" | "rotate-slow" | "rotate-fast" | "pulse" | "combo"

const FaviconController = () => {
    const [currentFavicon, setCurrentFavicon] = useState<FaviconType>("rotate-slow")

    const faviconMap: Record<FaviconType, string> = {
        static: "/favicon.svg",
        "rotate-slow": "/favicon-animated.svg",
        "rotate-fast": "/favicon-animated-fast.svg",
        pulse: "/favicon-pulse.svg",
        combo: "/favicon-combo.svg",
    }

    useEffect(() => {
        const favicon = document.getElementById("favicon") as HTMLLinkElement
        if (favicon) {
            favicon.href = faviconMap[currentFavicon]
        }
    }, [currentFavicon])

    // Auto-cycle through different animations every 30 seconds
    useEffect(() => {
        const faviconTypes: FaviconType[] = ["rotate-slow", "pulse", "combo", "rotate-fast"]
        let currentIndex = 0

        const interval = setInterval(() => {
            currentIndex = (currentIndex + 1) % faviconTypes.length
            setCurrentFavicon(faviconTypes[currentIndex])
        }, 30000) // Change every 30 seconds

        return () => clearInterval(interval)
    }, [])

    // Change favicon based on page visibility
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                // When tab is not visible, use a more subtle animation
                setCurrentFavicon("pulse")
            } else {
                // When tab becomes visible, use a more dynamic animation
                setCurrentFavicon("rotate-slow")
            }
        }

        document.addEventListener("visibilitychange", handleVisibilityChange)
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
    }, [])

    // Change favicon on scroll for extra interactivity
    useEffect(() => {
        let scrollTimeout: NodeJS.Timeout

        const handleScroll = () => {
            setCurrentFavicon("rotate-fast")

            clearTimeout(scrollTimeout)
            scrollTimeout = setTimeout(() => {
                setCurrentFavicon("rotate-slow")
            }, 2000)
        }

        window.addEventListener("scroll", handleScroll)
        return () => {
            window.removeEventListener("scroll", handleScroll)
            clearTimeout(scrollTimeout)
        }
    }, [])

    return null // This component doesn't render anything visible
}

export default FaviconController
