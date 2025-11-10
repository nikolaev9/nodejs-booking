const prisma = require('../prisma');

exports.reserve = async (req, res) => {
    const { event_id, user_id } = req.body;

    if (typeof event_id !== 'number' || !user_id) {
        return res.status(400).json({ error: 'event_id (number) and user_id (string) are required' });
    }

    try {
        // Будем использовать транзакцию и блокировку строки события через FOR UPDATE
        const result = await prisma.$transaction(async (tx) => {
            // 1) Заблокировать строку события, чтобы избежать гонки при подсчёте мест
            const events = await tx.$queryRaw`SELECT * FROM "Event" WHERE id = ${event_id} FOR UPDATE`;
            const eventRow = events[0];
            if (!eventRow) {
                throw { status: 404, message: 'Event not found' };
            }

            // 2) Проверить, не забронировал ли юзер уже (уникальный индекс также защитит, но лучше проверить)
            const existing = await tx.booking.findUnique({
                where: {
                    eventId_userId: {
                        eventId: event_id,
                        userId: user_id
                    }
                }
            });

            if (existing) {
                throw { status: 409, message: 'User already booked this event' };
            }

            // 3) Посчитать текущие брони для события
            const count = await tx.booking.count({
                where: { eventId: event_id }
            });

            if (count >= eventRow.totalSeats) {
                throw { status: 409, message: 'No seats available' };
            }

            // 4) Создать бронь
            const booking = await tx.booking.create({
                data: {
                    eventId: event_id,
                    userId: user_id
                }
            });

            return booking;
        }, { timeout: 60000 });

        return res.status(201).json({ message: 'Booking successful', booking: result });
    } catch (err) {
        if (err && err.status && err.message) {
            return res.status(err.status).json({ error: err.message });
        }
        
        const isUniqueConstraint = err && err.code === 'P2002'; // Prisma unique constraint error
        if (isUniqueConstraint) {
            return res.status(409).json({ error: 'User already booked this event' });
        }

        console.error('Reserve error:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
