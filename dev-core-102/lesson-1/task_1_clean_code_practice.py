from datetime import datetime


loyal_customers = []
products = []


class LoyalCustomer:
    def __init__(self, customer_id, name):
        self.id = customer_id
        self.name = name


class Product:
    def __init__(self, product_id, name, price):
        self.id = product_id
        self.name = name
        self.price = price


def apply_basic_discount(price, discount_rate):
    return price - price * discount_rate


def apply_loyalty_discount(price, loyalty_rate):
    return price - price * loyalty_rate


def apply_basic_tax(price, tax_rate):
    return price + price * tax_rate


def apply_wildcard_tax(price, tax_rate):
    current_minute = datetime.now().minute
    if current_minute % 2 == 0:
        return price
    return price + price * tax_rate


def is_loyal_customer(customer_name_or_id):
    for customer in loyal_customers:
        if customer.id == customer_name_or_id or customer.name == customer_name_or_id:
            return True
    return False


def calculate_final_price(price, discount_rate, tax_rate, customer_name_or_id):
    price_after_discount = apply_basic_discount(price, discount_rate)

    if is_loyal_customer(customer_name_or_id):
        loyalty_rate = 0.05
        price_after_discount = apply_loyalty_discount(
            price_after_discount, loyalty_rate)

    price_after_tax = apply_basic_tax(price_after_discount, tax_rate)

    wildcard_tax_rate = 0.03
    final_price = apply_wildcard_tax(price_after_tax, wildcard_tax_rate)

    return round(final_price, 2)


def add_loyal_customer():
    customer_name = input("Введите имя клиента: ")
    customer_id = len(loyal_customers) + 1
    loyal_customers.append(LoyalCustomer(customer_id, customer_name))
    print(f"Клиент '{customer_name}' добавлен с ID {customer_id}.")


def add_product():
    product_name = input("Введите название товара: ")
    product_price = float(input("Введите цену товара: "))
    product_id = len(products) + 1
    products.append(Product(product_id, product_name, product_price))
    print(
        f"Товар '{product_name}' добавлен с ID {product_id} и ценой {product_price}.")


def process_purchase():
    print("Список доступных товаров:")
    for product in products:
        print(f"{product.id}: {product.name} - {product.price} $.")

    product_id = int(input("Введите ID товара: "))
    selected_product = next((p for p in products if p.id == product_id), None)

    if not selected_product:
        print("Товар не найден.")
        return

    customer_name_or_id = input(
        "Введите имя клиента (или оставьте пустым): ")

    discount_rate = 0.1  # 10% базовой скидки
    loyalty_rate = 0.05  # 5% дополнительной скидки для лояльных клиентов
    tax_rate = 0.2  # 20% базового налога
    wildcard_tax_rate = 0.03  # 3% дополнительного налога

    initial_price = selected_product.price
    print(f"\nЦена товара '{selected_product.name}': {initial_price} $.")

    price_after_basic_discount = apply_basic_discount(
        initial_price, discount_rate)
    basic_discount_amount = initial_price - price_after_basic_discount
    print(f"Базовая скидка (10%): -{basic_discount_amount:.2f} $.")
    print(f"Цена после базовой скидки: {price_after_basic_discount:.2f} $.")

    if is_loyal_customer(customer_name_or_id):
        price_after_loyalty_discount = apply_loyalty_discount(
            price_after_basic_discount, loyalty_rate)
        loyalty_discount_amount = price_after_basic_discount - price_after_loyalty_discount
        print(
            f"Дополнительная скидка для лояльных клиентов (5%): -{loyalty_discount_amount:.2f} $.")
    else:
        price_after_loyalty_discount = price_after_basic_discount
        loyalty_discount_amount = 0.0
        print("Скидка для лояльных клиентов не применяется (клиент не найден).")
    print(f"Цена после всех скидок: {price_after_loyalty_discount:.2f} $.")

    price_after_basic_tax = apply_basic_tax(
        price_after_loyalty_discount, tax_rate)
    basic_tax_amount = price_after_basic_tax - price_after_loyalty_discount
    print(f"Базовый налог (20%): +{basic_tax_amount:.2f} $.")
    print(f"Цена после базового налога: {price_after_basic_tax:.2f} $.")

    current_minute = datetime.now().minute
    if current_minute % 2 == 0:
        final_price = price_after_basic_tax
        wildcard_tax_amount = 0.0
        print(
            f"Дополнительный налог не применяется (текущая минута: {current_minute}, чётная).")
    else:
        final_price = apply_wildcard_tax(
            price_after_basic_tax, wildcard_tax_rate)
        wildcard_tax_amount = final_price - price_after_basic_tax
        print(
            f"Дополнительный налог (3%): +{wildcard_tax_amount:.2f} $. (текущая минута: {current_minute}, нечётная).")

    print("\nРасчёт итоговой цены:")
    print(f"  Цена без скидок и налогов: {initial_price:.2f} $.")
    print(f"  Базовая скидка: -{basic_discount_amount:.2f} $.")
    print(
        f"  Скидка для лояльных клиентов: -{loyalty_discount_amount:.2f} $.")
    print(f"  Базовый налог: +{basic_tax_amount:.2f} $.")
    print(f"  Дополнительный налог: +{wildcard_tax_amount:.2f} $.")
    print(
        f"Итоговая цена товара '{selected_product.name}': {final_price:.2f} $.")


def main_menu():
    while True:
        print("\nВыберите действие:")
        print("1. Добавить лояльного клиента")
        print("2. Добавить товар")
        print("3. Рассчитать итоговую цену")
        print("4. Выйти")
        choice = input("Введите номер действия: ")

        if choice == "1":
            add_loyal_customer()
        elif choice == "2":
            add_product()
        elif choice == "3":
            process_purchase()
        elif choice == "4":
            print("Программа завершена.")
            break
        else:
            print("Неверный выбор. Попробуйте снова.")


if __name__ == "__main__":
    main_menu()
