#!/bin/bash

# Инициализация массива для записи ошибок
errors=()

# Функция для выполнения шагов и записи ошибок
execute_step() {
    step_name=$1
    script_name=$2

    echo "Запуск: $step_name..."
    bash "$script_name"

    if [ $? -ne 0 ]; then
        echo "Ошибка: $step_name."
        errors+=("$step_name")
    else
        echo "$step_name выполнено успешно."
    fi
}

echo "Запуск мастер-скрипта для настройки сервера."

# Шаги мастер-скрипта
execute_step "Обновление и апгрейд пакетов" "update_server.sh"
execute_step "Установка и настройка Nginx" "install_nginx.sh"
execute_step "Создание пользователя и настройка группы" "manage_users.sh"
execute_step "Создание резервной копии конфигурационного файла" "backup_configs.sh"

# Итоговый отчёт
if [ ${#errors[@]} -eq 0 ]; then
    echo "Мастер-скрипт завершён успешно! Все шаги выполнены без ошибок."
else
    echo "Мастер-скрипт завершён с ошибками. Не выполнены шаги:"
    for error in "${errors[@]}"; do
        echo "- $error"
    done
fi
