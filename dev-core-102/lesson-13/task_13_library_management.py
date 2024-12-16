class Book:
    def __init__(self, title, author, isbn):
        self.title = title
        self.author = author
        self.isbn = isbn
        self.is_available = True

    def display_info(self):
        status = "Доступна" if self.is_available else "Недоступна"
        print(f"{self.title} — {self.author} (ISBN: {self.isbn}) [{status}]")


class Library:
    def __init__(self):
        self.books = []

    def add_book(self, book):
        self.books.append(book)

    def search_book_by_title(self, title):
        return [book for book in self.books if title.lower() in book.title.lower()]

    def list_available_books(self):
        available_books = [book for book in self.books if book.is_available]
        if available_books:
            print("\nДоступные книги в библиотеке:")
            for idx, book in enumerate(available_books, 1):
                print(f"{idx}. {book.title} — {book.author}")
        else:
            print("\nНет доступных книг в библиотеке.")

    def borrow_book(self, title, user):
        for book in self.books:
            if book.title.lower() == title.lower() and book.is_available:
                if len(user.borrowed_books) >= 3:
                    print(f"{user.name} не может взять больше 3 книг одновременно.")
                    return
                book.is_available = False
                user.borrowed_books.append(book)
                print(f"Книга \"{book.title}\" успешно выдана {user.name}.")
                return
        print(f"Книга \"{title}\" недоступна или не найдена.")

    def return_book(self, title):
        for book in self.books:
            if book.title.lower() == title.lower() and not book.is_available:
                book.is_available = True
                print(
                    f"Книга \"{book.title}\" успешно возвращена в библиотеку.")
                return
        print(f"Книга \"{title}\" не найдена среди выданных.")


class User:
    def __init__(self, name, user_id):
        self.name = name
        self.user_id = user_id
        self.borrowed_books = []

    def borrowed_books_info(self):
        if self.borrowed_books:
            print(f"\n{self.name} взял следующие книги:")
            for idx, book in enumerate(self.borrowed_books, 1):
                print(f"{idx}. {book.title} — {book.author}")
        else:
            print(f"\n{self.name} еще не брал книги.")


def main():
    library = Library()
    library.add_book(Book("1984", "Джордж Оруэлл", "123456789"))
    library.add_book(
        Book("Мастер и Маргарита", "Михаил Булгаков", "987654321"))
    library.add_book(Book("Қыз Жібек", "Жүсіпбек Аймауытов", "456789123"))
    library.add_book(Book("Абай жолы", "Мұхтар Әуезов", "321654987"))
    library.add_book(Book("Преступление и наказание",
                     "Федор Достоевский", "654987321"))

    users = []

    while True:
        print("\nМеню:")
        print("1. Показать доступные книги")
        print("2. Найти книгу по названию")
        print("3. Выдать книгу пользователю")
        print("4. Вернуть книгу в библиотеку")
        print("5. Показать взятые книги пользователя")
        print("6. Выход")

        choice = input("\nВыберите действие: ")

        if choice == "1":
            library.list_available_books()
        elif choice == "2":
            title = input("Введите название книги для поиска: ")
            results = library.search_book_by_title(title)
            if results:
                print("\nРезультаты поиска:")
                for book in results:
                    book.display_info()
            else:
                print("Книги с таким названием не найдены.")
        elif choice == "3":
            user_name = input("Введите имя пользователя: ")
            user = next((u for u in users if u.name == user_name), None)
            if not user:
                user = User(user_name, len(users) + 1)
                users.append(user)
            title = input(
                f"{user.name}, введите название книги, которую хотите взять: ")
            library.borrow_book(title, user)
        elif choice == "4":
            title = input("Введите название книги, которую хотите вернуть: ")
            library.return_book(title)
        elif choice == "5":
            user_name = input("Введите имя пользователя: ")
            user = next((u for u in users if u.name == user_name), None)
            if user:
                user.borrowed_books_info()
            else:
                print(f"Пользователь \"{user_name}\" не найден.")
        elif choice == "6":
            print("Выход из программы.")
            break
        else:
            print("Неверный выбор. Попробуйте снова.")


if __name__ == "__main__":
    main()
