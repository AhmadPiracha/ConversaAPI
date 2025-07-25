# ChatFlow - AI Chat & Subscription Management System

> A **TypeScript backend** implementing **Clean Architecture** and **Domain-Driven Design (DDD)** principles to power an AI chat system with **subscription management**, **usage tracking**, and **mock AI responses**.

---

## 📋 Table of Contents

* [✨ Features](#-features)
* [🏛️ Architecture](#-architecture)
* [🛠 Tech Stack](#-tech-stack)
* [🚀 Getting Started](#-getting-started)
* [💾 Database Management](#-database-management)
* [📡 API Documentation](#-api-documentation)
* [🧪 Testing](#-testing)
* [⚙️ Deployment](#-deployment)
* [🧰 Troubleshooting](#-troubleshooting)
* [🤝 Contributing](#-contributing)
* [📄 License](#-license)

---

## ✨ Features

### 🧠 AI Chat

* Mock OpenAI-style responses with typing delay and token cost simulation
* Smart quota management:
  * 3 free messages per user/month (auto-resets monthly)
  * Tier-based message quota (Basic, Pro, Enterprise)
  * Dynamic fallback to free quota or active subscription
* Intelligent quota deduction (free → subscription → deny)
* Token usage analytics per message
* Conversation history tracking per user
* Graceful error handling with detailed responses

### 💳 Subscription Management

* Multi-tier subscription system (Basic, Pro, Enterprise)
* Monthly/yearly billing cycles
* Automated billing & renewals (via cron jobs)
* Simulated payment gateway (90% success rate)
* Graceful payment failures and recovery
* Manual cancellation & modifications
* Usage tracking & analytics

### 🔐 Authentication

* Secure JWT-based login system
* Bcrypt password hashing
* Route protection middleware
* Demo user provisioning

---

## 🏛️ Architecture

Designed using **Clean Architecture + DDD** principles for scalability, separation of concerns, and testability.

```
src/
├── auth/             # Auth logic (domain, infra, routes)
├── chat/             # 💬 Chat Domain Module
│   ├── domain/             # Business logic & entities
│   ├── infrastructure/     # Data access implementations
│   └── interfaces/         # Controllers & routes
├── subscriptions/    # 💳 Subscription & billing
│   ├── domain/
│   ├── infrastructure/
│   └── interfaces/
├── common/           # Shared middleware, error handlers
│   ├── errors/
│   └── middleware/
└── core/             # DB, scheduler, server config
    ├── database/
    └── scheduler/
```

* **Domain**: Pure business logic and entities
* **Infrastructure**: DB adapters, services
* **Interfaces**: Controllers & route handlers

---

## 🛠 Tech Stack

| Category   | Tech Stack        |
| ---------- | ----------------- |
| Language   | TypeScript        |
| Framework  | Express.js        |
| Database   | PostgreSQL (Neon) |
| ORM        | Prisma            |
| Validation | Zod               |
| Scheduling | node-cron         |
| Auth       | JWT, bcrypt       |
| Dev Tools  | ESLint, Prettier  |
| Testing    | Jest              |

---

## 🚀 Getting Started

### 🔧 Prerequisites

* Node.js `16+`
* PostgreSQL (local or Neon)
* Git

### 📦 Installation

```bash
git clone https://github.com/yourusername/chatflow.git
cd chatflow
npm install
cp .env.example .env
```

Generate a JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Paste into your `.env` under JWT_SECRET
```

### 🛢️ Database Setup

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
npm run create-user
```

### ▶️ Start the App

```bash
npm run dev
```

Visit:

* **Frontend**: `http://localhost:3000`
* **API**: `http://localhost:3000/api`
* **Health Check**: `http://localhost:3000/health`

### ⚡ Quick Setup (Single Command)

```bash
npm run setup
```

---

## 💾 Database Management

### Using Neon (Recommended)

1. Create an account at [neon.tech](https://neon.tech) and get your connection string.
2. Paste the connection URL into `.env`:

```env
DATABASE_URL="postgresql://user:pass@neon-url/neondb?sslmode=require"
```

3. Test the connection:

```bash
npm run test-db
```

### 🔁 Migrations

```bash
# Create migration
npx prisma migrate dev --name <migration_name>

# Deploy production migrations
npx prisma migrate deploy

# Reset DB (⚠️ deletes data)
npx prisma migrate reset --force
```

### 📊 Prisma Studio

```bash
npx prisma studio
```

### 🧑‍💻 PSQL Commands (Optional)

```bash
psql "<NEON_URL>"
\dt             -- list tables
\d users        -- describe table
SELECT * FROM users LIMIT 5;
```

---

## 📡 API Documentation

### 🔹 POST `/api/chat/ask`

Send a question to the AI and receive a simulated response.

#### Request:

```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440001",
  "question": "What is artificial intelligence?"
}
```

#### Response:

```json
{
  "answer": "Artificial intelligence (AI) refers to the simulation of human intelligence in machines...",
  "tokenUsage": 34,
  "quotaStatus": "Subscription"
}
```

### 🔐 Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

> Full API Reference available at [https://chatflow-demo.vercel.app/api-docs](https://chatflow-demo.vercel.app/api-docs)

---

## 💳 Subscription Tiers

| Tier           | Messages  | Monthly Price | Yearly Price | Features                |
| -------------- | --------- | ------------- | ------------ | ----------------------- |
| **Basic**      | 10        | \$9.99        | \$99.99      | For casual users        |
| **Pro**        | 100       | \$29.99       | \$299.99     | For regular users       |
| **Enterprise** | Unlimited | \$99.99       | \$999.99     | For teams & power users |

#### 🧾 Billing System:

* **Monthly & Yearly Plans**
* **Simulated Payment Gateway** (90% success rate)
* **Graceful Payment Failures**
* **Auto Renewals**
* **Manual Cancellation & Modifications**

---

## 🔄 Automation (via Cron)

* **Daily Billing Cron** → Processes renewals (runs at 2 AM)
* **Monthly Free Quota Reset** → Every 1st of month
* **Real-Time Usage Tracking**
* **Resilient Failure Recovery**

---

## 📁 Scripts & Tooling

* `prisma/seed.ts`: Seeds subscription plans
* `scripts/create-sample-user.ts`: Creates test user
* `core/scheduler`: Cron tasks for billing & quota resets
* `common/middleware`: Centralized error handling

---

## 🧪 Testing

Run all tests:

```bash
npm run test
```

Use `Jest` for unit/integration tests with mocking support.

---

## ⚙️ Deployment

* Deploy backend to **Render**, **Railway**, or **Vercel Functions**
* Use **Neon PostgreSQL** for serverless DB
* Environment variables required:
  * `DATABASE_URL`
  * `JWT_SECRET`
  * `NODE_ENV=production`

---

## 🧰 Troubleshooting

| Issue                     | Fix                                              |
| ------------------------- | ------------------------------------------------ |
| JWT errors                | Ensure `JWT_SECRET` is set in `.env`             |
| Database connection fails | Double-check `DATABASE_URL`, SSL options in Neon |
| Prisma client not found   | Run `npx prisma generate`                        |

---

##   TODO / Future Improvements

* 🔐 Authentication (JWT/OAuth)
* 🧾 Stripe Integration
* 📊 Admin Dashboard
* 🧪 Unit & Integration Testing (Jest)
* 🐳 Dockerize the system
* 📈 Monitoring & Logs (e.g., Winston, Sentry)

---

## 🤝 Contributing

Contributions welcome! To get started:

```bash
git checkout -b feature/your-feature
```

Open a PR when ready 🚀

---

## 📄 License

MIT © [Ahmad Piracha]
