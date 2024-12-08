import datetime


def calculate_order_total():
    order_amount = float(input("Введите сумму заказа: "))

    is_loyal_customer = input(
        "Вы участник программы лояльности? (да/нет): ").strip().lower()

    discount_code = input(
        "Введите код скидки (если нет, нажмите Enter): ").strip()
    discount_code_valid = "1111"

    discount = 0
    if is_loyal_customer == "да":
        discount += 0.10

    if order_amount > 1000:
        discount += 0.05

    if discount_code == discount_code_valid:
        discount += 0.05

    discounted_amount = order_amount * (1 - discount)

    current_minute = datetime.datetime.now().minute
    tax = 0.05 if current_minute % 2 != 0 else 0
    total_with_tax = discounted_amount * (1 + tax)

    print("\n--- Итоговый расчёт ---")
    print(f"Сумма заказа: {order_amount:.2f}")
    print(f"Применённая скидка: {discount * 100:.0f}%")
    if tax > 0:
        print(f"Применён налог: {tax * 100:.0f}%")
    else:
        print("Налог не применён (чётная минута).")
    print(f"Итоговая сумма: {total_with_tax:.2f}")


def main_menu():
    while True:
        print("\nВыберите действие:")
        print("1. Рассчитать заказ")
        print("2. Выйти")
        choice = input("Введите номер действия: ")

        if choice == "1":

            calculate_order_total()
        elif choice == "2":
            print("Программа завершена.")
            break
        else:
            print("Неверный выбор. Попробуйте снова.")


if __name__ == "__main__":
    main_menu()
