import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ClerkProvider } from "@clerk/clerk-react";
import App from './App.tsx'

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const clerkFrontendApi = import.meta.env.VITE_CLERK_FRONTEND_API;

if (!clerkPubKey) {
  console.error("VITE_CLERK_PUBLISHABLE_KEY не найден в .env");
}

console.log("Clerk publishableKey:", clerkPubKey);
console.log("Clerk frontendApi:", clerkFrontendApi);

createRoot(document.getElementById('root')!).render(
  <ClerkProvider publishableKey={clerkPubKey}>
    <StrictMode>
      <App />
    </StrictMode>
  </ClerkProvider>
)
