"use client"

import { useState } from "react"
import { Home, List, BarChart } from "lucide-react"

interface TabNavigationProps {
  onTabChange: (tab: string) => void
}

export function TabNavigation({ onTabChange }: TabNavigationProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    onTabChange(value)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16">
      <button
        onClick={() => handleTabChange("overview")}
        className={`flex flex-col items-center justify-center w-full h-full ${activeTab === "overview" ? "text-primary" : "text-gray-500"
          }`}
      >
        <Home size={24} />
        <span className="text-xs mt-1">Обзор</span>
      </button>
      <button
        onClick={() => handleTabChange("transactions")}
        className={`flex flex-col items-center justify-center w-full h-full ${activeTab === "transactions" ? "text-primary" : "text-gray-500"
          }`}
      >
        <List size={24} />
        <span className="text-xs mt-1">Транзакции</span>
      </button>
      <button
        onClick={() => handleTabChange("chart")}
        className={`flex flex-col items-center justify-center w-full h-full ${activeTab === "chart" ? "text-primary" : "text-gray-500"
          }`}
      >
        <BarChart size={24} />
        <span className="text-xs mt-1">График</span>
      </button>
    </div>
  )
}

