# Supabase Setup for Vercel Production

## Current Issue
The message "[Middleware] Supabase not configured, skipping auth checks" means your Supabase environment variables are not set in Vercel.

## Solution: Add Environment Variables to Vercel

### Step 1: Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `https://iapgweupfjjaenshfgkx.supabase.co`
3. Go to **Project Settings** → **API**
4. Copy:
   - **Project URL**: `https://iapgweupfjjaenshfgkx.supabase.co`
   - **anon public** key (starts with `eyJ...`)

### Step 2: Add to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click **Settings** → **Environment Variables**
4. Add the following variables:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://iapgweupfjjaenshfgkx.supabase.co` | Production, Development, Preview |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your-anon-key-here` | Production, Development, Preview |

5. Click **Save**
6. **Important**: Go to **Deployments** and redeploy your project (click the three dots → **Redeploy**)

### Step 3: Configure Supabase Dashboard

In your Supabase dashboard:

1. Go to **Authentication** → **URL Configuration**
2. Add your site URL:
   - Production: `https://qisug.org` (or your custom domain)
   - Development: `http://localhost:3000`
3. Click **Save**

### Step 4: Configure Google OAuth (Optional, for Google Sign-In)

If you're using Google sign-in:

**In Google Cloud Console:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Select your OAuth 2.0 Client ID
3. Add to **Authorized redirect URIs**:
   - Production: `https://your-project-id.supabase.co/auth/v1/callback`
   - Development: `http://localhost:3000/auth/callback`

**In Supabase Dashboard:**
1. Go to **Authentication** → **Providers**
2. Click on **Google**
3. Enable it and add your Google Client ID and Client Secret
4. Click **Save**

### Step 5: Verify It Works

After redeploying, check your Vercel Function Logs:
1. Go to **Deployments** → Click on latest deployment
2. Click **Functions** tab
3. Look for any errors in the logs

You should no longer see "[Middleware] Supabase not configured"

## Common Issues

### "Missing NEXT_PUBLIC_SUPABASE_URL"
- Environment variable not set in Vercel
- Redeploy after adding variables

### "Invalid API key"
- Using service-role key instead of anon key
- Get fresh anon key from Supabase dashboard

### "Site URL not configured"
- Add your URL in Supabase → Authentication → URL Configuration

## Local Development

Create a `.env.local` file in your project root:

```bash
# Copy .env.local.example to .env.local and fill in values
cp .env.local.example .env.local
```

Then edit `.env.local` with your Supabase credentials.

