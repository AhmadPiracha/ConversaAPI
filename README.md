# 🤖 AI Chat & Subscription Backend System

A production-ready **TypeScript** backend implementing **Clean Architecture** and **Domain-Driven Design (DDD)** principles to power an **AI chat system** with full-fledged **subscription management**.

---

## 🎯 What This Project Does

This backend is ideal for SaaS applications that need:

* AI-powered chat services
* Usage tracking and intelligent quota handling
* Automated subscriptions, billing, and renewals
* Freemium-to-premium upgrade flows

### ✅ Core Features:

* 💬 **AI Chat with Smart Quota Management**
* 💳 **Multi-tier Subscription System**
* 📊 **Usage Tracking & Analytics**
* 🔄 **Automated Billing & Renewals**
* 🆓 **Freemium Tier Support**

---

## 🏗️ System Architecture

Designed using **Clean Architecture** + **DDD** for scalability, separation of concerns, and testability.

```
src/
├── chat/                    # 💬 Chat Domain Module
│   ├── domain/             # Business logic & entities
│   │   ├── entities/       # Chat entity
│   │   ├── repositories/   # Chat repository interface
│   │   └── services/       # Chat business logic
│   ├── infrastructure/     # Data access implementations
│   └── interfaces/         # Controllers & routes
├── subscriptions/          # 💳 Subscription Domain Module
│   ├── domain/
│   │   ├── entities/       # User & SubscriptionBundle entities
│   │   ├── repositories/   # Repository interfaces
│   │   └── services/       # Subscription business logic
│   ├── infrastructure/
│   └── interfaces/
├── common/                 # 🔧 Shared Utilities
│   ├── errors/             # Custom error classes
│   └── middleware/         # Validation & error handling
└── core/                   # 🏛️ Core Infrastructure
    ├── database/           # Prisma client & schema
    └── scheduler/          # Cron jobs & automation
```

---

## ✨ Feature Breakdown

### 🤖 AI Chat System

* **3 Free Messages/Month** (auto-resets monthly)
* **Simulated OpenAI Responses** with latency and token cost
* **Intelligent Quota Deduction** (free → subscription → deny)
* **Token Usage Analytics** per message
* **Conversation History** tracking per user

---

### 💳 Subscription Tiers

| Tier           | Messages  | Monthly Price | Yearly Price | Features                |
| -------------- | --------- | ------------- | ------------ | ----------------------- |
| **Basic**      | 10        | \$9.99        | \$99.99      | For casual users        |
| **Pro**        | 100       | \$29.99       | \$299.99     | For regular users       |
| **Enterprise** | Unlimited | \$99.99       | \$999.99     | For teams & power users |

#### 🧾 Billing System:

* ✅ **Monthly & Yearly Plans**
* ✅ **Simulated Payment Gateway** (90% success rate)
* ✅ **Graceful Payment Failures**
* ✅ **Auto Renewals**
* ✅ **Manual Cancellation & Modifications**

---

### 🔄 Automation (via Cron)

* **Daily Billing Cron** → Processes renewals (runs at 2 AM)
* **Monthly Free Quota Reset** → Every 1st of month
* **Real-Time Usage Tracking**
* **Resilient Failure Recovery**

---

## 🚀 Getting Started

### 🧰 Prerequisites

* **Node.js v18+**
* **PostgreSQL or Neon DB**
* **Git**

---

### ⚙️ Setup Guide

#### 1️⃣ Clone & Install

```bash
git clone https://github.com/your-username/ai-chat-subscription-backend
cd ai-chat-subscription-backend
npm install
```

#### 2️⃣ Configure Environment

```bash
cp .env.example .env
```

Update your `.env`:

```env
DATABASE_URL="your_neon_or_postgres_connection_string"
PORT=3000
NODE_ENV=development
```

#### 3️⃣ Initialize DB with Prisma

```bash
npx prisma generate
npx prisma migrate dev --name init
npx ts-node prisma/seed.ts
npx ts-node scripts/create-sample-user.ts
```

#### 4️⃣ Start the Server

```bash
npm run dev
```

Access: `http://localhost:3000`

---

## 🧪 API Documentation

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

---

## 📁 Scripts & Tooling

* `prisma/seed.ts`: Seeds subscription plans
* `scripts/create-sample-user.ts`: Creates test user
* `core/scheduler`: Cron tasks for billing & quota resets
* `common/middleware`: Centralized error handling

---

## ✅ TODO / Future Improvements

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

MIT © \[Ahmad Piracha]
