# Crypto Trading Journal Web App

This repository contains a **production‑ready** trading journal SaaS built with **Next.js**, **Tailwind CSS**, **Supabase**, and **TypeScript**.  The goal of the application is to help crypto traders record trades, evaluate performance, improve discipline, monitor risk and track long‑term compounding.  It is designed with a **dark, minimalist aesthetic** inspired by Binance and TradingView, featuring clean typography, a card‑based layout and responsive design for both mobile and desktop users.

## Features

### Dashboard

The dashboard provides a high‑level overview of your trading performance:

- **Total balance** and **profit/loss**
- **Win rate**, **average risk‑reward ratio** and **number of trades**
- **Time‑period statistics** (daily/weekly/monthly)
- **Equity curve** and a list of recent trades

### Trading Journal

Use the journal to log every trade with the following fields:

- Crypto pair, entry/exit price, stop loss, take profit and position size
- Fees and taxes
- Screenshot upload and notes explaining your reasoning
- Trade result (win/loss), with automatic calculation of risk–reward ratio and profit/loss percentage

### Analytics

Analyze your data through charts and tables:

- Performance over time (equity curve)
- Win rate per pair and by day/hour of trading
- Average risk and expectancy
- Losing streaks and best setups
- Long‑term compounding simulation

### Risk Management

Tools to help you trade responsibly:

- Position sizing calculator based on your risk parameters
- Set maximum risk per trade and daily loss limit
- Warnings when you exceed your trading plan

### Settings

Manage preferences and data:

- Toggle dark/light mode and update profile information
- Import/export your journal in CSV format
- Manage authentication and security

## Tech Stack

This project uses the following technologies:

- **Next.js 16** (App Router) for server‑side rendering, API routes and routing.  Next.js provides automatic optimisations such as Server Components and code splitting to improve performance【590203717170641†L23-L50】.
- **Tailwind CSS** for utility‑first styling and responsive design.
- **Supabase** (PostgreSQL) as the backend database with real‑time subscriptions and built‑in authentication.  Supabase’s auto‑generated APIs and row‑level security (RLS) policies simplify multi‑tenant data security【314107086638092†L145-L162】.
- **TypeScript** for type safety across the stack.

## Getting Started

### Prerequisites

1. **Supabase project** – create one at [database.new](https://database.new).  Copy the Project URL and publishable key as described in the Supabase Quickstart【802143775977784†L173-L194】.
2. **Node.js ≥ 18** – this project uses modern ES modules and server components.
3. **Git** – to clone the repository.

### Installation

1. Clone the repository and install dependencies:

   ```sh
   git clone https://your‑repo/trading‑journal‑app.git
   cd trading‑journal‑app
   npm install
   ```

2. Configure your environment variables.  Duplicate `.env.example` as `.env.local` and fill in your Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

   The Supabase documentation notes that you should use the new `sb_publishable_xxx` keys for client‑side operations and keep `sb_secret_xxx` or `service_role` keys private【802143775977784†L209-L224】.

3. Start the development server:

   ```sh
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.  The first time you visit `/auth/sign-up` you can create an account.

### Deploying to Vercel

1. Push your code to a Git provider (GitHub, GitLab or Bitbucket).
2. Sign in to [Vercel](https://vercel.com/) and create a new project from your repository.  During setup, add the environment variables from `.env.local` to Vercel’s dashboard.
3. Set the build command to `npm run build` and the output directory to `.next` (Vercel auto-detects Next.js projects).  Vercel will automatically deploy your app.

## Supabase Database Schema

The SQL file `database/schema.sql` defines the tables and policies required by the app.  Supabase’s RLS ensures that users can only access their own data.  The `trades` table includes fields for trade metadata and uses foreign keys to link records to the authenticated user.  Policies restrict `SELECT`, `INSERT`, `UPDATE` and `DELETE` operations to the record owner【419092180213536†L92-L164】.  Indexes on `user_id` and `created_at` improve query performance【66199616377079†L68-L74】.

## Folder Structure

```
trading-journal-app/
├── app/                 # Next.js app router directory
│   ├── layout.tsx       # Root layout with Tailwind, dark mode and sidebar
│   ├── globals.css      # Tailwind base styles
│   ├── page.tsx         # Redirects to /dashboard
│   ├── dashboard/       # Dashboard page
│   ├── trading-journal/ # Journal form and list
│   ├── analytics/       # Charts and analytics
│   ├── risk-management/ # Risk calculator
│   └── settings/        # User settings and import/export
├── components/          # Reusable UI components
├── lib/                 # Supabase client helpers and utilities
├── database/            # SQL schema and seed files
├── public/              # Static assets
├── tailwind.config.ts   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
├── next.config.mjs      # Next.js configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Scripts and dependencies
```

## Security Best Practices

- **Row‑level security (RLS)** – RLS must be enabled on every table and a policy created to restrict access to records belonging to the current user【419092180213536†L92-L164】.  Without RLS your application may unintentionally expose data to other users.  The policy uses `auth.uid()` to match the `user_id` column.
- **Indexes for RLS** – Supabase recommends adding indexes on columns used in RLS policies (e.g., `user_id`) to prevent performance degradation【66199616377079†L68-L74】.
- **Never expose the service role key** – store the `SUPABASE_SERVICE_ROLE_KEY` on the server only.  Use the publishable or anon key for client‑side interactions【802143775977784†L209-L224】.
- **Sanitize uploads** – screenshots are stored in Supabase Storage; use signed URLs and validate file types on the server.
- **Use HTTPS and secure cookies** – ensure your Vercel deployment uses HTTPS and configure Supabase auth to use secure, HTTP‑only cookies.

## Performance Optimisation

Next.js provides automatic optimisations including Server Components, code splitting, prefetching and caching【590203717170641†L23-L50】.  To maximise performance:

- Use **Server Components** for data fetching and avoid unnecessary client‑side JavaScript.  Only mark components as `'use client'` when interactivity is required.
- Lazy load heavy components and charts to reduce the initial bundle size.  Next.js supports lazy loading via `React.lazy()` or dynamic imports.
- Use **Tailwind’s JIT** mode (default) to generate only the CSS you need.
- Cache expensive queries in Supabase by utilising the `unstable_cache` API or by prefetching data on the server.

## Risk Management Guidance

The Binance risk‑management guide recommends limiting risk to **1–2% of total capital per trade**, using a **risk‑reward ratio of at least 1:2**, and always setting stop‑loss and take‑profit orders【638385365362929†L25-L80】.  It also emphasises keeping a trading journal to analyze the win/loss ratio and improve based on recurring mistakes【638385365362929†L124-L129】.  The built‑in risk calculator in this app helps you adhere to these principles.
