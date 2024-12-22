# dev-core-103_lesson3_tcp_client.py
import socket

# Создаем сокет и подключаемся к серверу
client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client_socket.connect(('localhost', 12345))

# Отправляем сообщение серверу
client_socket.send("Hello, server!".encode('utf-8'))

# Закрываем соединение
client_socket.close()
