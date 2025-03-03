import { useState } from "react";
import { sendEmail } from "../utils/email.js"; // Проверь путь!

export default function ContactForm() {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });

    function handleChange(event) {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    }

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            await sendEmail(formData);
            alert("Сообщение отправлено!");
            setFormData({ name: "", email: "", message: "" });
        } catch (error) {
            alert("Ошибка: " + error.message);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mx-auto max-w-lg">
            <div className="flex flex-wrap -m-2">
                <div className="p-2 w-1/2">
                    <label htmlFor="name" className="leading-7 text-sm text-gray-600">Имя</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                        required
                    />
                </div>
                <div className="p-2 w-1/2">
                    <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                        required
                    />
                </div>
                <div className="p-2 w-full">
                    <label htmlFor="message" className="leading-7 text-sm text-gray-600">Текст сообщения</label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                        required
                    ></textarea>
                </div>
                <div className="p-2 w-full">
                    <button type="submit" className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                        Отправить
                    </button>
                </div>
            </div>
        </form>
    );
}
