import os
import shutil


def print_directory_structure(path, indent=0):
    """
    Рекурсивно выводит структуру папок и файлов.
    :param path: Путь к директории.
    :param indent: Уровень отступа для вывода (для читабельности).
    """
    try:
        items = os.listdir(path)
        for item in items:
            item_path = os.path.join(path, item)
            print(' ' * indent + f"- {item}")
            if os.path.isdir(item_path):
                print_directory_structure(item_path, indent + 4)
    except PermissionError:
        print(' ' * indent + "[Доступ запрещён]")


def search_file(path, filename):
    """
    Ищет файл с указанным именем в директории и поддиректориях.
    :param path: Путь к директории.
    :param filename: Имя искомого файла.
    :return: Полный путь к файлу, если найден, иначе None.
    """
    try:
        for item in os.listdir(path):
            item_path = os.path.join(path, item)
            if os.path.isfile(item_path) and item == filename:
                return item_path
            elif os.path.isdir(item_path):
                result = search_file(item_path, filename)
                if result:
                    return result
    except PermissionError:
        pass
    return None


def calculate_total_size(path):
    """
    Рекурсивно подсчитывает общий размер файлов в директории.
    :param path: Путь к директории.
    :return: Общий размер файлов в байтах.
    """
    total_size = 0
    try:
        for item in os.listdir(path):
            item_path = os.path.join(path, item)
            if os.path.isfile(item_path):
                total_size += os.path.getsize(item_path)
            elif os.path.isdir(item_path):
                total_size += calculate_total_size(item_path)
    except PermissionError:
        pass
    return total_size


def copy_files(src, dest):
    """
    Рекурсивно копирует файлы из одной директории в другую.
    :param src: Путь исходной директории.
    :param dest: Путь целевой директории.
    """
    try:
        if not os.path.exists(dest):
            os.makedirs(dest)

        for item in os.listdir(src):
            src_item = os.path.join(src, item)
            dest_item = os.path.join(dest, item)

            if os.path.isfile(src_item):
                shutil.copy2(src_item, dest_item)
            elif os.path.isdir(src_item):
                copy_files(src_item, dest_item)
    except PermissionError:
        print(f"[Ошибка копирования: {src}]")


# Меню для работы с программой
if __name__ == "__main__":
    while True:
        print("\n--- Меню ---")
        print("1. Показать структуру директории")
        print("2. Найти файл")
        print("3. Подсчитать общий размер файлов")
        print("4. Копировать файлы из одной директории в другую")
        print("5. Выход")

        choice = input("Выберите действие: ")

        if choice == "1":
            path = input("Введите путь к директории: ")
            print("\n--- Структура директории ---")
            print_directory_structure(path)
        elif choice == "2":
            path = input("Введите путь к директории: ")
            filename = input("Введите имя файла для поиска: ")
            print(f"\n--- Поиск файла '{filename}' ---")
            found_file = search_file(path, filename)
            if found_file:
                print(f"Файл найден: {found_file}")
            else:
                print("Файл не найден.")
        elif choice == "3":
            path = input("Введите путь к директории: ")
            print("\n--- Подсчёт размера файлов ---")
            total_size = calculate_total_size(path)
            print(f"Общий размер файлов: {total_size} байт")
        elif choice == "4":
            src_dir = input("Введите путь исходной директории: ")
            dest_dir = input("Введите путь целевой директории: ")
            print("\n--- Копирование файлов ---")
            copy_files(src_dir, dest_dir)
            print("Копирование завершено.")
        elif choice == "5":
            print("Выход из программы.")
            break
        else:
            print("Неверный выбор. Попробуйте снова.")
