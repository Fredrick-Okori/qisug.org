

# Google OAuth Setup Guide - Complete Steps

## Your Configuration
- **Supabase URL**: `https://iapgweupfjjaenshfgkx.supabase.co`
- **Google Client ID**: `1049710961032-ddarscm744fishcuha54fa26q0o7ecri.apps.googleusercontent.com`
- **Google Client Secret**: `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`

## ERROR FIX: "provider is not enabled"

This error means Google OAuth is NOT enabled in your Supabase Dashboard. You need to enable it:

## Step 1: Enable Google Provider in Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `https://iapgweupfjjaenshfgkx.supabase.co`
3. Click **Authentication** in the left sidebar
4. Click **Providers** (next to "Users", "Policies", etc.)
5. Find **Google** in the list of providers
6. **Toggle the switch to ENABLE Google**
7. Expand the Google provider section
8. Enter your credentials:
   - **Client ID**: `1049710961032-ddarscm744fishcuha54fa26q0o7ecri.apps.googleusercontent.com`
   - **Client Secret**: `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`
9. Under **Redirect URLs**, add:
   ```
   http://localhost:3000/auth/callback
   ```
10. Click **Save**

## Step 2: Add Redirect URI to Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** > **Credentials**
4. Click on your OAuth 2.0 Client ID
5. Under **Authorized redirect URIs**, add:
   ```
   https://iapgweupfjjaenshfgkx.supabase.co/auth/v1/callback
   ```
6. Click **Save**

## Step 3: Configure URL Settings in Supabase

1. In Supabase Dashboard, go to **Authentication** > **URL Configuration**
2. Set **Site URL** to:
   ```
   http://localhost:3000
   ```
3. Add to **Redirect URLs**:
   ```
   http://localhost:3000/auth/callback
   https://iapgweupfjjaenshfgkx.supabase.co/auth/v1/callback
   ```
4. Click **Save**

## Step 4: Update Environment Variables

Create `.env.local` in your project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://iapgweupfjjaenshfgkx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Get your anon key from: Supabase > Settings > API > Project URL and anon key

## Step 5: Test

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Go to `http://localhost:3000/login`

3. Click "Continue with Google"

4. Complete the Google sign-in

5. You should be redirected to `http://localhost:3000/admin`

## Visual Guide

### Supabase Dashboard - Providers
```
Authentication > Providers

┌─────────────────────────────────────────┐
│  Provider   │  Status    │  Actions    │
├─────────────────────────────────────────┤
│  Email      │  ✅ Enabled │  Edit       │
│  Google     │  ❌ Disabled│  Edit       │  ← You need to ENABLE this
│  Facebook   │  ❌ Disabled│  Edit       │
│  Twitter    │  ❌ Disabled│  Edit       │
└─────────────────────────────────────────┘
```

## Common Issues

### "provider is not enabled"
→ Go to Authentication > Providers and enable Google

### "redirect_uri_mismatch"
→ Add the correct redirect URLs to Google Cloud Console AND Supabase

### "Access blocked"
→ Add test users in Google Cloud Console > OAuth consent screen

## Production Deployment

When deploying to production:

1. Add production URL to Google Cloud Console redirect URIs
2. Add production URL to Supabase redirect URLs
3. Update Site URL in Supabase
4. Update `.env.local` with production values


