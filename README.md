# FinTrack - Expense Tracker

A full-stack expense tracker application with a modern glassmorphism UI, JWT authentication, charts, budget management, and more.

**Developed by Niharika Rao**

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite, Tailwind CSS, Recharts, Framer Motion |
| Backend | Node.js, Express, MongoDB, Mongoose |
| Auth | JWT, bcrypt |
| Icons | Lucide React |
| Charts | Recharts |

## Features

- **Authentication**: Signup, login, JWT tokens, password hashing
- **Dashboard**: Balance, income, expenses, savings, charts, AI insights
- **Expenses**: Full CRUD, categories, search, filters, pagination, CSV/PDF export
- **Income**: Track multiple income sources
- **Analytics**: Pie charts, bar charts, area charts, income vs expense comparison
- **Budgets**: Category-wise budget limits with progress tracking
- **Profile**: Edit name, currency, monthly budget, avatar upload
- **Settings**: Dark/light mode, language selection, notifications
- **UI**: Glassmorphism design, animations, responsive, mobile-friendly

## Project Structure

```
expense-tracker/
├── backend/
│   ├── config/          # Database config
│   ├── controllers/     # Route handlers
│   ├── middleware/       # Auth middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── utils/           # Seed data
│   ├── server.js        # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── context/     # Auth & Theme context
│   │   ├── hooks/       # Custom hooks
│   │   ├── utils/       # API & helpers
│   │   ├── App.jsx      # Router setup
│   │   └── main.jsx     # Entry point
│   ├── index.html
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the repository

```bash
git clone <repository-url>
cd expense-tracker
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRE=30d
NODE_ENV=development
```

### 3. Seed Demo Data (Optional)

```bash
node utils/seed.js
```

This creates a demo account: `demo@expense.com` / `demo123`

### 4. Start Backend

```bash
npm run dev
```

Server runs on `http://localhost:5000`

### 5. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

### 6. Open the app

Visit `http://localhost:5173` in your browser.

## MongoDB Setup

### Local MongoDB

1. Install MongoDB Community Server from mongodb.com
2. Start the MongoDB service
3. Use connection string: `mongodb://localhost:27017/expense-tracker`

### MongoDB Atlas (Cloud)

1. Create a free account at cloud.mongodb.com
2. Create a new cluster
3. Get your connection string
4. Replace `MONGODB_URI` in `.env` with your Atlas string

## API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user |
| PUT | /api/auth/profile | Update profile |
| PUT | /api/auth/avatar | Upload avatar |

### Expenses
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/expenses | Get all expenses (with filters) |
| POST | /api/expenses | Add expense |
| PUT | /api/expenses/:id | Update expense |
| DELETE | /api/expenses/:id | Delete expense |
| GET | /api/expenses/analytics | Get expense analytics |

### Income
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/income | Get all income |
| POST | /api/income | Add income |
| PUT | /api/income/:id | Update income |
| DELETE | /api/income/:id | Delete income |
| GET | /api/income/analytics | Get income analytics |

### Budgets
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/budgets | Get budgets for month |
| POST | /api/budgets | Set budget |
| DELETE | /api/budgets/:id | Delete budget |

### Export
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/export/csv | Export expenses CSV |
| GET | /api/export/pdf | Export expenses PDF |

## Deployment

### Backend (Render / Railway / Cyclic)

1. Push code to GitHub
2. Connect your repo to Render/Railway
3. Set environment variables (MONGODB_URI, JWT_SECRET, etc.)
4. Set build command: `cd backend && npm install`
5. Set start command: `cd backend && npm start`

### Frontend (Vercel / Netlify)

1. Push code to GitHub
2. Connect your repo to Vercel/Netlify
3. Set root directory to `frontend`
4. Set build command: `npm run build`
5. Set output directory: `dist`
6. Add environment variable: `VITE_API_URL=https://your-backend-url/api`

### Full Stack (Railway)

1. Create a Railway account
2. Deploy MongoDB service
3. Deploy backend service with env vars
4. Deploy frontend service
5. Configure proxy/routing

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/expense-tracker |
| JWT_SECRET | JWT signing secret | (required) |
| JWT_EXPIRE | Token expiration | 30d |
| NODE_ENV | Environment | development |

## License

MIT

---

**Developed by Niharika Rao**
