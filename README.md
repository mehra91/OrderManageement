# Order Management

A full-stack order management application built with React, Vite, Express, and MongoDB. Users can register and log in, browse products, place orders, view their own orders, and update an order's status.

## Requirements

- Node.js 18 or later and npm
- MongoDB running locally, or a MongoDB Atlas connection string

## Project structure

```text
order-management/
├── client/          # React + Vite frontend
└── server/          # Express API and MongoDB models
```

There is no root `package.json`; install and run the frontend and backend from their own folders.

## Backend setup

In a terminal, from the project root:

```bash
cd server
npm install
```

Create `server/.env` with the variables below. Make sure the MongoDB server/database is reachable using `MONGO_URI` before starting the API.

```dotenv
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/order_management
JWT_SECRET=replace_with_a_long_random_secret
```

`PORT` is optional (the server defaults to `5000`). `MONGO_URI` points to your MongoDB database. `JWT_SECRET` is used to sign and verify login tokens; keep it private and use a strong random value. For MongoDB Atlas, use the connection URI supplied by Atlas instead of the local example.

Start the API in development mode:

```bash
npm run dev
```

The backend also supports production-style start with `npm start`.

### Database and sample products

The server connects to MongoDB when it starts. Mongoose creates the `users`, `products`, and `orders` collections as records are added. To insert the three sample products (Keyboard, Mouse, Monitor), run this from `server/`:

```bash
npm run seed
```

The seed script inserts three products each time it is run, so run it once for a fresh database unless you want duplicate sample products.

## Frontend setup

Open a second terminal at the project root:

```bash
cd client
npm install
npm run dev
```

Open the local URL printed by Vite (typically `http://localhost:5173`). During development, Vite proxies `/api` requests to `http://localhost:5000`; start the backend on that port, or update `client/vite.config.js` if you use another backend port. No frontend environment variables are required for the current setup.

To create a production build:

```bash
npm run build
```

## Run the whole application

1. Configure `server/.env` and ensure MongoDB is running/reachable.
2. In terminal one, run `cd server`, `npm install` (first time only), then `npm run dev`.
3. In terminal two, run `cd client`, `npm install` (first time only), then `npm run dev`.
4. Open the Vite URL in your browser and register an account.
5. Optionally seed the sample catalog by running `npm run seed` from `server/`.

## API endpoints

Base URL in local development: `http://localhost:5000/api`. JSON request bodies are expected where shown. Authenticated endpoints require `Authorization: Bearer <token>`; obtain a token from register or login. Product listing/detail endpoints are public. Orders are scoped to the signed-in user.

| Method | Endpoint | Authentication | Purpose |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | No | Register with `{ "name", "email", "password" }` |
| `POST` | `/auth/login` | No | Sign in with `{ "email", "password" }` |
| `GET` | `/products` | No | List products |
| `GET` | `/products/:id` | No | Get a product by ID |
| `POST` | `/products` | Yes | Create a product with `{ "name", "description", "price", "stock" }` |
| `POST` | `/orders` | Yes | Place an order with `{ "items": [{ "product": "<productId>", "quantity": 1 }] }` |
| `GET` | `/orders` | Yes | List the signed-in user's orders |
| `GET` | `/orders/:id` | Yes | Get one of the signed-in user's orders |
| `PUT` | `/orders/:id/status` | Yes | Change an owned order's status with `{ "status": "confirmed" }` |

Valid order statuses are `pending`, `confirmed`, `shipped`, `delivered`, and `cancelled`. An order cannot be changed after it has been cancelled. Requests for another user's order return `404`.

## Security notes

- Never commit or share the real `server/.env`; it contains database credentials and the JWT signing secret. Use a separate `.env` in each environment.
- The API stores a password hash, not a plain-text password.
- Private order queries check both the order ID and the authenticated user's ID on the server.
