# dev-core-103_lesson3_tcp_server.py
import socket

# Создаем сокет и связываем его с IP-адресом и портом
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_socket.bind(('localhost', 12345))
server_socket.listen(1)
print("Server is listening on port 12345")

while True:
    # Принимаем входящее соединение
    client_socket, address = server_socket.accept()
    print(f"Connection from {address}")

    # Читаем сообщение от клиента
    message = client_socket.recv(1024).decode('utf-8')
    print(f"Received message: {message}")

    # Закрываем соединение с клиентом
    client_socket.close()
