"use client";

import { useState, useEffect } from "react";
import { SignIn, SignUp, useAuth, useUser } from "@clerk/clerk-react";
import { authApi } from "@/api";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const { getToken } = useAuth();
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    console.log("AuthPage: isSignedIn изменился:", isSignedIn);
    console.log("AuthPage: user изменился:", user);

    const fetchToken = async () => {
      try {
        console.log("AuthPage: Получаем токен...");
        // Используем шаблон LongLivedToken для получения токена с длительным сроком действия
        const token = await getToken({ template: "LongLivedToken" });
        console.log("AuthPage: Токен получен:", token ? token.substring(0, 20) + "..." : "Токен отсутствует");

        if (token) {
          localStorage.setItem("clerk_token", token);
          console.log("AuthPage: Токен сохранен в localStorage");
          console.log("AuthPage: Проверка токена в localStorage:", localStorage.getItem("clerk_token") ? "Токен есть" : "Токен отсутствует");

          // Если пользователь вошел, проверяем токен и регистрируем его на бэкенде
          if (isSignedIn && user) {
            console.log("AuthPage: Пользователь вошел, проверяем токен");
            try {
              // Сначала проверяем токен
              const verifyResponse = await authApi.verifyToken();
              console.log("AuthPage: Токен успешно проверен", verifyResponse);

              // Если токен валидный, регистрируем пользователя
              try {
                const registerResponse = await authApi.register();
                console.log("AuthPage: Пользователь успешно зарегистрирован на бэкенде", registerResponse);
              } catch (registerError) {
                console.error("AuthPage: Ошибка при регистрации пользователя на бэкенде:", registerError);
              }
            } catch (verifyError) {
              console.error("AuthPage: Ошибка при проверке токена:", verifyError);
            }
          } else {
            console.log("AuthPage: Пользователь не вошел или данные пользователя отсутствуют");
          }
        }
      } catch (error) {
        console.error("AuthPage: Ошибка получения токена Clerk:", error);
      }
    };

    // Вызываем fetchToken только если пользователь вошел
    if (isSignedIn) {
      fetchToken();
    }
  }, [getToken, isSignedIn, user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">Учет расходов и доходов</h1>

      {isSignUp ? <SignUp /> : <SignIn />}

      <button
        className="mt-4 text-blue-500 hover:underline"
        onClick={() => setIsSignUp(!isSignUp)}
      >
        {isSignUp ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Регистрация"}
      </button>
    </div>
  );
}
