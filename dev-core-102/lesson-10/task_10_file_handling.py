import json
import os


def save_recipes_to_file(recipes, filename):

    try:
        file_path = os.path.join(os.path.dirname(__file__), filename)
        with open(file_path, 'w', encoding='utf-8') as file:
            json.dump(recipes, file, ensure_ascii=False, indent=4)
        print(f"Рецепты успешно сохранены в файл '{file_path}'.")
    except Exception as e:
        print(f"Ошибка при сохранении рецептов: {e}")


def load_recipes_from_file(filename):

    file_path = os.path.join(os.path.dirname(__file__), filename)
    if not os.path.exists(file_path):
        print(f"Файл '{file_path}' не существует.")
        return {}

    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            recipes = json.load(file)
        print(f"Рецепты успешно загружены из файла '{file_path}'.")
        return recipes
    except Exception as e:
        print(f"Ошибка при загрузке рецептов: {e}")
        return {}


def display_recipes(recipes):

    if not recipes:
        print("Список рецептов пуст.")
    else:
        print("\n--- Текущие рецепты ---")
        for recipe, ingredients in recipes.items():
            print(f"{recipe}: {', '.join(ingredients)}")


if __name__ == "__main__":
    recipes = {}
    filename = "recipes.txt"

    while True:
        print("\n--- Меню ---")
        print("1. Показать рецепты")
        print("2. Добавить новый рецепт")
        print("3. Сохранить рецепты в файл")
        print("4. Загрузить рецепты из файла")
        print("5. Выход")

        choice = input("Выберите действие: ").strip()

        if choice == "1":
            display_recipes(recipes)
        elif choice == "2":
            recipe_name = input("Введите название рецепта: ").strip()
            ingredients = input(
                "Введите ингредиенты через запятую: ").strip().split(',')
            ingredients = [ingredient.strip() for ingredient in ingredients]
            recipes[recipe_name] = ingredients
            print(f"Рецепт '{recipe_name}' добавлен.")
        elif choice == "3":
            save_recipes_to_file(recipes, filename)
        elif choice == "4":
            recipes = load_recipes_from_file(filename)
        elif choice == "5":
            print("Выход из программы.")
            break
        else:
            print("Неверный выбор. Попробуйте снова.")
