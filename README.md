# Bankly - Modern Digital Banking Platform

Bankly is a secure, full-stack digital banking application built with a modern monorepo architecture. It features real-time currency management, secure peer-to-peer transfers, and atomic currency exchanges.

Visit preview deployed on Frontend on Vercel and Backend & Database on Render: [Link](https://bankly-web.vercel.app/) 

<img src="https://raw.githubusercontent.com/Subhom1/mygitsrc/refs/heads/master/src/Bankly.png" alt="mobile-light-preview">

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

## 🏦 User Management Approach
**Approach Chosen: Option A (Registration Endpoint)**
- Users can sign up via the frontend `/signup` page.
- Every new user is automatically assigned a USD and EUR account with initial balances.
- Pre-seeded users (like `alice@example.com`) are available via the `seed.ts` script for quick testing.

## 📐 Design Decisions & Trade-offs
- **Prisma Transactions**: Used `$transaction` for all transfers and exchanges to guarantee that ledger entries and account balances never drift.
- **React Context for Auth**: Switched from Recoil to React Context to ensure 100% compatibility with React 19's rendering engine.
- **Client-Side Redirection**: Chose client-side route protection (via `useEffect` in layouts) for rapid development and flexibility in displaying loading states.
- **Fixed Exchange Rate**: Implemented a hardcoded rate (1 USD = 0.92 EUR) to ensure predictable and transparent calculations for users, as per business requirements.

## ⚠️ Known Limitations
- **No WebSockets**: The dashboard uses manual refresh/polling logic instead of persistent sockets for balance updates.
- **Precision**: Monetary values are capped at 2 decimal places. While sufficient for this use case, high-frequency trading apps might require higher precision.
- **Single Backend Instance**: The current setup assumes a single server instance. Scaling horizontally would require a more robust session management strategy (e.g., Redis).

## ⏳ Incomplete Features
- **Unit Testing**: Due to time constraints, automated unit tests for the financial logic were not implemented, though logic was manually verified.
- **Docker Setup**: A containerized environment for the entire monorepo is planned but currently pending.
- **Audit Reconciliation**: A secondary sanity-check endpoint to verify that `Sum(Ledger) == Account.Balance` is not yet implemented.

## ☁️ Deployment
This project is pre-configured for **Render**.
1. Connect your repository to Render.
2. The `render.yaml` file will automatically provision the database and API service.
3. Use `yarn build:api` and `yarn start:api` as build/start commands.
