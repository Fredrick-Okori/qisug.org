-- Create admin_users table (if not already created)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'reviewer', 'viewer')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id),
  UNIQUE (email)
);

-- Enable RLS on admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy for admins to view admin_users
CREATE POLICY IF NOT EXISTS "Admins can view admin_users" ON admin_users FOR SELECT USING (
  EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid() AND admin_users.is_active)
);

-- Insert your admin user (replace 'your-auth-user-id' with your actual Supabase user ID)
-- To find your user ID, go to Supabase Dashboard -> Authentication -> Users -> Copy the ID
INSERT INTO admin_users (user_id, email, full_name, role)
VALUES ('your-auth-user-id', 'admin@queensgate.ac.ug', 'Administrator', 'admin')
ON CONFLICT (user_id) DO NOTHING;

