"use client"

import { useState } from "react"
import { Home, List, BarChart, Settings } from "lucide-react"

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
    <>
      {/* Мобильная навигация */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border flex md:hidden justify-around items-center h-16 z-30">
        <button
          onClick={() => handleTabChange("overview")}
          className={`flex flex-col items-center justify-center w-full h-full ${activeTab === "overview" ? "text-primary" : "text-muted-foreground"
            }`}
        >
          <Home size={24} />
          <span className="text-xs mt-1">Обзор</span>
        </button>
        <button
          onClick={() => handleTabChange("transactions")}
          className={`flex flex-col items-center justify-center w-full h-full ${activeTab === "transactions" ? "text-primary" : "text-muted-foreground"
            }`}
        >
          <List size={24} />
          <span className="text-xs mt-1">Транзакции</span>
        </button>
        <button
          onClick={() => handleTabChange("chart")}
          className={`flex flex-col items-center justify-center w-full h-full ${activeTab === "chart" ? "text-primary" : "text-muted-foreground"
            }`}
        >
          <BarChart size={24} />
          <span className="text-xs mt-1">График</span>
        </button>
        <button
          onClick={() => handleTabChange("settings")}
          className={`flex flex-col items-center justify-center w-full h-full ${activeTab === "settings" ? "text-primary" : "text-muted-foreground"
            }`}
        >
          <Settings size={24} />
          <span className="text-xs mt-1">Настройки</span>
        </button>
      </div>

      {/* Десктопная навигация */}
      <div className="hidden md:flex flex-col space-y-2 fixed left-4 top-1/2 transform -translate-y-1/2 bg-background p-2 rounded-lg shadow-lg border border-border">
        <button
          onClick={() => handleTabChange("overview")}
          className={`p-2 rounded-lg hover:bg-accent ${activeTab === "overview" ? "text-primary bg-accent" : "text-muted-foreground"
            }`}
          title="Обзор"
        >
          <Home size={24} />
        </button>
        <button
          onClick={() => handleTabChange("transactions")}
          className={`p-2 rounded-lg hover:bg-accent ${activeTab === "transactions" ? "text-primary bg-accent" : "text-muted-foreground"
            }`}
          title="Транзакции"
        >
          <List size={24} />
        </button>
        <button
          onClick={() => handleTabChange("chart")}
          className={`p-2 rounded-lg hover:bg-accent ${activeTab === "chart" ? "text-primary bg-accent" : "text-muted-foreground"
            }`}
          title="График"
        >
          <BarChart size={24} />
        </button>
        <button
          onClick={() => handleTabChange("settings")}
          className={`p-2 rounded-lg hover:bg-accent ${activeTab === "settings" ? "text-primary bg-accent" : "text-muted-foreground"
            }`}
          title="Настройки"
        >
          <Settings size={24} />
        </button>
      </div>
    </>
  )
}

