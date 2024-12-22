#!/bin/bash
echo "Текущая дата и время: $(date)"
echo "Текущий пользователь: $(whoami)"
echo "Количество файлов в текущей директории: $(ls -1 | wc -l)"
chmod +x system_info.sh
