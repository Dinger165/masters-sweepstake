# Masters 2026 Sweepstakes

A live sweepstakes app for the Masters Tournament with odds-based scoring, real-time leaderboard, and admin score management.

---

## Setup (15 minutes)

### Step 1 — Create a Supabase project (free)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click **New project** — give it a name like `masters-sweepstakes`
3. Once created, go to **SQL Editor** in the left sidebar
4. Paste the contents of `supabase_schema.sql` and click **Run**
5. Go to **Settings → API** and copy:
   - **Project URL** (looks like `https://xxxx.supabase.co`)
   - **anon public** key

### Step 2 — Configure environment variables

1. Copy `.env.example` to `.env.local`:
   ```
   cp .env.example .env.local
   ```
2. Fill in your values:
   ```
   REACT_APP_SUPABASE_URL=https://your-project.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### Step 3 — Deploy to Vercel (free)

1. Push this folder to a GitHub repository
2. Go to [vercel.com](https://vercel.com), sign in with GitHub
3. Click **New Project** and import your repository
4. In **Environment Variables**, add:
   - `REACT_APP_SUPABASE_URL` → your Supabase URL
   - `REACT_APP_SUPABASE_ANON_KEY` → your Supabase anon key
5. Click **Deploy** — done!

Your app will be live at `https://your-project.vercel.app`

---

## Using the app

### For participants
- Visit the URL and go to **Enter**
- Type your name, pick a golfer (each golfer can only be picked once)
- Hit **Submit entry**
- Bookmark the URL and check **Leaderboard** anytime

### For you (admin)
- Go to **Admin** tab, enter password `masters2026`
- After each round, enter each golfer's current leaderboard position
- Optionally enter their score vs par (e.g. -5, +2, 0 for even)
- Click **Save & update leaderboard** — everyone sees it instantly

**Change the admin password** in `src/components/AdminPage.js` line 8:
```js
const ADMIN_PASSWORD = 'your-new-password'
```

---

## Scoring system

Points = **base position points × odds multiplier**

| Position | Base points |
|----------|-------------|
| 1st | 100 |
| 2nd | 80 |
| 3rd | 65 |
| 4th | 50 |
| 5th | 40 |
| 6th | 30 |
| 7th | 22 |
| 8th | 16 |
| 9th | 10 |
| 10th | 6 |
| 11th+ | 0 |

**Odds multiplier** = starting odds ÷ 100
- Scheffler (+500) → 5× multiplier
- Shane Lowry (+4500) → 45× multiplier
- +10000 longshot → 100× multiplier

This means picking a bold outsider who delivers can beat picking the favourite.

---

## Customisation

- **Change entry fee**: Edit `ENTRY_FEE` in `src/data.js`
- **Add/remove players**: Edit the `PLAYERS` array in `src/data.js`
- **Change scoring**: Edit `BASE_POINTS` in `src/data.js`
- **Change admin password**: Edit `ADMIN_PASSWORD` in `src/components/AdminPage.js`

---

## Tech stack

- React (Create React App)
- Supabase (PostgreSQL + realtime subscriptions)
- Vercel (hosting)
- No other dependencies
