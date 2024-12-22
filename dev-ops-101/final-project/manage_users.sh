#!/bin/bash

# Функция для проверки успешности команды
check_success() {
    if [ $? -eq 0 ]; then
        echo "$1 выполнено успешно."
    else
        echo "Ошибка: $1. Проверьте лог и повторите попытку."
        exit 1
    fi
}

echo "Скрипт для создания нового пользователя и настройки групп."

# Запрос имени пользователя
read -p "Введите имя нового пользователя: " username

# Проверка, существует ли пользователь
if id "$username" &>/dev/null; then
    echo "Пользователь $username уже существует."
    exit 1
fi

# Создание нового пользователя
sudo useradd -m "$username"
check_success "Создание пользователя $username"

# Запрос действия с группой
echo "Что вы хотите сделать?"
echo "1. Создать новую группу."
echo "2. Добавить пользователя в существующую группу."
read -p "Введите ваш выбор (1 или 2): " choice

case $choice in
    1)
        # Создание новой группы
        read -p "Введите имя новой группы: " groupname
        if getent group "$groupname" &>/dev/null; then
            echo "Группа $groupname уже существует."
            exit 1
        fi
        sudo groupadd "$groupname"
        check_success "Создание группы $groupname"

        # Добавление пользователя в новую группу
        sudo usermod -aG "$groupname" "$username"
        check_success "Добавление пользователя $username в группу $groupname"
        ;;
    2)
        # Добавление пользователя в существующую группу
        read -p "Введите имя существующей группы: " groupname
        if ! getent group "$groupname" &>/dev/null; then
            echo "Группа $groupname не существует."
            exit 1
        fi
        sudo usermod -aG "$groupname" "$username"
        check_success "Добавление пользователя $username в группу $groupname"
        ;;
    *)
        echo "Неверный выбор. Завершение работы."
        exit 1
        ;;
esac

echo "Пользователь $username успешно настроен."
