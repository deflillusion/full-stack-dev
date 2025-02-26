import { useState, useEffect } from 'react'
import { transactionTypesApi, TransactionType } from '@/api'

export function useTransactionTypes() {
  const [types, setTypes] = useState<TransactionType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await transactionTypesApi.getAll()
        setTypes(response.data)
      } catch (err) {
        console.error('Ошибка при загрузке типов транзакций:', err)
        setError('Не удалось загрузить типы транзакций')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTypes()
  }, [])

  return { types, isLoading, error }
}