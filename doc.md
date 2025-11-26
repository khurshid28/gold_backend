# Gold Backend API Documentation

## 📋 Mundarija / Table of Contents

1. [Loyiha haqida / About Project](#about)
2. [O'rnatish / Installation](#installation)
3. [Konfiguratsiya / Configuration](#configuration)
4. [Ma'lumotlar bazasi / Database Setup](#database)
5. [Serverni ishga tushirish / Running the Server](#running)
6. [API Endpoints](#api-endpoints)
   - [Authentication](#authentication)
   - [Products](#products)
   - [Branches / Filiallar](#branches)
   - [Applications / Arizalar](#applications)
7. [Role-based Access](#roles)
8. [Test qilish / Testing](#testing)

---

## 🚀 About Project {#about}

Bu loyiha NestJS, Prisma ORM va JWT authentication yordamida yaratilgan REST API backend service hisoblanadi. MySQL ma'lumotlar bazasi ishlatilgan.

**Asosiy xususiyatlar:**
- ✅ JWT Bearer Token Authentication
- ✅ User Registration & Login
- ✅ Phone Verification with OTP (6-digit code)
- ✅ Role-based Access Control (USER, ADMIN, SUPERADMIN)
- ✅ Product CRUD operatsiyalari
- ✅ Branch/Filial Management
- ✅ Application/Ariza Management
- ✅ Prisma ORM bilan MySQL integratsiyasi
- ✅ TypeScript ishlatilgan
- ✅ Validation va Error Handling

---

## 📦 Installation {#installation}

### Talablar / Requirements:
- Node.js v18+ o'rnatilgan bo'lishi kerak
- PostgreSQL database o'rnatilgan bo'lishi kerak
- npm yoki yarn package manager

### 1. Dependencylarni o'rnatish:

```bash
npm install
```

---

## ⚙️ Configuration {#configuration}

### `.env` fayl sozlash:

Loyihangizda `.env` fayl mavjud. Quyidagi parametrlarni o'zgartiring:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/gold_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRATION="7d"
PORT=3000
```

**Muhim:**
- `username` va `password` ni o'z PostgreSQL ma'lumotlaringizga almashtiring
- `JWT_SECRET` ni kuchli maxfiy kalit bilan almashtiring
- `gold_db` - bu ma'lumotlar bazasi nomi (o'zingiznikini yozing)

---

## 🗄️ Database Setup {#database}

### 1. PostgreSQL databaseni yaratish:

```bash
# PostgreSQL ga kiring
psql -U postgres

# Database yaratish
CREATE DATABASE gold_db;

# Chiqish
\q
```

### 2. Prisma migratsiya qilish:

```bash
# Prisma Client generatsiya qilish
npx prisma generate

# Database migratsiya
npx prisma migrate dev --name init

# Prisma Studio ochish (ixtiyoriy - ma'lumotlarni ko'rish uchun)
npx prisma studio
```

---

## 🏃 Running the Server {#running}

### Development mode:

```bash
npm run start:dev
```

### Production mode:

```bash
npm run build
npm run start:prod
```

Server muvaffaqiyatli ishga tushgandan so'ng:
```
🚀 Application is running on: http://localhost:3000
```

---

## 🔌 API Endpoints {#api-endpoints}

Base URL: `http://localhost:3000`

---

## 🔐 Authentication {#authentication}

### 1. Ro'yxatdan o'tish / Register

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Curl Example:**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"user@example.com\",\"name\":\"John Doe\",\"password\":\"password123\"}"
```

---

### 2. Tizimga kirish / Login

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Curl Example:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"user@example.com\",\"password\":\"password123\"}"
```

---

### 3. Profil olish / Get Profile

**Endpoint:** `GET /auth/profile`

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200 OK):**
```json
{
  "message": "Profile retrieved successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Curl Example:**
```bash
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 📦 Products {#products}

**Eslatma:** Barcha product endpointlari JWT authentication talab qiladi!

### 1. Mahsulot yaratish / Create Product

**Endpoint:** `POST /products`

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "iPhone 15 Pro",
  "description": "Latest Apple smartphone with A17 Pro chip",
  "price": 999.99,
  "stock": 50,
  "imageUrl": "https://example.com/iphone15.jpg"
}
```

**Response (201 Created):**
```json
{
  "message": "Product created successfully",
  "product": {
    "id": 1,
    "name": "iPhone 15 Pro",
    "description": "Latest Apple smartphone with A17 Pro chip",
    "price": 999.99,
    "stock": 50,
    "imageUrl": "https://example.com/iphone15.jpg",
    "createdAt": "2025-11-26T10:00:00.000Z",
    "updatedAt": "2025-11-26T10:00:00.000Z"
  }
}
```

**Curl Example:**
```bash
curl -X POST http://localhost:3000/products \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"iPhone 15 Pro\",\"description\":\"Latest Apple smartphone\",\"price\":999.99,\"stock\":50}"
```

---

### 2. Barcha mahsulotlarni olish / Get All Products

**Endpoint:** `GET /products`

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200 OK):**
```json
{
  "message": "Products retrieved successfully",
  "count": 2,
  "products": [
    {
      "id": 1,
      "name": "iPhone 15 Pro",
      "description": "Latest Apple smartphone",
      "price": 999.99,
      "stock": 50,
      "imageUrl": "https://example.com/iphone15.jpg",
      "createdAt": "2025-11-26T10:00:00.000Z",
      "updatedAt": "2025-11-26T10:00:00.000Z"
    },
    {
      "id": 2,
      "name": "MacBook Pro",
      "description": "Powerful laptop",
      "price": 2499.99,
      "stock": 30,
      "imageUrl": "https://example.com/macbook.jpg",
      "createdAt": "2025-11-26T10:05:00.000Z",
      "updatedAt": "2025-11-26T10:05:00.000Z"
    }
  ]
}
```

**Curl Example:**
```bash
curl -X GET http://localhost:3000/products \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 3. Bitta mahsulotni olish / Get Single Product

**Endpoint:** `GET /products/:id`

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200 OK):**
```json
{
  "message": "Product retrieved successfully",
  "product": {
    "id": 1,
    "name": "iPhone 15 Pro",
    "description": "Latest Apple smartphone",
    "price": 999.99,
    "stock": 50,
    "imageUrl": "https://example.com/iphone15.jpg",
    "createdAt": "2025-11-26T10:00:00.000Z",
    "updatedAt": "2025-11-26T10:00:00.000Z"
  }
}
```

**Curl Example:**
```bash
curl -X GET http://localhost:3000/products/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 4. Mahsulotni yangilash / Update Product

**Endpoint:** `PATCH /products/:id`

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

**Request Body (barcha fieldlar ixtiyoriy):**
```json
{
  "price": 899.99,
  "stock": 45
}
```

**Response (200 OK):**
```json
{
  "message": "Product updated successfully",
  "product": {
    "id": 1,
    "name": "iPhone 15 Pro",
    "description": "Latest Apple smartphone",
    "price": 899.99,
    "stock": 45,
    "imageUrl": "https://example.com/iphone15.jpg",
    "createdAt": "2025-11-26T10:00:00.000Z",
    "updatedAt": "2025-11-26T11:00:00.000Z"
  }
}
```

**Curl Example:**
```bash
curl -X PATCH http://localhost:3000/products/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"price\":899.99,\"stock\":45}"
```

---

### 5. Mahsulotni o'chirish / Delete Product

**Endpoint:** `DELETE /products/:id`

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200 OK):**
```json
{
  "message": "Product deleted successfully"
}
```

**Curl Example:**
```bash
curl -X DELETE http://localhost:3000/products/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🧪 Testing {#testing}

### Postman yoki Thunder Client ishlatish:

1. **Register qiling va token oling:**
   - `POST /auth/register` endpointiga so'rov yuboring
   - Javobdan `access_token` ni nusxa oling

2. **Token bilan ishlang:**
   - Har bir protected endpoint uchun `Authorization` headeriga token qo'shing
   - Format: `Bearer YOUR_ACCESS_TOKEN`

3. **Productlar bilan ishlash:**
   - Tokenni qo'shganingizdan so'ng barcha product endpointlarini test qiling

### API test ketma-ketligi:

```bash
# 1. Register
POST /auth/register

# 2. Login (agar kerak bo'lsa)
POST /auth/login

# 3. Profile tekshirish
GET /auth/profile

# 4. Product yaratish
POST /products

# 5. Barcha productlarni ko'rish
GET /products

# 6. Bitta productni ko'rish
GET /products/1

# 7. Productni yangilash
PATCH /products/1

# 8. Productni o'chirish
DELETE /products/1
```

---

## 🛡️ Bearer Token qanday ishlaydi?

1. **Login yoki Register qilganingizda** sizga `access_token` beriladi
2. **Bu tokenni saqlab qoying** (masalan, localStorage yoki cookie da)
3. **Har bir so'rovda** tokenni `Authorization` headeriga qo'shing:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. Server tokenni tekshiradi va sizni autentifikatsiya qiladi

---

## ⚠️ Xatoliklar / Error Responses

### 401 Unauthorized (Token yo'q yoki noto'g'ri):
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 404 Not Found (Mahsulot topilmadi):
```json
{
  "statusCode": 404,
  "message": "Product with ID 999 not found"
}
```

### 400 Bad Request (Validatsiya xatosi):
```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request"
}
```

---

## 📁 Loyiha strukturasi / Project Structure

```
gold_backend/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── auth/
│   │   ├── dto/               # Data Transfer Objects
│   │   ├── auth.controller.ts # Auth endpoints
│   │   ├── auth.service.ts    # Auth business logic
│   │   ├── auth.module.ts     # Auth module
│   │   ├── jwt.strategy.ts    # JWT strategy
│   │   └── jwt-auth.guard.ts  # JWT guard
│   ├── products/
│   │   ├── dto/               # Product DTOs
│   │   ├── products.controller.ts
│   │   ├── products.service.ts
│   │   └── products.module.ts
│   ├── prisma/
│   │   ├── prisma.service.ts  # Prisma client
│   │   └── prisma.module.ts
│   ├── app.module.ts          # Root module
│   └── main.ts                # Entry point
├── .env                       # Environment variables
├── package.json
├── tsconfig.json
└── nest-cli.json
```

---

## 🎉 Tayyor!

Endi sizning backend serviceingiz tayyor. Barcha endpointlar ishlaydi va Bearer Token authentication sozlangan.

**Savollar yoki muammolar bo'lsa:**
- Prisma documentation: https://www.prisma.io/docs
- NestJS documentation: https://docs.nestjs.com
- JWT documentation: https://jwt.io

**Muvaffaqiyatlar! 🚀**

---

## Database Schema (Prisma)

```prisma
// schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ============================================
// ADMIN & ROLES
// ============================================

// Admin foydalanuvchilar
model Admin {
  id          String     @id @default(uuid())
  email       String     @unique
  password    String     // Hashed
  name        String
  role        AdminRole  @default(BRANCH_ADMIN)
  
  // Branch admin uchun
  branchId    String?
  branch      Branch?    @relation(fields: [branchId], references: [id])
  
  isActive    Boolean    @default(true)
  lastLoginAt DateTime?
  
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  
  // Activity logs
  activityLogs AdminActivityLog[]
  
  @@index([email])
  @@index([branchId])
}

enum AdminRole {
  SUPER_ADMIN      // Full system access
  BRANCH_ADMIN     // Specific branch access
  MANAGER          // View only + reports
  SUPPORT          // Handle user issues
}

// Admin activity logs
model AdminActivityLog {
  id        String   @id @default(uuid())
  adminId   String
  admin     Admin    @relation(fields: [adminId], references: [id])
  action    String   // CREATE_PRODUCT, UPDATE_ORDER, etc.
  entity    String   // Product, Order, User
  entityId  String?
  details   Json?    // Additional details
  ipAddress String?
  createdAt DateTime @default(now())
  
  @@index([adminId, createdAt])
}

// ============================================
// BRANCHES & LOCATIONS
// ============================================
model Branch {
  id        String   @id @default(uuid())
  name      String
  address   String
  phone     String
  latitude  Float?
  longitude Float?
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  products  Product[]
  orders    Order[]
  admins    Admin[]  // Branch adminlar
  requests  UserVerificationRequest[]
  
  @@index([isActive])
}

// Foydalanuvchilar
model User {
  id                String    @id @default(uuid())
  phoneNumber       String    @unique
  name              String?
  dateOfBirth       DateTime?
  passportSeries    String?
  passportNumber    String?
  pinfl             String?   @unique
  
  // Verification
  isVerified        Boolean   @default(false)
  faceImageUrl      String?
  passportImageUrl  String?
  verifiedAt        DateTime?
  
  // Credit limit
  creditLimit       Float?
  usedLimit         Float     @default(0)
  limitExpiryDate   DateTime?
  
  // Auth
  refreshToken      String?
  lastLoginAt       DateTime?
  
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  favorites         Favorite[]
  cartItems         CartItem[]
  orders            Order[]
  verificationRequests UserVerificationRequest[]
  
  @@index([phoneNumber])
  @@index([pinfl])
}

// User verification requests (ariza)
model UserVerificationRequest {
  id               String                @id @default(uuid())
  userId           String
  user             User                  @relation(fields: [userId], references: [id])
  
  branchId         String
  branch           Branch                @relation(fields: [branchId], references: [id])
  
  name             String
  dateOfBirth      DateTime
  passportSeries   String
  passportNumber   String
  pinfl            String
  faceImageUrl     String
  passportImageUrl String
  
  requestedLimit   Float                 @default(20000000) // 20M
  status           VerificationStatus    @default(PENDING)
  
  // Admin review
  reviewedBy       String?
  reviewedAt       DateTime?
  reviewNotes      String?
  approvedLimit    Float?
  
  createdAt        DateTime              @default(now())
  updatedAt        DateTime              @updatedAt
  
  @@index([userId, status])
  @@index([branchId, status])
  @@index([status])
}

enum VerificationStatus {
  PENDING
  APPROVED
  REJECTED
  MORE_INFO_NEEDED
}

// Kategoriyalar
model Category {
  id          String    @id @default(uuid())
  name        String
  nameUz      String
  nameRu      String
  icon        String?
  sortOrder   Int       @default(0)
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  products    Product[]
}

// Mahsulotlar
model Product {
  id          String   @id @default(uuid())
  name        String
  nameUz      String
  nameRu      String
  description String?
  descriptionUz String?
  descriptionRu String?
  
  price       Float
  discount    Float?   @default(0)
  
  material    String
  weight      Float
  
  images      String[] // Array of image URLs
  
  inStock     Boolean  @default(true)
  stockQuantity Int    @default(0)
  
  rating      Float    @default(0)
  reviewCount Int      @default(0)
  
  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id])
  
  branchId    String
  branch      Branch   @relation(fields: [branchId], references: [id])
  
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  favorites   Favorite[]
  cartItems   CartItem[]
  orderItems  OrderItem[]
}

// Sevimlilar
model Favorite {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  
  @@unique([userId, productId])
}

// Savat
model CartItem {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  quantity  Int      @default(1)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@unique([userId, productId])
}

// Buyurtmalar
model Order {
  id              String      @id @default(uuid())
  orderNumber     String      @unique
  
  userId          String
  user            User        @relation(fields: [userId], references: [id])
  
  branchId        String
  branch          Branch      @relation(fields: [branchId], references: [id])
  
  totalAmount     Float
  
  // Installment details
  isInstallment   Boolean     @default(false)
  monthlyPayment  Float?
  totalMonths     Int?
  paidMonths      Int         @default(0)
  remainingAmount Float?
  nextPaymentDate DateTime?
  interestRate    Float?
  
  status          OrderStatus @default(PENDING)
  
  deliveryAddress String?
  deliveryPhone   String?
  notes           String?
  
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  
  items           OrderItem[]
  payments        Payment[]
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PROCESSING
  DELIVERED
  CANCELLED
}

// Buyurtma mahsulotlari
model OrderItem {
  id        String  @id @default(uuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId String
  product   Product @relation(fields: [productId], references: [id])
  quantity  Int
  price     Float   // Price at time of order
  
  createdAt DateTime @default(now())
}

// To'lovlar
model Payment {
  id            String        @id @default(uuid())
  orderId       String
  order         Order         @relation(fields: [orderId], references: [id])
  amount        Float
  paymentDate   DateTime
  paymentMethod PaymentMethod @default(CASH)
  status        PaymentStatus @default(PENDING)
  transactionId String?
  notes         String?
  
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}

enum PaymentMethod {
  CASH
  CARD
  BANK_TRANSFER
  CLICK
  PAYME
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}

// OTP codes
model OtpCode {
  id          String   @id @default(uuid())
  phoneNumber String
  code        String
  expiresAt   DateTime
  isUsed      Boolean  @default(false)
  createdAt   DateTime @default(now())
  
  @@index([phoneNumber, code])
}
```

---

## API Endpoints

### 1. Authentication (`/api/auth`)

#### POST `/api/auth/send-otp`
Send OTP code to phone number
```typescript
Request Body:
{
  phoneNumber: string // +998901234567
}

Response:
{
  success: boolean
  message: string
}
```

#### POST `/api/auth/verify-otp`
Verify OTP and login/register
```typescript
Request Body:
{
  phoneNumber: string
  code: string // 6-digit code
}

Response:
{
  accessToken: string
  refreshToken: string
  user: {
    id: string
    phoneNumber: string
    name: string | null
    isVerified: boolean
    creditLimit: number | null
    usedLimit: number
    limitExpiryDate: string | null
  }
}
```

#### POST `/api/auth/refresh`
Refresh access token
```typescript
Request Body:
{
  refreshToken: string
}

Response:
{
  accessToken: string
  refreshToken: string
}
```

#### POST `/api/auth/logout`
Logout user (requires auth)
```typescript
Headers:
Authorization: Bearer {accessToken}

Response:
{
  success: boolean
}
```

---

### 2. User Profile (`/api/users`)

#### GET `/api/users/me`
Get current user profile
```typescript
Headers:
Authorization: Bearer {accessToken}

Response:
{
  id: string
  phoneNumber: string
  name: string | null
  dateOfBirth: string | null
  passportSeries: string | null
  passportNumber: string | null
  isVerified: boolean
  faceImageUrl: string | null
  creditLimit: number | null
  usedLimit: number
  availableLimit: number
  limitExpiryDate: string | null
}
```

#### PUT `/api/users/me`
Update user profile
```typescript
Headers:
Authorization: Bearer {accessToken}

Request Body:
{
  name?: string
  dateOfBirth?: string // ISO date
}

Response: User object
```

#### POST `/api/users/verify-identity`
Submit identity verification (Face + Passport)
```typescript
Headers:
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data

Request Body (FormData):
{
  faceImage: File
  passportImage: File
  passportSeries: string
  passportNumber: string
  pinfl: string
  dateOfBirth: string
}

Response:
{
  success: boolean
  message: string
  isVerified: boolean
}
```

#### POST `/api/users/request-credit-limit`
Request credit limit (requires verification)
```typescript
Headers:
Authorization: Bearer {accessToken}

Request Body:
{
  requestedAmount: number // Should be 20000000 (20M)
}

Response:
{
  creditLimit: number
  limitExpiryDate: string
  message: string
}
```

---

### 3. Branches (`/api/branches`)

#### GET `/api/branches`
Get all active branches
```typescript
Query Params:
- page?: number (default: 1)
- limit?: number (default: 10)

Response:
{
  data: [
    {
      id: string
      name: string
      address: string
      phone: string
      latitude: number | null
      longitude: number | null
    }
  ],
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
```

#### GET `/api/branches/:id`
Get branch by ID
```typescript
Response: Branch object with products count
```

---

### 4. Categories (`/api/categories`)

#### GET `/api/categories`
Get all active categories
```typescript
Query Params:
- lang?: 'uz' | 'ru' (default: 'uz')

Response:
{
  data: [
    {
      id: string
      name: string
      icon: string | null
      productsCount: number
    }
  ]
}
```

---

### 5. Products (`/api/products`)

#### GET `/api/products`
Get products with filters
```typescript
Query Params:
- page?: number (default: 1)
- limit?: number (default: 20)
- categoryId?: string
- branchId?: string
- search?: string
- minPrice?: number
- maxPrice?: number
- sortBy?: 'price' | 'rating' | 'newest'
- sortOrder?: 'asc' | 'desc'
- lang?: 'uz' | 'ru'

Response:
{
  data: [
    {
      id: string
      name: string
      description: string
      price: number
      discount: number
      finalPrice: number
      material: string
      weight: number
      images: string[]
      inStock: boolean
      rating: number
      reviewCount: number
      category: {
        id: string
        name: string
      }
      branch: {
        id: string
        name: string
      }
    }
  ],
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
```

#### GET `/api/products/:id`
Get product by ID
```typescript
Response: Full product object
```

---

### 6. Favorites (`/api/favorites`)

#### GET `/api/favorites`
Get user favorites (requires auth)
```typescript
Headers:
Authorization: Bearer {accessToken}

Query Params:
- page?: number
- limit?: number

Response:
{
  data: [
    {
      id: string
      productId: string
      product: Product object
      createdAt: string
    }
  ],
  meta: { ... }
}
```

#### POST `/api/favorites`
Add to favorites
```typescript
Headers:
Authorization: Bearer {accessToken}

Request Body:
{
  productId: string
}

Response:
{
  id: string
  productId: string
  createdAt: string
}
```

#### DELETE `/api/favorites/:productId`
Remove from favorites
```typescript
Headers:
Authorization: Bearer {accessToken}

Response:
{
  success: boolean
}
```

#### GET `/api/favorites/check/:productId`
Check if product is favorited
```typescript
Headers:
Authorization: Bearer {accessToken}

Response:
{
  isFavorite: boolean
}
```

---

### 7. Cart (`/api/cart`)

#### GET `/api/cart`
Get user cart
```typescript
Headers:
Authorization: Bearer {accessToken}

Response:
{
  items: [
    {
      id: string
      productId: string
      quantity: number
      product: Product object
    }
  ],
  totalItems: number
  totalPrice: number
}
```

#### POST `/api/cart`
Add item to cart
```typescript
Headers:
Authorization: Bearer {accessToken}

Request Body:
{
  productId: string
  quantity: number
}

Response: CartItem object
```

#### PUT `/api/cart/:itemId`
Update cart item quantity
```typescript
Headers:
Authorization: Bearer {accessToken}

Request Body:
{
  quantity: number
}

Response: CartItem object
```

#### DELETE `/api/cart/:itemId`
Remove item from cart
```typescript
Headers:
Authorization: Bearer {accessToken}

Response:
{
  success: boolean
}
```

#### DELETE `/api/cart`
Clear cart
```typescript
Headers:
Authorization: Bearer {accessToken}

Response:
{
  success: boolean
}
```

---

### 8. Orders (`/api/orders`)

#### POST `/api/orders`
Create order (installment purchase)
```typescript
Headers:
Authorization: Bearer {accessToken}

Request Body:
{
  branchId: string
  items: [
    {
      productId: string
      quantity: number
    }
  ]
  installmentDetails: {
    totalMonths: number // 3-48
    monthlyPayment: number
    interestRate: number
  }
  deliveryAddress?: string
  deliveryPhone?: string
  notes?: string
}

Response:
{
  id: string
  orderNumber: string
  totalAmount: number
  monthlyPayment: number
  totalMonths: number
  nextPaymentDate: string
  status: string
  items: OrderItem[]
}
```

#### GET `/api/orders`
Get user orders (purchases)
```typescript
Headers:
Authorization: Bearer {accessToken}

Query Params:
- page?: number
- limit?: number
- status?: OrderStatus

Response:
{
  data: [
    {
      id: string
      orderNumber: string
      totalAmount: number
      isInstallment: boolean
      monthlyPayment: number
      totalMonths: number
      paidMonths: number
      remainingAmount: number
      nextPaymentDate: string
      status: string
      items: [{
        product: Product object
        quantity: number
        price: number
      }]
      createdAt: string
    }
  ],
  meta: { ... }
}
```

#### GET `/api/orders/:id`
Get order details
```typescript
Headers:
Authorization: Bearer {accessToken}

Response: Full order object with items and payments
```

#### GET `/api/orders/:id/payment-schedule`
Get payment schedule for order
```typescript
Headers:
Authorization: Bearer {accessToken}

Response:
{
  totalMonths: number
  paidMonths: number
  monthlyPayment: number
  schedule: [
    {
      monthNumber: number
      dueDate: string // 15th of each month
      amount: number
      isPaid: boolean
      paidAt: string | null
    }
  ]
}
```

---

### 9. Payments (`/api/payments`)

#### POST `/api/payments`
Make payment for order
```typescript
Headers:
Authorization: Bearer {accessToken}

Request Body:
{
  orderId: string
  amount: number
  paymentMethod: 'CASH' | 'CARD' | 'CLICK' | 'PAYME'
  transactionId?: string
}

Response:
{
  id: string
  amount: number
  status: string
  paymentDate: string
}
```

#### GET `/api/payments/order/:orderId`
Get payments for order
```typescript
Headers:
Authorization: Bearer {accessToken}

Response:
{
  data: Payment[]
}
```

---

## NestJS Project Structure

```
src/
├── main.ts
├── app.module.ts
├── common/
│   ├── decorators/
│   │   └── current-user.decorator.ts
│   ├── guards/
│   │   └── jwt-auth.guard.ts
│   ├── filters/
│   │   └── http-exception.filter.ts
│   └── interceptors/
│       └── transform.interceptor.ts
├── config/
│   ├── database.config.ts
│   └── jwt.config.ts
├── prisma/
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── strategies/
│   │   ├── jwt.strategy.ts
│   │   └── jwt-refresh.strategy.ts
│   └── dto/
│       ├── send-otp.dto.ts
│       └── verify-otp.dto.ts
├── users/
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── dto/
│       ├── update-user.dto.ts
│       └── verify-identity.dto.ts
├── branches/
│   ├── branches.module.ts
│   ├── branches.controller.ts
│   └── branches.service.ts
├── categories/
│   ├── categories.module.ts
│   ├── categories.controller.ts
│   └── categories.service.ts
├── products/
│   ├── products.module.ts
│   ├── products.controller.ts
│   ├── products.service.ts
│   └── dto/
│       └── query-products.dto.ts
├── favorites/
│   ├── favorites.module.ts
│   ├── favorites.controller.ts
│   ├── favorites.service.ts
│   └── dto/
│       └── create-favorite.dto.ts
├── cart/
│   ├── cart.module.ts
│   ├── cart.controller.ts
│   ├── cart.service.ts
│   └── dto/
│       ├── add-to-cart.dto.ts
│       └── update-cart.dto.ts
├── orders/
│   ├── orders.module.ts
│   ├── orders.controller.ts
│   ├── orders.service.ts
│   └── dto/
│       └── create-order.dto.ts
└── payments/
    ├── payments.module.ts
    ├── payments.controller.ts
    ├── payments.service.ts
    └── dto/
        └── create-payment.dto.ts
```

---

## Environment Variables (.env)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/gold_mobile?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="your-refresh-secret-key"
JWT_REFRESH_EXPIRES_IN="7d"

# App
PORT=3000
NODE_ENV="development"

# SMS Provider (example: Playmobile)
SMS_API_URL="https://sms-api.uz/send"
SMS_API_KEY="your-sms-api-key"

# File Upload (MinIO/S3)
MINIO_ENDPOINT="localhost"
MINIO_PORT=9000
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"
MINIO_BUCKET="gold-mobile"

# Credit Limit Settings
DEFAULT_CREDIT_LIMIT=20000000
CREDIT_LIMIT_DURATION_DAYS=1
```

---

## Key Implementation Notes

### 1. Interest Rate Calculation
```typescript
// orders.service.ts
getInterestRate(months: number): number {
  if (months <= 3) return 0;
  if (months <= 6) return 0.05;
  if (months <= 12) return 0.10;
  if (months <= 24) return 0.15;
  return 0.20;
}

calculateInstallment(price: number, months: number) {
  const interestRate = this.getInterestRate(months);
  const totalAmount = price * (1 + interestRate);
  const monthlyPayment = totalAmount / months;
  
  return {
    totalAmount,
    monthlyPayment,
    interestRate,
  };
}
```

### 2. Payment Schedule Generation
```typescript
generatePaymentSchedule(order: Order) {
  const schedule = [];
  const startDate = new Date(order.createdAt);
  
  for (let i = 1; i <= order.totalMonths; i++) {
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + i);
    dueDate.setDate(15); // Always 15th
    
    schedule.push({
      monthNumber: i,
      dueDate,
      amount: order.monthlyPayment,
      isPaid: i <= order.paidMonths,
    });
  }
  
  return schedule;
}
```

### 3. Credit Limit Management
```typescript
async checkAvailableLimit(userId: string, amount: number) {
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
  });
  
  const availableLimit = (user.creditLimit || 0) - user.usedLimit;
  
  if (availableLimit < amount) {
    throw new BadRequestException('Insufficient credit limit');
  }
  
  // Check if limit expired
  if (user.limitExpiryDate && user.limitExpiryDate < new Date()) {
    throw new BadRequestException('Credit limit expired');
  }
  
  return availableLimit;
}

async updateUsedLimit(userId: string, amount: number) {
  await this.prisma.user.update({
    where: { id: userId },
    data: {
      usedLimit: {
        increment: amount,
      },
    },
  });
}
```

### 4. OTP Service
```typescript
async sendOtp(phoneNumber: string) {
  // Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Save to database
  await this.prisma.otpCode.create({
    data: {
      phoneNumber,
      code,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min
    },
  });
  
  // Send SMS
  await this.smsService.send(phoneNumber, `Gold Imperia tasdiqlash kodi: ${code}`);
}

async verifyOtp(phoneNumber: string, code: string) {
  const otp = await this.prisma.otpCode.findFirst({
    where: {
      phoneNumber,
      code,
      isUsed: false,
      expiresAt: { gt: new Date() },
    },
  });
  
  if (!otp) {
    throw new BadRequestException('Invalid or expired OTP');
  }
  
  // Mark as used
  await this.prisma.otpCode.update({
    where: { id: otp.id },
    data: { isUsed: true },
  });
  
  return true;
}
```

---

## Testing Endpoints

Use Postman or Thunder Client with this collection structure:

1. **Auth Flow**: Send OTP → Verify → Get token
2. **User Profile**: Get/Update profile → Verify identity → Request credit
3. **Browse**: Get branches → Get categories → Get products
4. **Shopping**: Add to favorites → Add to cart → Create order
5. **Payments**: View orders → Payment schedule → Make payment

---

## Mobile App Integration Points

1. **Login**: OTP-based authentication
2. **Verification**: Face + Passport upload
3. **Credit**: Request and track 20M limit
4. **Shopping**: Browse, favorite, cart
5. **Installment**: 3-48 months with interest calculation
6. **Orders**: View purchases, payment schedule, history
7. **Payments**: Monthly payments on 15th
