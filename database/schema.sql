-- Database schema for the crypto trading journal

-- Enable the uuid extension
create extension if not exists "uuid-ossp";

-- Trades table: stores each trade recorded by the user.
create table if not exists trades (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pair text not null,
  entry_price numeric not null,
  exit_price numeric,
  stop_loss numeric,
  take_profit numeric,
  position_size numeric not null,
  fee numeric,
  tax numeric,
  screenshot_url text,
  notes text,
  result text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes to improve query performance, especially with RLS policies【66199616377079†L68-L74】
create index if not exists idx_trades_user_id on trades (user_id);
create index if not exists idx_trades_created_at on trades (created_at);

-- Enable Row Level Security (RLS)
alter table trades enable row level security;

-- RLS policies: only allow the owner of a record to read, insert, update or delete it【419092180213536†L92-L164】
create policy if not exists "Users can view their trades"
  on trades for select
  using (auth.uid() = user_id);

create policy if not exists "Users can insert their trades"
  on trades for insert
  with check (auth.uid() = user_id);

create policy if not exists "Users can update their trades"
  on trades for update
  using (auth.uid() = user_id);

create policy if not exists "Users can delete their trades"
  on trades for delete
  using (auth.uid() = user_id);

-- Risk management settings for each user
create table if not exists risk_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  max_risk_per_trade numeric default 0.01,
  daily_loss_limit numeric default 0.05,
  max_trades_per_day integer default 5,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table risk_settings enable row level security;

create policy if not exists "Users can manage their risk settings"
  on risk_settings for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);