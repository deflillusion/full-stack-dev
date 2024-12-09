team_results = []
player_scores = []


def calculate_team_performance(results):
    """
    Рассчитывает итоговый результат команды на основе списка результатов матчей.

    :param results: список строк "победа" или "поражение"
    :return: итоговый результат команды (с учетом бонуса)
    """
    wins = results.count("победа")
    total_matches = len(results)
    if total_matches == 0:
        return 0

    performance = wins / total_matches * 100
    if wins > total_matches / 2:
        performance += 10  # Бонус за успешное выступление

    return round(performance, 2)


def player_performance(scores):
    """
    Рассчитывает средний результат игрока с учетом бонусов за высокую результативность.

    :param scores: список очков, набранных игроком в матчах
    :return: средний результат игрока (с учетом бонусов)
    """
    if not scores:
        return 0

    bonus_scores = [score + 5 if score > 30 else score for score in scores]
    average_score = sum(bonus_scores) / len(bonus_scores)

    return round(average_score, 2)


def final_report(team_performance, player_averages):
    """
    Создает финальный отчет о результатах команды и игроков.

    :param team_performance: итоговый результат команды (в процентах)
    :param player_averages: список средних результатов игроков
    :return: текстовый отчет
    """
    team_status = "Отличная команда" if team_performance >= 70 else "Есть над чем работать"
    player_status = "Высокая результативность" if all(
        avg >= 20 for avg in player_averages) else "Игрокам нужно улучшить игру"

    report = f"""
    Итоговый результат команды: {team_performance}%
    Статус команды: {team_status}
    Средние результаты игроков: {player_averages}
    Статус игроков: {player_status}
    """
    return report


team_performance = calculate_team_performance(team_results)
player_averages = [player_performance(scores) for scores in player_scores]
report = final_report(team_performance, player_averages)

print(report)


def main_menu():

    while True:
        print("\nГлавное меню:")
        print("1. Рассчитать результат команды")
        print("2. Рассчитать средний результат игрока")
        print("3. Составить финальный отчет")
        print("4. Выйти")

        choice = input("Выберите действие (1-4): ").strip()

        if choice == "1":
            results = input(
                "Введите результаты команды через запятую ('победа', 'поражение'): ").strip().split(",")
            results = [result.strip().lower() for result in results]
            team_performance = calculate_team_performance(results)
            print(f"Итоговый результат команды: {team_performance}%")
        elif choice == "2":
            scores = input(
                "Введите очки игрока через запятую: ").strip().split(",")
            try:
                scores = [int(score.strip()) for score in scores]
                average = player_performance(scores)
                print(f"Средний результат игрока: {average}")
            except ValueError:
                print("Некорректный ввод. Попробуйте снова.")
        elif choice == "3":
            try:
                team_results = input(
                    "Введите результаты команды через запятую ('победа', 'поражение'): ").strip().split(",")
                team_results = [result.strip().lower()
                                for result in team_results]
                team_performance = calculate_team_performance(team_results)

                players = input(
                    "Введите результаты игроков  (списки очков через ','): ").strip().split(",")
                player_scores = [
                    [int(score) for score in player.split(",")] for player in players]

                player_averages = [player_performance(
                    scores) for scores in player_scores]
                report = final_report(team_performance, player_averages)
                print(report)
            except ValueError:
                print("Некорректный ввод. Попробуйте снова.")
        elif choice == "4":
            print("Выход из программы. До свидания!")
            break
        else:
            print("Некорректный выбор. Попробуйте снова.")


if __name__ == "__main__":
    main_menu()
