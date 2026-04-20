# ShopCRM - Indian Shop Management Platform

A modern CRM platform built for small Indian shops to manage customers, track udhaar (credit), inventory, and send payment reminders via WhatsApp.

## 🚀 Features

- **Customer Management** - Add, edit, delete customers with phone & WhatsApp numbers
- **Udhaar Tracking** - Track credit/loans given to customers (khata system)
- **Inventory Management** - Manage products with stock tracking
- **Transaction History** - Record purchases and payments
- **WhatsApp Integration** - Send payment reminders in Hindi/English
- **Mobile-First Design** - Optimized for low-end Android devices
- **Multi-payment Support** - Cash, UPI, Card, and other methods

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Routing**: React Router v7
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📦 Setup Instructions

### 1. Install Dependencies

```bash
cd shop-crm
npm install
```

### 2. Setup Supabase Database

1. Go to your Supabase dashboard: https://izuvofgrctwolddapzxi.supabase.co
2. Navigate to **SQL Editor**
3. Copy the contents of `SUPABASE_SCHEMA.sql`
4. Paste and run the SQL script
5. Verify tables are created in **Table Editor**

### 3. Environment Variables

The `.env` file is already configured with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://izuvofgrctwolddapzxi.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_IQYr6M3mlnNaBfy0ew-IxQ_xSAptJCZ
```

### 4. Run Development Server

```bash
npm run dev
```

The app will be available at http://localhost:3000

### 5. Build for Production

```bash
npm run build
npm run preview
```

## 📱 Pages

- **Dashboard** (`/`) - Overview with stats and quick actions
- **Customers** (`/customers`) - Manage customer database
- **Transactions** (`/transactions`) - Track purchases & payments (WIP)
- **Products** (`/products`) - Inventory management (WIP)
- **Settings** (`/settings`) - Shop configuration (WIP)

## 🚢 Deploy to Vercel

### Option 1: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

### Option 2: GitHub + Vercel Dashboard

1. Push code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO
   git push -u origin main
   ```

2. Go to https://vercel.com
3. Click **New Project**
4. Import your GitHub repository
5. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click **Deploy**

## 📋 Project Structure

```
shop-crm/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Sidebar.tsx
│   │   ├── Layout.tsx
│   │   ├── DashboardStats.tsx
│   │   ├── CustomerList.tsx
│   │   └── CustomerModal.tsx
│   ├── pages/           # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Customers.tsx
│   │   ├── Transactions.tsx
│   │   ├── Products.tsx
│   │   └── Settings.tsx
│   ├── lib/             # Utilities & API
│   │   ├── supabase.ts
│   │   └── api.ts
│   ├── types/           # TypeScript types
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env                 # Environment variables
├── SUPABASE_SCHEMA.sql  # Database schema
├── package.json
├── tailwind.config.js
├── vite.config.js
└── tsconfig.json
```

## 🔐 Security Notes

- The current setup uses the anon key for client-side operations
- Row Level Security (RLS) policies are enabled in Supabase
- For production, implement proper authentication
- Never commit the service role key to the frontend

## 🌟 Future Enhancements

- [ ] User Authentication (Supabase Auth)
- [ ] Multi-shop support
- [ ] GST Invoice generation
- [ ] SMS reminders
- [ ] Offline mode with PWA
- [ ] Reports & Analytics
- [ ] Barcode scanning
- [ ] Expense tracking
- [ ] Staff management

## 📝 License

MIT License - feel free to use for your projects!

## 🤝 Support

For issues or questions, create an issue in the repository.

---

Built with ❤️ for Indian shopkeepers
