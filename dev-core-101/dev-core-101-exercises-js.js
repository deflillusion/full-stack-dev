//Простое число
function isPrime(num) {
    if (num <= 1) {
        return false;
    }
    for (let i = 2; i < num; i++) {
        if (num % i === 0) {
            return false;
        }
    }
    return true;
}

let number = parseInt(prompt("Введите число:"));
console.log(isPrime(number) ? "Число простое" : "Число не является простым");

//Конвертация градусов Цельсия в Фаренгейты 
let num1 = parseInt(prompt("Введите число градуса в Цельсиях"));
console.log(num1 * 1.8 + 32);

//Чётное или нечётное


function isEven(num2) {
    return (num2 % 2 === 0);
}
let num2 = parseInt(prompt("Введите число: "))
console.log(isEven(num2) ? "Число четное" : "Число нечетное");

// Игра "Угадай число"
const randomNum = Math.floor(Math.random() * 10);
console.log("Угадай число от 0 до 9");

const userInput = prompt("Введите число от 0 до 9:");
const num3 = parseInt(userInput);

if (num3 < randomNum) {
    console.log("Загаданное число больше");
} else if (num3 > randomNum) {
    console.log("Загаданное число меньше");
} else {
    console.log("Вы угадали число!");
}
