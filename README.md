# AuraCentra Ghana - National Verified Business Directory & Marketplace

A modern, high-performance verified business directory and commerce hub built for Ghana. Powered by React, Vite, Tailwind CSS, Supabase (PostgreSQL, Auth & Realtime), and Express API on Vercel Serverless.

---

## 🚀 Quick Start & Local Development

### 1. Clone the repository
```bash
git clone https://github.com/your-username/auracentra-ghana.git
cd auracentra-ghana
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory (copy from `.env.example`):
```bash
cp .env.example .env
```

Add your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

### 4. Start Development Server
```bash
npm run dev
```
The app will run locally on `http://localhost:3000`.

---

## 🗄️ Supabase Database Setup

1. Log in to [Supabase](https://supabase.com) and create a new project.
2. Go to **SQL Editor** -> **New Query**.
3. Copy the entire contents of `supabase_schema.sql` and run it.
4. Go to **Project Settings** -> **API** to retrieve your:
   - `Project URL` (`VITE_SUPABASE_URL`)
   - `anon public` key (`VITE_SUPABASE_ANON_KEY`)

---

## 🌐 Deploying to Vercel

1. Push this repository to **GitHub**.
2. Go to [Vercel](https://vercel.com) and click **"Add New..."** -> **"Project"**.
3. Select your GitHub repository.
4. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL`: Your Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key
   - *(Optional for transactional email)*: `RESEND_API_KEY`, `BREVO_API_KEY`, or `SMTP_*`
5. Click **Deploy**. Vercel will automatically build the client and handle the serverless API routes.

---

## 📁 Repository Structure

```
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
├── vercel.json             # Vercel routing and serverless build configuration
├── package.json            # Scripts & project dependencies
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite frontend configuration
├── server.ts               # Express backend API & mail handlers
├── supabase_schema.sql     # Complete PostgreSQL database schema with RLS
├── api/
│   └── index.ts            # Vercel serverless function entry point
├── public/                 # Static public assets and icons
└── src/
    ├── main.tsx            # App root entry
    ├── App.tsx             # Main application component & routing
    ├── types.ts            # TypeScript domain interfaces
    ├── components/         # UI components & modals
    ├── data/               # Default directory datasets
    ├── lib/
    │   └── supabase.ts     # Supabase client & real-time sync service
    ├── services/           # DB synchronization, Auth, and API clients
    └── utils/              # Local storage, verification & search helpers
```

---

## 🛠️ Build & Scripts

- `npm run dev`: Starts local full-stack dev server
- `npm run build`: Compiles production frontend bundle into `dist/`
- `npm run lint`: Runs TypeScript validation checks
