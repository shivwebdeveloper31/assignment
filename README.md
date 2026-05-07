# ReviewIQ — Product Ratings & Review Analytics Dashboard

A full-stack analytics dashboard for exploring product ratings, reviews, discount distribution, and category-level performance. Built with **React + MUI + Redux Toolkit** on the frontend and **Node.js + Express + PostgreSQL** on the backend.

---

## Project Structure

```
project/
├── backend/                   # Node.js + Express API
│   ├── src/
│   │   ├── controllers/
│   │   │   └── productsController.js   # All business logic
│   │   ├── db/
│   │   │   ├── pool.js                 # PostgreSQL connection pool
│   │   │   └── schema.js              # Auto-creates tables on startup
│   │   ├── middleware/
│   │   │   └── errorHandler.js        # Global error handler
│   │   ├── routes/
│   │   │   └── products.js            # All API routes
│   │   ├── utils/
│   │   │   └── fileParser.js          # CSV/Excel parsing & normalization
│   │   └── index.js                   # Express app entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/                  # React + MUI + Redux Toolkit
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── charts/
    │   │   │   ├── ProductsPerCategoryChart.jsx   # Bar chart
    │   │   │   ├── TopReviewedChart.jsx           # Bar chart
    │   │   │   ├── DiscountHistogram.jsx          # Histogram
    │   │   │   └── CategoryAvgRatingChart.jsx     # Bar chart
    │   │   ├── common/
    │   │   │   ├── ErrorBoundary.jsx
    │   │   │   └── PageHeader.jsx
    │   │   ├── dashboard/
    │   │   │   └── SummaryCards.jsx               # KPI cards
    │   │   ├── filters/
    │   │   │   └── FiltersBar.jsx                 # Search + category + rating filters
    │   │   ├── layout/
    │   │   │   └── Layout.jsx                     # Sidebar navigation
    │   │   ├── table/
    │   │   │   └── ProductsTable.jsx              # Paginated, sortable table
    │   │   └── upload/
    │   │       └── FileUpload.jsx                 # Drag-and-drop uploader
    │   ├── pages/
    │   │   ├── DashboardPage.jsx
    │   │   ├── AnalyticsPage.jsx
    │   │   ├── ProductsPage.jsx
    │   │   └── UploadPage.jsx
    │   ├── store/
    │   │   ├── index.js
    │   │   └── slices/
    │   │       ├── analyticsSlice.js
    │   │       ├── productsSlice.js
    │   │       └── uploadSlice.js
    │   ├── theme/
    │   │   └── index.js                           # MUI dark theme
    │   ├── utils/
    │   │   └── hooks.js                           # useDebouncedCallback
    │   ├── App.js
    │   └── index.js
    ├── .env.example
    └── package.json
```

---

## Prerequisites

- **Node.js** v18+
- **npm** v9+
- **PostgreSQL** v14+

---

## Setup & Run

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/review-analytics.git
cd review-analytics
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create your `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:

```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=review_analytics
DB_USER=postgres
DB_PASSWORD=your_password
NODE_ENV=development
```

Create the PostgreSQL database:

```sql
CREATE DATABASE review_analytics;
```

Start the backend:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:5000`.  
Database tables are created automatically on first start.

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create your `.env` file:

```bash
cp .env.example .env
```

The default `.env` points to localhost. If your backend runs elsewhere, update:

```
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm start
```

The app will open at `http://localhost:3000`.

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/products/import` | Upload CSV/Excel file |
| `GET`  | `/api/products` | List products (pagination, search, filter, sort) |
| `GET`  | `/api/products/categories` | Get all categories with counts |
| `GET`  | `/api/products/:id/reviews` | Get reviews for a product |
| `GET`  | `/api/products/analytics/summary` | KPI stats |
| `GET`  | `/api/products/analytics/products-per-category` | Bar chart data |
| `GET`  | `/api/products/analytics/top-reviewed` | Top rated products |
| `GET`  | `/api/products/analytics/discount-distribution` | Histogram buckets |
| `GET`  | `/api/products/analytics/category-avg-rating` | Avg rating per category |

### Query parameters for `GET /api/products`

| Param | Type | Description |
|-------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Rows per page (default: 20) |
| `search` | string | Search by product name |
| `category` | string | Filter by category |
| `minRating` | number | Minimum rating filter |
| `sortBy` | string | Column to sort by |
| `sortOrder` | `ASC`/`DESC` | Sort direction |

---

## Features

- **File Import** — Drag-and-drop CSV/Excel upload with import stats
- **Dashboard** — 5 KPI cards + 4 charts in a single view
- **Analytics Page** — Full-size charts: Products per Category, Top Reviewed, Discount Histogram, Category Avg Rating
- **Products Table** — Paginated, sortable, with search + category + rating filters
- **Dark Theme** — MUI dark theme with purple accent palette
- **Redux Toolkit** — All state managed via RTK slices and async thunks
- **Error Handling** — Error boundaries, inline error states, loading skeletons

---

## Deployment (Bonus)

### Backend → [Render](https://render.com)

1. Push code to GitHub
2. Create a new **Web Service** on Render, point to `backend/`
3. Set environment variables in Render dashboard
4. Add a **PostgreSQL** database on Render and copy the connection URL to `DATABASE_URL`

### Frontend → [Vercel](https://vercel.com)

1. Create a new project on Vercel, point to `frontend/`
2. Set `REACT_APP_API_URL` to your Render backend URL
3. Deploy

---

## Sample Dataset

The reference dataset uses Amazon product data with these columns:

```
product_id, product_name, category, discounted_price, actual_price,
discount_percentage, rating, rating_count, about_product,
user_id, user_name, review_id, review_title, review_content,
img_link, product_link
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, MUI v5, Redux Toolkit, Recharts, React Dropzone |
| Backend | Node.js, Express 4, Multer, XLSX |
| Database | PostgreSQL 14+ |
| State | Redux Toolkit (RTK Query pattern via createAsyncThunk) |
| Routing | React Router v6 |
