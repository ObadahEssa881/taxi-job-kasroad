A backend service built with TypeScript, Express.js, and Prisma ORM for calculating trip cancellation rates between given dates.
The project connects to a PostgreSQL database and provides two different implementations for calculating daily cancellation rates.

🚀 Setup Instructions
1️⃣ Clone the repository
git clone https://github.com/YOUR_USERNAME/taxi-cancellation-api.git
cd taxi-cancellation-api

2️⃣ Install dependencies
npm install

3️⃣ Configure environment variables

Create a .env file in the project root:

DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/taxi?schema=public"
PORT=4000

4️⃣ Apply Prisma schema
npx prisma db push


(Optional) Seed sample data:

npx prisma studio

5️⃣ Start the server
npm run dev


Server should start at:

http://localhost:4000

📡 API Endpoints
1️⃣ GET /api/cancellation-rate

Array-based implementation.

Query Parameters:

Parameter	Type	Required	Example
start_date	string	✅	2013-10-01
end_date	string	✅	2013-10-03

Example Request:

GET http://localhost:4000/api/cancellation-rate?start_date=2013-10-01&end_date=2013-10-03


Example Response:

[
  { "day": "2013-10-01", "cancelRate": 0.33 },
  { "day": "2013-10-02", "cancelRate": 0.50 }
]

2️⃣ GET /api/cancellation-rate2

Object-based grouping implementation (cleaner and more scalable).

Example Response:

[
  { "Day": "2013-10-01", "Cancellation Rate": 0.33 },
  { "Day": "2013-10-02", "Cancellation Rate": 0.5 }
]

🧠 Logic Overview
getCancellationRate

Fetches all trips within start_date and end_date.

Filters out banned users/drivers.

Groups trips by day index.

Calculates:

cancelRate = cancelled / total

getCancellationRate2

Similar logic, but uses a grouped object instead of an array.

Easier to maintain and more robust.

🧪 Example Query Flow

User calls

GET /api/cancellation-rate2?start_date=2013-10-01&end_date=2013-10-03


Prisma fetches trips in that date range.

The function filters out trips involving banned users or drivers.

Each day’s total and cancelled trips are counted.

Response returns the daily cancellation rate.
