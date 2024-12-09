def calculate_discount():
    print("Введите данные о продуктах. Для завершения введите 'стоп'.")
    products = []

    while True:
        try:
            user_input = input("Введите цену продукта: ").strip()
            if user_input.lower() == "стоп":
                break
            price = float(user_input)
            if price < 0:
                print("Цена не может быть отрицательной. Попробуйте снова.")
                continue
            products.append(price)
        except ValueError:
            print("Пожалуйста, введите корректное число или 'стоп'.")

    if not products:
        print("Список продуктов пуст. Завершение программы.")
        return

    discounted_products = list(
        map(lambda x: x * 0.9 if x > 100 else x, products))
    discounted_items = list(filter(lambda x: x > 100, products))
    total_sum = sum(discounted_products)

    print("\nРезультаты:")
    print(f"Изначальные цены продуктов: {products}")
    print(
        f"Продукты, попавшие под скидку (стоимость > 100): {discounted_items}")
    print(f"Цены с учетом скидок: {discounted_products}")
    print(f"Итоговая сумма покупок: {total_sum:.2f}")


def main_menu():
    while True:
        print("\nВыберите действие:")
        print("1. Рассчитать скидку")
        print("2. Выйти")
        choice = input("Введите номер действия: ")

        if choice == "1":
            calculate_discount()
        elif choice == "2":
            print("Программа завершена.")
            break
        else:
            print("Неверный выбор. Попробуйте снова.")


if __name__ == "__main__":
    main_menu()
