"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Обзор</TabsTrigger>
        <TabsTrigger value="transactions">Транзакции</TabsTrigger>
        <TabsTrigger value="chart">График</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

