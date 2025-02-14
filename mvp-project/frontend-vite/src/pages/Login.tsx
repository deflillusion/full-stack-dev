import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/login-form";

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (username === "admin" && password === "123456") {
      onLogin();
      navigate("/expense-tracker");
    } else {
      setError("Неверные учетные данные");
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <form onSubmit={handleSubmit}>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          // ...existing props...
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          // ...existing props...
          />
          {error && <div className="text-red-500">{error}</div>}
          <LoginForm onLogin={onLogin} />
        </form>
      </div>
    </div>
  );
}