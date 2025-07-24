# 🤖 AI Chat & Subscription Backend System

A production-ready TypeScript backend implementing **Clean Architecture** and **Domain-Driven Design** for an AI-powered chat system with comprehensive subscription management.

## 🎯 **What This Project Does**

This system combines **AI chat functionality** with **subscription-based billing** to create a complete SaaS backend. Users can chat with an AI (simulated OpenAI responses) while the system intelligently manages usage quotas, billing cycles, and subscription tiers.

### **Core Functionality:**
- 💬 **AI Chat with Smart Quota Management**
- 💳 **Multi-tier Subscription System** 
- 📊 **Usage Tracking & Analytics**
- 🔄 **Automated Billing & Renewals**
- 🎯 **Freemium Business Model Support**

---

## 🏗️ **System Architecture**

Built with **Clean Architecture** and **Domain-Driven Design** principles:

\`\`\`
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
├── common/                 # 🔧 Shared Components
│   ├── errors/            # Domain error classes
│   └── middleware/        # Validation & error handling
└── core/                   # 🏛️ Core Infrastructure
    ├── database/          # Prisma client
    └── scheduler/         # Automated tasks
\`\`\`

---

## ✨ **Key Features**

### 🤖 **AI Chat System**
- **3 Free Messages/Month**: Every user gets free quota that auto-resets
- **Simulated OpenAI Responses**: Realistic API delays and token usage
- **Smart Quota Deduction**: Automatically uses best available quota source
- **Message History**: Complete conversation tracking
- **Token Analytics**: Usage metrics for billing and optimization

### 💰 **Subscription Management**

#### **Subscription Tiers:**
| Tier | Messages | Monthly | Yearly | Features |
|------|----------|---------|--------|----------|
| **Basic** | 10/month | $9.99 | $99.99 | Perfect for casual users |
| **Pro** | 100/month | $29.99 | $299.99 | Great for regular users |
| **Enterprise** | Unlimited | $99.99 | $999.99 | For power users & businesses |

#### **Billing Features:**
- ✅ **Flexible Billing Cycles**: Monthly or yearly options
- ✅ **Auto-Renewal**: Configurable automatic renewals
- ✅ **Payment Simulation**: 90% success rate for testing
- ✅ **Graceful Failures**: Handles payment failures elegantly
- ✅ **Subscription Management**: Easy cancellation and modifications

### 🔄 **Automated Operations**
- **Daily Renewal Processing**: Runs at 2 AM automatically
- **Monthly Quota Resets**: Free messages reset on 1st of each month
- **Usage Tracking**: Real-time quota monitoring
- **Error Recovery**: Robust error handling and logging

---

## 🚀 **Quick Start Guide**

### **Prerequisites**
- Node.js 18+ 
- PostgreSQL database (or Neon cloud database)
- Git

### **1. Setup Database**

**Option A: Neon (Recommended)**
1. Create account at [Neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string

**Option B: Local PostgreSQL**
\`\`\`bash
# Install PostgreSQL and create database
createdb ai_chat_db
\`\`\`

### **2. Project Setup**
\`\`\`bash
# Clone/download the project
cd ai-chat-subscription-backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
\`\`\`

### **3. Configure Environment**
\`\`\`env
# Add to .env file
DATABASE_URL="your_neon_or_postgres_connection_string"
PORT=3000
NODE_ENV=development
\`\`\`

### **4. Database Setup**
\`\`\`bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed sample data
npx ts-node prisma/seed.ts

# Create sample user
npx ts-node scripts/create-sample-user.ts
\`\`\`

### **5. Start Development Server**
\`\`\`bash
npm run dev
\`\`\`

### **6. Test the System**
Open `http://localhost:3000` in your browser to access the testing interface.

---

## 📡 **API Documentation**

### **Chat Endpoints**

#### Send Chat Message
```http
POST /api/chat/ask
Content-Type: application/json

{
  "userId": "550e8400-e29b-41d4-a716-446655440001",
  "question": "What is artificial intelligence?"
}
