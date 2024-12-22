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

echo "Скрипт для создания резервной копии конфигурационных файлов."

# Запрос имени файла от пользователя
read -p "Введите путь к файлу, который нужно сохранить: " file_path

# Проверка существования файла
if [ ! -f "$file_path" ]; then
    echo "Ошибка: Файл $file_path не существует."
    exit 1
fi

# Создание директории для резервного копирования
backup_dir="$HOME/backup_configs_$(date +%Y%m%d)"
mkdir -p "$backup_dir"
check_success "Создание директории $backup_dir"

# Копирование файла
backup_file="$backup_dir/$(basename "$file_path")"
cp "$file_path" "$backup_file"
check_success "Копирование файла в $backup_file"

echo "Файл $file_path успешно сохранён в $backup_file."
