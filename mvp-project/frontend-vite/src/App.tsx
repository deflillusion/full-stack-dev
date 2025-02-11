import { LoginForm } from "./components/login-form"
import { ThemeProvider } from "@/components/theme-provider"



export default function Home() {
  return (



    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoginForm />
      </div>
    </ThemeProvider>


  )
}
