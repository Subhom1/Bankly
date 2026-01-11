# Bankly - Modern Digital Banking Platform

Bankly is a secure, full-stack digital banking application built with a modern monorepo architecture. It features real-time currency management, secure peer-to-peer transfers, and atomic currency exchanges.

## 🚀 Key Features

- **Full-Stack Authentication**: Secure registration and login using JWT and BCrypt hashing.
- **Multi-Currency Wallets**: Automatic creation of USD ($1,000) and EUR (€500) accounts for every new user.
- **Atomic Transactions**: 
  - **Transfers**: Securely send money to other users via email.
  - **Exchanges**: Swap assets between your USD and EUR wallets with fixed real-time rates (1 USD = 0.92 EUR).
- **Transaction History**: Comprehensive, paginated history with filtering by transaction type.
- **Live Dashboard**: Real-time balance updates and a "Recent Activity" feed.
- **Financial Integrity**: Powered by Prisma transactions for database-level atomicity and 2-decimal precision.

## 🛠 Tech Stack

- **Frontend**: [Next.js 15+](https://nextjs.org/), React 19, Tailwind CSS, Axios.
- **Backend**: [NestJS](https://nestjs.com/), Prisma ORM, Passport.js (JWT).
- **Database**: PostgreSQL.
- **Architecture**: Monorepo managed with Yarn Workspaces.

## 💻 Local Setup

### Prerequisites
- Node.js (v18+)
- Yarn
- PostgreSQL instance

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd Bankly
yarn install
```

### 2. Environment Configuration
Create a `.env` file in `apps/api/` and `apps/web/`:

**apps/api/.env**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/bankly"
JWT_SECRET="your_secure_random_secret"
```

**apps/web/.env.local**
```env
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### 3. Database Initialization
```bash
yarn prisma:generate
yarn prisma:migrate
```

### 4. Run the Application
In separate terminal windows:
- **Backend**: `yarn backend` (Runs at http://localhost:3000)
- **Frontend**: `yarn frontend` (Runs at http://localhost:3001)

## ☁️ Deployment

This project is pre-configured for **Render**.

1. Connect your repository to Render.
2. The `render.yaml` file will automatically provision:
   - A Managed PostgreSQL database.
   - A Web Service for the API.
3. Configure the `JWT_SECRET` and `DATABASE_URL` in the Render dashboard.

