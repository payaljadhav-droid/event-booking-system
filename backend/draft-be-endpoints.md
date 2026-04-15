POST /auth/register
POST /auth/login
POST /auth/logout
GET /auth/me (requires authMiddleware)
Events

GET /event/ (list)
GET /event/:id (detail)
POST /event/ (create; organizer only)
GET /event/myevents (organizer only)
Bookings

POST /book/ (book)
GET /book/my (my bookings)
POST /book/cancel (cancel)
