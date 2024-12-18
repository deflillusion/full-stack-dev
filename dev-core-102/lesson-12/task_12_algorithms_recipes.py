# Словарь с рецептами и их стоимостью
recipes = {
    "Плов": 1500,
    "Борщ": 1200,
    "Салат Цезарь": 2000,
    "Шашлык": 3000,
    "Суп Харчо": 1800,
    "Окрошка": 1000,
    "Гуляш": 2500,
    "Паста Карбонара": 2300
}

# Функция для отображения доступных рецептов


def display_recipes(recipes):
    print("\nДоступные рецепты:")
    for name, cost in recipes.items():
        print(f"{name}: {cost} тенге")

# Реализация пузырьковой сортировки


def bubble_sort(recipes):
    sorted_recipes = list(recipes.items())
    n = len(sorted_recipes)
    for i in range(n):
        for j in range(0, n-i-1):
            if sorted_recipes[j][1] > sorted_recipes[j+1][1]:
                sorted_recipes[j], sorted_recipes[j +
                                                  1] = sorted_recipes[j+1], sorted_recipes[j]
    return dict(sorted_recipes)

# Реализация бинарного поиска


def binary_search(sorted_recipes, target_cost):
    recipes_list = list(sorted_recipes.items())
    low, high = 0, len(recipes_list) - 1

    while low <= high:
        mid = (low + high) // 2
        name, cost = recipes_list[mid]

        if cost == target_cost:
            return name, cost
        elif cost < target_cost:
            low = mid + 1
        else:
            high = mid - 1

    return None

# Реализация жадного алгоритма


def greedy_selection(recipes, budget):
    sorted_recipes = bubble_sort(recipes)
    selected_recipes = []
    total_cost = 0

    for name, cost in sorted_recipes.items():
        if total_cost + cost <= budget:
            selected_recipes.append((name, cost))
            total_cost += cost

    return selected_recipes, total_cost

# Основная программа


def main():
    while True:
        print("\nМеню:")
        print("1. Показать доступные рецепты")
        print("2. Сортировать рецепты по стоимости")
        print("3. Найти рецепт по стоимости")
        print("4. Выбрать рецепты в рамках бюджета")
        print("5. Выйти")

        choice = input("\nВведите номер действия: ")

        if choice == "1":
            display_recipes(recipes)
        elif choice == "2":
            selected_names = input(
                "\nВведите названия рецептов через запятую, которые хотите приготовить: ").split(', ')
            selected_recipes = {name: recipes[name]
                                for name in selected_names if name in recipes}
            sorted_recipes = bubble_sort(selected_recipes)
            print("\nРецепты, отсортированные по стоимости:")
            for name, cost in sorted_recipes.items():
                print(f"{name}: {cost} тенге")
        elif choice == "3":
            target_cost = int(
                input("\nВведите стоимость для поиска рецепта: "))
            sorted_recipes = bubble_sort(recipes)
            result = binary_search(sorted_recipes, target_cost)
            if result:
                print(
                    f"Найден рецепт: {result[0]} с стоимостью {result[1]} тенге")
            else:
                print("Рецепт с указанной стоимостью не найден.")
        elif choice == "4":
            budget = int(input("\nВведите ваш бюджет (тенге): "))
            selected_recipes, total_cost = greedy_selection(recipes, budget)
            print(f"\nРецепты в рамках бюджета {budget} тенге:")
            for name, cost in selected_recipes:
                print(f"{name}: {cost} тенге")
            print(f"Итоговая стоимость: {total_cost} тенге")
        elif choice == "5":
            print("Выход из программы.")
            break
        else:
            print("Неверный выбор. Попробуйте снова.")


if __name__ == "__main__":
    main()
