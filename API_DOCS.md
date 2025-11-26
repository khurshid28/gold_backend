# Gold Backend API - Complete Documentation

## 📋 Mundarija / Table of Contents

1. [Loyiha haqida](#about)
2. [O'rnatish](#installation)
3. [Database Setup](#database)
4. [API Endpoints](#api-endpoints)
   - [Authentication](#authentication)
   - [Products](#products)
   - [Branches (Filiallar)](#branches)
   - [Applications (Arizalar)](#applications)
5. [Role-based Access](#roles)
6. [Xatoliklar](#errors)

---

## 🚀 Loyiha haqida {#about}

NestJS + Prisma + MySQL bilan yaratilgan REST API backend.

**Xususiyatlar:**
- ✅ JWT Bearer Token Authentication
- ✅ Phone Verification (OTP)
- ✅ Role-based Access (USER, ADMIN, SUPERADMIN)
- ✅ Products CRUD
- ✅ Branches Management
- ✅ Applications System

---

## 📦 O'rnatish {#installation}

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

Server: `http://localhost:3000` 🚀

---

## 🗄️ Database {#database}

`.env` faylni sozlang:

```env
DATABASE_URL="mysql://root:password@localhost:3306/gold_db"
JWT_SECRET="your-secret-key"
JWT_EXPIRATION="7d"
PORT=3000
```

---

## 🔌 API Endpoints {#api-endpoints}

Base URL: `http://localhost:3000`

---

## 🔐 Authentication {#authentication}

### 1. Register

`POST /auth/register`

**Request:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "phone": "+998901234567",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+998901234567",
    "role": "USER",
    "isVerified": false
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 2. Login

`POST /auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+998901234567",
    "role": "USER",
    "isVerified": false
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 3. Send OTP (Phone Verification)

`POST /auth/send-otp`

**Request:**
```json
{
  "phone": "+998901234567"
}
```

**Response:**
```json
{
  "message": "OTP sent successfully",
  "otp": "123456"
}
```

**Eslatma:** Production da `otp` ko'rsatilmasligi kerak, faqat SMS orqali yuboriladi.

---

### 4. Verify OTP

`POST /auth/verify-otp`

**Request:**
```json
{
  "phone": "+998901234567",
  "otp": "123456"
}
```

**Response:**
```json
{
  "message": "Phone verified successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+998901234567",
    "role": "USER",
    "isVerified": true
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 5. Get Profile (Protected)

`GET /auth/profile`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
{
  "message": "Profile retrieved successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+998901234567",
    "role": "USER",
    "isVerified": true
  }
}
```

---

## 📦 Products {#products}

**Hamma endpointlar JWT talab qiladi!**

### 1. Create Product

`POST /products`

**Request:**
```json
{
  "name": "iPhone 15 Pro",
  "description": "Latest smartphone",
  "price": 999.99,
  "stock": 50,
  "imageUrl": "https://example.com/image.jpg"
}
```

**Response:**
```json
{
  "message": "Product created successfully",
  "product": {
    "id": 1,
    "name": "iPhone 15 Pro",
    "description": "Latest smartphone",
    "price": 999.99,
    "stock": 50,
    "imageUrl": "https://example.com/image.jpg",
    "createdAt": "2025-11-26T10:00:00.000Z",
    "updatedAt": "2025-11-26T10:00:00.000Z"
  }
}
```

---

### 2. Get All Products

`GET /products`

**Response:**
```json
{
  "message": "Products retrieved successfully",
  "count": 2,
  "products": [...]
}
```

---

### 3. Get Single Product

`GET /products/:id`

---

### 4. Update Product

`PATCH /products/:id`

**Request:**
```json
{
  "price": 899.99,
  "stock": 45
}
```

---

### 5. Delete Product

`DELETE /products/:id`

---

## 🏢 Branches / Filiallar {#branches}

**Hamma endpointlar JWT talab qiladi!**

### 1. Create Branch

`POST /branches`

**Request:**
```json
{
  "name": "Toshkent Filiali",
  "address": "Amir Temur ko'chasi 123",
  "phone": "+998712345678",
  "city": "Toshkent",
  "region": "Toshkent viloyati",
  "managerId": 5,
  "isActive": true
}
```

**Response:**
```json
{
  "message": "Branch created successfully",
  "branch": {
    "id": 1,
    "name": "Toshkent Filiali",
    "address": "Amir Temur ko'chasi 123",
    "phone": "+998712345678",
    "city": "Toshkent",
    "region": "Toshkent viloyati",
    "managerId": 5,
    "manager": {
      "id": 5,
      "name": "Manager Name",
      "email": "manager@example.com"
    },
    "isActive": true,
    "createdAt": "2025-11-26T10:00:00.000Z",
    "updatedAt": "2025-11-26T10:00:00.000Z"
  }
}
```

---

### 2. Get All Branches

`GET /branches`

**Response:**
```json
{
  "message": "Branches retrieved successfully",
  "count": 3,
  "branches": [
    {
      "id": 1,
      "name": "Toshkent Filiali",
      "address": "Amir Temur ko'chasi 123",
      "phone": "+998712345678",
      "city": "Toshkent",
      "region": "Toshkent viloyati",
      "isActive": true,
      "manager": {
        "id": 5,
        "name": "Manager Name",
        "email": "manager@example.com"
      },
      "_count": {
        "applications": 15
      },
      "createdAt": "2025-11-26T10:00:00.000Z",
      "updatedAt": "2025-11-26T10:00:00.000Z"
    }
  ]
}
```

---

### 3. Get Single Branch

`GET /branches/:id`

**Response:**
```json
{
  "message": "Branch retrieved successfully",
  "branch": {
    "id": 1,
    "name": "Toshkent Filiali",
    "address": "Amir Temur ko'chasi 123",
    "phone": "+998712345678",
    "city": "Toshkent",
    "region": "Toshkent viloyati",
    "isActive": true,
    "manager": {
      "id": 5,
      "name": "Manager Name",
      "email": "manager@example.com",
      "phone": "+998901234567"
    },
    "applications": [...],
    "createdAt": "2025-11-26T10:00:00.000Z",
    "updatedAt": "2025-11-26T10:00:00.000Z"
  }
}
```

---

### 4. Update Branch

`PATCH /branches/:id`

**Request:**
```json
{
  "isActive": false,
  "managerId": 8
}
```

---

### 5. Delete Branch

`DELETE /branches/:id`

---

## 📝 Applications / Arizalar {#applications}

**Hamma endpointlar JWT talab qiladi!**

### 1. Create Application

`POST /applications`

**Request:**
```json
{
  "title": "Mahsulot buyurtmasi",
  "description": "100 ta iPhone 15 Pro kerak",
  "branchId": 1,
  "amount": 99999.99,
  "notes": "Tez yetkazib bering"
}
```

**Response:**
```json
{
  "message": "Application created successfully",
  "application": {
    "id": 1,
    "userId": 2,
    "user": {
      "id": 2,
      "name": "John Doe",
      "email": "user@example.com",
      "phone": "+998901234567"
    },
    "branchId": 1,
    "branch": {
      "id": 1,
      "name": "Toshkent Filiali",
      "city": "Toshkent"
    },
    "title": "Mahsulot buyurtmasi",
    "description": "100 ta iPhone 15 Pro kerak",
    "status": "PENDING",
    "amount": 99999.99,
    "notes": "Tez yetkazib bering",
    "createdAt": "2025-11-26T10:00:00.000Z",
    "updatedAt": "2025-11-26T10:00:00.000Z"
  }
}
```

---

### 2. Get All Applications

`GET /applications`

**Role-based:**
- **USER**: Faqat o'z arizalarini ko'radi
- **ADMIN/SUPERADMIN**: Barcha arizalarni ko'radi

**Response:**
```json
{
  "message": "Applications retrieved successfully",
  "count": 5,
  "applications": [
    {
      "id": 1,
      "userId": 2,
      "user": {
        "id": 2,
        "name": "John Doe",
        "email": "user@example.com",
        "phone": "+998901234567"
      },
      "branchId": 1,
      "branch": {
        "id": 1,
        "name": "Toshkent Filiali",
        "city": "Toshkent"
      },
      "title": "Mahsulot buyurtmasi",
      "description": "100 ta iPhone 15 Pro kerak",
      "status": "PENDING",
      "amount": 99999.99,
      "notes": "Tez yetkazib bering",
      "createdAt": "2025-11-26T10:00:00.000Z",
      "updatedAt": "2025-11-26T10:00:00.000Z"
    }
  ]
}
```

---

### 3. Get Single Application

`GET /applications/:id`

**Permission:**
- USER: Faqat o'z arizasini ko'ra oladi
- ADMIN/SUPERADMIN: Barcha arizalarni ko'ra oladi

---

### 4. Update Application

`PATCH /applications/:id`

**Request:**
```json
{
  "status": "APPROVED",
  "notes": "Tasdiqlandi, yetkazilmoqda"
}
```

**Permission:**
- **USER**: Faqat `PENDING` statusdagi o'z arizasini o'zgartira oladi, `status` ni o'zgartira olmaydi
- **ADMIN/SUPERADMIN**: Barcha arizalarni va statusni o'zgartira oladi

**Application Statuslari:**
- `PENDING` - Kutilmoqda
- `PROCESSING` - Jarayonda
- `APPROVED` - Tasdiqlangan
- `REJECTED` - Rad etilgan
- `COMPLETED` - Yakunlangan

---

### 5. Delete Application

`DELETE /applications/:id`

**Permission:**
- **USER**: Faqat `PENDING` statusdagi o'z arizasini o'chira oladi
- **ADMIN/SUPERADMIN**: Istalgan arizani o'chira oladi

---

## 👥 Role-based Access {#roles}

**User Rollari:**

1. **USER** (Default)
   - O'z profilini ko'rish
   - Mahsulotlarni ko'rish
   - Filiallarni ko'rish
   - O'z arizalarini yaratish/ko'rish
   - Pending arizalarini tahrirlash/o'chirish

2. **ADMIN**
   - Barcha USER huquqlari
   - Barcha arizalarni ko'rish va boshqarish
   - Arizalar statusini o'zgartirish
   - Mahsulotlarni boshqarish

3. **SUPERADMIN**
   - Barcha huquqlar
   - Filiallarni yaratish/o'zgartirish/o'chirish
   - Userlarni boshqarish
   - Barcha tizim sozlamalari

**Role qo'shish:**
```sql
UPDATE users SET role = 'SUPERADMIN' WHERE email = 'admin@example.com';
```

---

## ⚠️ Xatoliklar {#errors}

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "You can only view your own applications"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Application with ID 999 not found"
}
```

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "OTP expired"
}
```

---

## 🧪 Test qilish

### 1. Register va Token olish
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","name":"Test","phone":"+998901234567","password":"test123"}'
```

### 2. OTP yuborish
```bash
curl -X POST http://localhost:3000/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"+998901234567"}'
```

### 3. OTP tasdiqlash
```bash
curl -X POST http://localhost:3000/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"+998901234567","otp":"123456"}'
```

### 4. Ariza yaratish
```bash
curl -X POST http://localhost:3000/applications \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test ariza","description":"Test","amount":1000}'
```

---

## 📁 Loyiha Strukturasi

```
gold_backend/
├── prisma/
│   └── schema.prisma (User, Product, Branch, Application models)
├── src/
│   ├── auth/ (JWT, OTP verification)
│   ├── products/
│   ├── branches/
│   ├── applications/
│   ├── prisma/
│   └── main.ts
└── .env
```

---

## 🎉 Tayyor!

Barcha API endpointlar ishlayapti va role-based access control sozlangan.

**Savollar:** https://docs.nestjs.com | https://www.prisma.io/docs

**Muvaffaqiyatlar! 🚀**
