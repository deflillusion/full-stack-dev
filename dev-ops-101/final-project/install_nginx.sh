#!/bin/bash

# Скрипт для установки Nginx и проверки его статуса

echo "Начало установки Nginx..."

# Обновление списка пакетов
sudo apt update -y

# Установка Nginx
echo "Установка Nginx..."
sudo apt install nginx -y

# Проверка статуса службы Nginx
echo "Проверка статуса службы Nginx..."
sudo systemctl status nginx --no-pager

# Проверяем, работает ли служба Nginx
if systemctl is-active --quiet nginx; then
    echo "Nginx успешно установлен и работает."
else
    echo "Nginx не запущен. Попытка запуска службы..."
    sudo systemctl start nginx
    if systemctl is-active --quiet nginx; then
        echo "Nginx успешно запущен."
    else
        echo "Не удалось запустить Nginx. Проверьте логи для устранения ошибок."
    fi
fi

# Настройка автозапуска Nginx при старте системы
echo "Настройка автозапуска Nginx..."
sudo systemctl enable nginx

echo "Установка и настройка Nginx завершены."
