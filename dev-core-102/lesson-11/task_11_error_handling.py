class InputLimitExceededError(Exception):
    def __init__(self, message="Значение не должно превышать 1000."):
        self.message = message
        super().__init__(self.message)


def get_valid_input(prompt, allow_negative=False):
    while True:
        try:
            value = float(input(prompt).strip())
            if value > 1000:
                raise InputLimitExceededError()
            if not allow_negative and value < 0:
                print("Ошибка: значение не может быть отрицательным.")
                continue
            return value
        except InputLimitExceededError as e:
            print(f"Ошибка: {e}")
        except ValueError:
            print("Ошибка: введите числовое значение.")


def main():
    print("Добро пожаловать в систему управления заказами!")

    total_sum = 0
    while True:
        print("\n--- Меню ---")
        print("1. Добавить продукт в заказ")
        print("2. Рассчитать итоговую сумму")
        print("3. Выход")

        choice = input("Выберите действие: ").strip()

        if choice == "1":
            quantity = get_valid_input("Введите количество продуктов: ")
            price = get_valid_input("Введите цену за продукт: ")
            if quantity == 0:
                print("Ошибка: количество продуктов не может быть равно 0.")
                continue
            total_sum += quantity * price
            print(f"Продукт добавлен. Текущая сумма заказа: {total_sum:.2f}")
        elif choice == "2":
            if total_sum == 0:
                print("Ошибка: в заказе нет продуктов.")
            else:
                print(f"Итоговая сумма заказа: {total_sum:.2f}")
        elif choice == "3":
            print("Выход из программы. Спасибо за использование!")
            break
        else:
            print("Ошибка: неверный выбор. Попробуйте снова.")


if __name__ == "__main__":
    main()
