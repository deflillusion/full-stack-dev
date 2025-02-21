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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex md:hidden justify-around items-center h-16">
        <button
          onClick={() => handleTabChange("overview")}
          className={`flex flex-col items-center justify-center w-full h-full ${
            activeTab === "overview" ? "text-primary" : "text-gray-500"
          }`}
        >
          <Home size={24} />
          <span className="text-xs mt-1">Обзор</span>
        </button>
        <button
          onClick={() => handleTabChange("transactions")}
          className={`flex flex-col items-center justify-center w-full h-full ${
            activeTab === "transactions" ? "text-primary" : "text-gray-500"
          }`}
        >
          <List size={24} />
          <span className="text-xs mt-1">Транзакции</span>
        </button>
        <button
          onClick={() => handleTabChange("chart")}
          className={`flex flex-col items-center justify-center w-full h-full ${
            activeTab === "chart" ? "text-primary" : "text-gray-500"
          }`}
        >
          <BarChart size={24} />
          <span className="text-xs mt-1">График</span>
        </button>
        <button
          onClick={() => handleTabChange("settings")}
          className={`flex flex-col items-center justify-center w-full h-full ${
            activeTab === "settings" ? "text-primary" : "text-gray-500"
          }`}
        >
          <Settings size={24} />
          <span className="text-xs mt-1">Настройки</span>
        </button>
      </div>

      {/* Десктопная навигация */}
      <div className="hidden md:flex flex-col space-y-2 fixed left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-lg shadow-lg">
        <button
          onClick={() => handleTabChange("overview")}
          className={`p-2 rounded-lg hover:bg-gray-100 ${
            activeTab === "overview" ? "text-primary bg-gray-100" : "text-gray-500"
          }`}
          title="Обзор"
        >
          <Home size={24} />
        </button>
        <button
          onClick={() => handleTabChange("transactions")}
          className={`p-2 rounded-lg hover:bg-gray-100 ${
            activeTab === "transactions" ? "text-primary bg-gray-100" : "text-gray-500"
          }`}
          title="Транзакции"
        >
          <List size={24} />
        </button>
        <button
          onClick={() => handleTabChange("chart")}
          className={`p-2 rounded-lg hover:bg-gray-100 ${
            activeTab === "chart" ? "text-primary bg-gray-100" : "text-gray-500"
          }`}
          title="График"
        >
          <BarChart size={24} />
        </button>
        <button
          onClick={() => handleTabChange("settings")}
          className={`p-2 rounded-lg hover:bg-gray-100 ${
            activeTab === "settings" ? "text-primary bg-gray-100" : "text-gray-500"
          }`}
          title="Настройки"
        >
          <Settings size={24} />
        </button>
      </div>
    </>
  )
}

