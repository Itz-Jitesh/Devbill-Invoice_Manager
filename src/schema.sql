-- SUPABASE INITIALIZATION SCRIPT
-- RUN THIS IN THE SUPABASE SQL EDITOR (https://supabase.com/dashboard/project/_/sql)

-- 1. ENABLE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CREATE TABLES
-- Users table linking to auth.users (if you want to keep username)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text NOT NULL,
  email text UNIQUE NOT NULL,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Enable RLS on users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own profile" ON users FOR ALL USING (auth.uid() = id);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text,
  company text,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_active boolean DEFAULT true,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Enable RLS on clients
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own clients" ON clients FOR ALL USING (auth.uid() = user_id);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  date timestamp DEFAULT now(),
  due_date timestamp,
  invoice_number integer,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Composite Unique Index on invoices
CREATE UNIQUE INDEX invoices_user_id_invoice_number_idx ON invoices (user_id, invoice_number);

-- Enable RLS on invoices
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own invoices" ON invoices FOR ALL USING (auth.uid() = user_id);

-- Invoice Counter table
CREATE TABLE IF NOT EXISTS invoice_counters (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  next_number integer DEFAULT 1
);

-- Enable RLS on invoice_counters
ALTER TABLE invoice_counters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own counters" ON invoice_counters FOR ALL USING (auth.uid() = user_id);

-- RPC Function for Atomic Invoice Number Increment
CREATE OR REPLACE FUNCTION increment_invoice_number(target_user_id uuid)
RETURNS integer AS $$
DECLARE
  current_number integer;
BEGIN
  INSERT INTO invoice_counters (user_id, next_number)
  VALUES (target_user_id, 2)
  ON CONFLICT (user_id)
  DO UPDATE SET next_number = invoice_counters.next_number + 1
  RETURNING invoice_counters.next_number - 1 INTO current_number;
  
  RETURN current_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
