# 🚗 AutoElite — SecondHand Car Showroom Management System

A full-stack web application for managing a second-hand car showroom. Built with **React + Vite** (frontend), **Node.js + Express** (backend), and **MySQL** (database).

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Axios, React Router v6 |
| Backend | Node.js, Express.js |
| Database | MySQL 8+ |
| Auth | JWT + bcryptjs |
| Uploads | Multer (local storage) |

---

## 🗂️ Project Structure

```
car-showroom/
├── backend/
│   ├── config/
│   │   └── db.js              # MySQL connection pool
│   ├── controllers/
│   │   ├── authController.js  # Login, register, getMe
│   │   ├── carController.js   # CRUD for cars + image handling
│   │   └── inquiryController.js # Inquiry CRUD + stats
│   ├── middleware/
│   │   ├── auth.js            # JWT verification middleware
│   │   └── upload.js          # Multer file upload config
│   ├── routes/
│   │   ├── auth.js
│   │   ├── cars.js
│   │   └── inquiries.js
│   ├── scripts/
│   │   └── seedAdmin.js       # Seeds default admin user
│   ├── uploads/               # Car images stored here
│   ├── .env.example
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── CarCard.jsx
│   │   │   ├── CarForm.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── Navbar.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── public/
│   │   │   │   ├── HomePage.jsx
│   │   │   │   ├── CarDetailPage.jsx
│   │   │   │   └── InquiryPage.jsx
│   │   │   └── admin/
│   │   │       ├── AdminLoginPage.jsx
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── ManageCarsPage.jsx
│   │   │       ├── AddCarPage.jsx
│   │   │       ├── EditCarPage.jsx
│   │   │       └── ManageInquiriesPage.jsx
│   │   ├── utils/
│   │   │   ├── api.js         # Axios instance with interceptors
│   │   │   └── helpers.js     # formatPrice, formatKm etc.
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── database.sql               # Full MySQL schema + seed data
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- npm or yarn

---

### 1. Clone / Extract the Project

```bash
cd car-showroom
```

---

### 2. Setup the Database

Open your MySQL client (MySQL Workbench, TablePlus, or terminal):

```sql
-- In MySQL terminal or client:
source /path/to/car-showroom/database.sql;
```

Or via terminal:
```bash
mysql -u root -p < database.sql
```

This will:
- Create the `car_showroom` database
- Create all tables (users, cars, car_images, inquiries)
- Insert sample car data

---

### 3. Setup the Backend

```bash
cd backend
npm install
```

Create your `.env` file:
```bash
cp .env.example .env
```

Edit `.env` with your MySQL credentials:
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=car_showroom

JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:5173
```

**Seed the admin user** (this creates a properly hashed password):
```bash
node scripts/seedAdmin.js
```

Start the backend:
```bash
npm run dev     # Development (with nodemon)
# or
npm start       # Production
```

Backend runs at: `http://localhost:5000`

---

### 4. Setup the Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🔑 Default Admin Credentials

```
Email:    admin@carshowroom.com
Password: Admin@123
```

> **Important:** After running `node scripts/seedAdmin.js`, the admin password is properly bcrypt-hashed. The SQL file contains a placeholder hash — always run the seed script.

---

## 🌐 Application URLs

| URL | Description |
|-----|-------------|
| `http://localhost:5173` | Public car listing homepage |
| `http://localhost:5173/cars/:id` | Car detail page |
| `http://localhost:5173/inquiry/:carId` | Inquiry submission form |
| `http://localhost:5173/admin/login` | Admin login |
| `http://localhost:5173/admin` | Admin dashboard |
| `http://localhost:5173/admin/cars` | Manage all cars |
| `http://localhost:5173/admin/cars/add` | Add new car |
| `http://localhost:5173/admin/inquiries` | View all inquiries |

---

## 📡 API Documentation

### Base URL: `http://localhost:5000/api`

#### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/login` | ❌ | Admin login |
| POST | `/auth/register` | ❌ | Create admin user |
| GET | `/auth/me` | ✅ JWT | Get current user |

**Login Request:**
```json
{
  "email": "admin@carshowroom.com",
  "password": "Admin@123"
}
```

**Login Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": 1, "name": "Admin User", "email": "...", "role": "admin" }
}
```

---

#### Cars

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/cars` | ❌ | Get all cars (filterable) |
| GET | `/cars/:id` | ❌ | Get car by ID |
| GET | `/cars/meta/brands` | ❌ | Get all brands |
| POST | `/cars` | ✅ JWT | Add new car (multipart/form-data) |
| PUT | `/cars/:id` | ✅ JWT | Update car |
| DELETE | `/cars/:id` | ✅ JWT | Delete car |
| DELETE | `/cars/:id/images/:imageId` | ✅ JWT | Delete gallery image |

**GET /cars Query Parameters:**
```
?brand=Hyundai&fuel_type=Diesel&min_price=500000&max_price=1500000&year=2020&status=Available&search=creta
```

**POST /cars (multipart/form-data fields):**
```
title, brand, model, year, fuel_type, transmission, kilometers_driven,
number_of_owners, price, description, status, main_image (file), gallery_images[] (files)
```

---

#### Inquiries

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/inquiries` | ❌ | Submit inquiry |
| GET | `/inquiries` | ✅ JWT | Get all inquiries |
| GET | `/inquiries/stats` | ✅ JWT | Dashboard stats |
| PUT | `/inquiries/:id` | ✅ JWT | Update inquiry status |
| DELETE | `/inquiries/:id` | ✅ JWT | Delete inquiry |

**POST /inquiries Request:**
```json
{
  "car_id": 1,
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "city": "Mumbai",
  "message": "I'm interested in test driving this car."
}
```

---

## 🔒 Security Features

- JWT authentication for all admin routes
- Passwords hashed with bcryptjs (12 salt rounds)
- Input validation using express-validator
- CORS configured for frontend origin only
- File upload validation (type + size limit)
- SQL injection protection via parameterized queries

---

## 🖼️ Car Image Uploads

- Images stored in `backend/uploads/`
- Accessed via: `http://localhost:5000/uploads/<filename>`
- Supported formats: JPEG, JPG, PNG, WEBP
- Max file size: 5MB per image
- Up to 10 gallery images per car
- Images auto-deleted when a car is deleted

---

## 🛠️ Troubleshooting

**Database connection fails:**
- Check MySQL is running: `sudo service mysql start`
- Verify credentials in `.env` match your MySQL setup

**Admin login fails:**
- Make sure you ran `node scripts/seedAdmin.js` after DB setup
- Check `.env` `JWT_SECRET` is set

**Images not loading:**
- Ensure backend is running at port 5000
- Check Vite proxy config in `vite.config.js`

**Port already in use:**
- Change `PORT` in backend `.env`
- Change Vite port in `vite.config.js`

---

## 📝 Notes

- The frontend uses Vite's dev proxy so `/api` and `/uploads` requests are forwarded to the backend automatically in development.
- For production, configure a reverse proxy (nginx) to route API requests or update `VITE_API_URL` env variable.
- The `uploads/` folder is git-ignored by default. In production, consider using cloud storage (S3, Cloudinary).
