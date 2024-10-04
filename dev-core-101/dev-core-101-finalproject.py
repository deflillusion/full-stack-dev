print("Добро пожаловать в калькулятор. Введите первое число, затем выберите математическое действие, затем второе число.")
num1 = int(input("Введите первое число: "))
action = input("Выберите математическое действие +, -, *, /,")
num2 = int(input("Введите второе число: "))

while True:
    if num2 == 0 and action == ("/"):
        print("Ошибка, на 0 делить нельзя")
        break
    if action in ("+", "-", "*", "/"):
        if action == "+":
            print(num1, "+", num2, "=", (num1+num2))
        elif action == "-":
            print(num1, "-", num2, "=", (num1-num2))
        elif action == "*":
            print(num1, "*", num2, "=", (num1*num2))
        elif action == "/":
            print(num1, "/", num2, "=", (num1/num2))
    else:
        print("Неверный знак операции!")
    print('Программа завершена.')
    break