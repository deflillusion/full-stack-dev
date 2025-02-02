export interface User {
  id: number
  username: string
  email: string
}

export interface Transaction {
  id: number
  amount: number
  description: string
  datetime: string
  category_id: number
  account_id: number
}

export interface Account {
  id: number
  name: string
  balance: number
  description?: string
}

export interface Category {
  id: number
  name: string
  description?: string
  transaction_type_id: number
}

export interface State {
  token: string | null
  user: User | null
  transactions: Transaction[]
  accounts: Account[]
  categories: Category[]
}
