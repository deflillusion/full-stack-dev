def add_ingredient(ingredient_prices, name, price):
    """
    Добавляет новый ингредиент в словарь.
    :param ingredient_prices: Словарь с ингредиентами и их ценами.
    :param name: Название нового ингредиента (строка).
    :param price: Цена нового ингредиента (число).
    :return: None
    """
    if name in ingredient_prices:
        print(
            f"Ингредиент '{name}' уже существует с ценой {ingredient_prices[name]}.")
    else:
        ingredient_prices[name] = price
        print(f"Ингредиент '{name}' добавлен с ценой {price}.")


def calculate_recipe_cost(recipe_name, recipes, ingredient_prices):
    """
    Рассчитывает общую стоимость рецепта.
    :param recipe_name: Название рецепта.
    :param recipes: Словарь с рецептами.
    :param ingredient_prices: Словарь с ценами ингредиентов.
    :return: Итоговая стоимость рецепта.
    """
    if recipe_name not in recipes:
        print(f"Рецепт '{recipe_name}' не найден.")
        return

    ingredients = recipes[recipe_name]
    total_cost = 0

    print(f"Ингредиенты для рецепта '{recipe_name}':")
    for ingredient in ingredients:
        price = ingredient_prices.get(ingredient, 0)
        print(f"- {ingredient}: {price} тенге")
        total_cost += price

    if total_cost > 30000:
        discount = total_cost * 0.1
        total_cost -= discount
        print(f"Применена скидка 10%: -{discount} тенге")

    print(f"Итоговая стоимость рецепта: {total_cost} тенге")
    return total_cost


def add_recipe(recipes, ingredient_prices):
    """
    Добавляет новый рецепт в словарь.
    :param recipes: Словарь с рецептами.
    :param ingredient_prices: Словарь с ценами ингредиентов.
    :return: None
    """
    recipe_name = input("Введите название нового рецепта: ").strip()
    ingredients = input(
        "Введите ингредиенты через запятую: ").strip().split(',')
    ingredients = [ingredient.strip() for ingredient in ingredients]

    for ingredient in ingredients:
        if ingredient not in ingredient_prices:
            try:
                price = int(
                    input(f"Введите цену для нового ингредиента '{ingredient}': "))
                add_ingredient(ingredient_prices, ingredient, price)
            except ValueError:
                print("Цена должна быть числом. Пропуск ингредиента.")

    recipes[recipe_name] = ingredients
    print(f"Рецепт '{recipe_name}' добавлен.")


# Пример предустановленных данных
recipes = {
    "Pasta": ["Tomatoes", "Cheese", "Spaghetti"],
    "Salad": ["Cucumbers", "Tomatoes", "Lettuce"]
}

ingredient_prices = {
    "Tomatoes": 500,
    "Cheese": 2000,
    "Spaghetti": 1500,
    "Cucumbers": 300,
    "Lettuce": 700
}

# Основной цикл программы
if __name__ == "__main__":
    while True:
        print("\n--- Меню ---")
        print("1. Показать доступные рецепты и ингредиенты")
        print("2. Добавить новый рецепт")
        print("3. Рассчитать стоимость рецепта")
        print("4. Выход")

        choice = input("Выберите действие: ").strip()

        if choice == "1":
            print("\n--- Доступные рецепты ---")
            for recipe, ingredients in recipes.items():
                print(f"{recipe}: {', '.join(ingredients)}")

            print("\n--- Доступные ингредиенты ---")
            for ingredient, price in ingredient_prices.items():
                print(f"{ingredient}: {price} тенге")

        elif choice == "2":
            add_recipe(recipes, ingredient_prices)

        elif choice == "3":
            recipe_name = input("Введите название рецепта: ").strip()
            calculate_recipe_cost(recipe_name, recipes, ingredient_prices)

        elif choice == "4":
            print("Выход из программы.")
            break

        else:
            print("Неверный выбор. Попробуйте снова.")
