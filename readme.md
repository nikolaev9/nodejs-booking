Система бронирования мест.

Реализовать API для бронирования места на мероприятие. Один пользователь не может забронировать дважды на одно событие.

POST /api/bookings/reserve

{
"event_id": 1,
"user_id": "user123"
}


Таблица events:

- id (SERIAL PRIMARY KEY)
- name (VARCHAR)
- total_seats (INT)

Таблица bookings:

- id (SERIAL PRIMARY KEY)
- event_id (INT, ссылка на events)
- user_id (VARCHAR)
- created_at (TIMESTAMP)

Ваша задача показать свои навыки.
Обычно выполнение тестового задания занимает до трех рабочих дней

После выполнения тестового задания заполните данную форму, и в скором времени я вернусь с обратной связью: https://docs.google.com/forms/d/e/1FAIpQLSfrr0SQXCBLuca5Puk6CyAaLfRSez6W5Erm8FN2DeljXeVTPA/viewform?usp=dialog

Спасибо и удачи!