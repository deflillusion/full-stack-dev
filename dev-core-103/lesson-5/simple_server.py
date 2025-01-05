import socket
import os


def start_server(port):
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

    try:
        server_socket.bind(("0.0.0.0", port))
        server_socket.listen(5)
        print(f"Сервер запущен на порту {port}. Ожидание подключений...")

        while True:
            client_socket, client_address = server_socket.accept()
            print(f"Подключение от {client_address}")

            message = "HTTP/1.1 200 OK\r\n"
            message += "Content-Type: text/plain\r\n"
            message += "Content-Length: 13\r\n\r\n"
            message += "Hello, World!"

            client_socket.sendall(message.encode("utf-8"))
            client_socket.close()

    except KeyboardInterrupt:
        print("\nСервер остановлен.")
    except Exception as e:
        print(f"Ошибка: {e}")
    finally:
        server_socket.close()


def log_port_check(port, result):
    file_path = "dev-core-103/lesson-5/port_check.txt"
    try:
        with open(file_path, "a", encoding="utf-8") as file:
            file.write(f"Порт {port} проверен. Результат: {result}\n")
        print(f"Результат проверки записан в {file_path}")
    except Exception as e:
        print(f"Ошибка при записи результата: {e}")


def main():
    port = 8080  # По умолчанию используем порт 8080

    while True:
        print("\nМеню:")
        print("1. Запустить сервер на порту 8080")
        print("2. Запустить сервер на порту 8000")
        print("3. Выход")

        choice = input("Выберите действие: ")

        if choice == "1":
            port = 8080
            log_port_check(port, "Сервер запущен")
            start_server(port)
        elif choice == "2":
            port = 8000
            log_port_check(port, "Сервер запущен")
            start_server(port)
        elif choice == "3":
            print("Выход из программы.")
            break
        else:
            print("Некорректный выбор. Пожалуйста, попробуйте снова.")


if __name__ == "__main__":
    main()
