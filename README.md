# TripSplit

TripSplit, seyahat masraflarınızı arkadaşlarınızla kolayca paylaşmanızı sağlayan bir web uygulamasıdır.

## Özellikler

- 👥 Grup Yönetimi
  - Seyahat grupları oluşturma
  - Gruplara üye davet etme
  - Grup bilgilerini düzenleme ve silme

- ✈️ Seyahat Yönetimi
  - Gruplara seyahat ekleme
  - Seyahat detaylarını düzenleme
  - Seyahatleri tamamlama ve silme

- 💰 Masraf Takibi
  - Seyahatlere masraf ekleme
  - Kişi başı düşen miktarı otomatik hesaplama
  - Kimin ne kadar ödediğini ve kime ne kadar borcu olduğunu görme

## Teknolojiler

- Next.js 14
- TypeScript
- Prisma
- PostgreSQL
- NextAuth.js
- Tailwind CSS
- shadcn/ui
- Sentry

## Kurulum

1. Repoyu klonlayın:
```bash
git clone https://github.com/kocaemre/trip-split.git
cd trip-split
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. `.env` dosyasını oluşturun ve gerekli değişkenleri ekleyin:
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..."
GITHUB_ID="..."
GITHUB_SECRET="..."
SENTRY_DSN="..."
```

4. Veritabanı şemasını oluşturun:
```bash
npx prisma db push
```

5. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

## Canlı Demo

[https://trip-split.vercel.app](https://trip-split.vercel.app)

## Vercel Deployment

Vercel'de deploy ederken, Environment Variables kısmında aşağıdaki değişkenleri eklemeyi unutmayın:

- `DATABASE_URL`: PostgreSQL veritabanı bağlantı URL'i
- `NEXTAUTH_URL`: Uygulamanın deploy edildiği URL (örn: https://trip-split.vercel.app)
- `NEXTAUTH_SECRET`: NextAuth için güvenlik anahtarı (aşağıdaki komutla oluşturabilirsiniz)
  ```bash
  openssl rand -base64 32
  ```
- `GITHUB_ID`: GitHub OAuth uygulama ID'si
- `GITHUB_SECRET`: GitHub OAuth uygulama gizli anahtarı
- `SENTRY_DSN`: Sentry hata takibi için DSN URL'i

---

# TripSplit [EN]

TripSplit is a web application that helps you easily share travel expenses with your friends.

## Features

- 👥 Group Management
  - Create travel groups
  - Invite members to groups
  - Edit and delete group information

- ✈️ Travel Management
  - Add trips to groups
  - Edit trip details
  - Complete and delete trips

- 💰 Expense Tracking
  - Add expenses to trips
  - Automatically calculate per person amount
  - See who paid how much and who owes whom

## Technologies

- Next.js 14
- TypeScript
- Prisma
- PostgreSQL
- NextAuth.js
- Tailwind CSS
- shadcn/ui
- Sentry

## Installation

1. Clone the repository:
```bash
git clone https://github.com/kocaemre/trip-split.git
cd trip-split
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file and add required variables:
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..."
GITHUB_ID="..."
GITHUB_SECRET="..."
SENTRY_DSN="..."
```

4. Create database schema:
```bash
npx prisma db push
```

5. Start development server:
```bash
npm run dev
```

## Live Demo

[https://trip-split.vercel.app](https://trip-split.vercel.app)

## Vercel Deployment

When deploying to Vercel, make sure to add the following Environment Variables:

- `DATABASE_URL`: PostgreSQL database connection URL
- `NEXTAUTH_URL`: The URL where the app is deployed (e.g., https://trip-split.vercel.app)
- `NEXTAUTH_SECRET`: Security key for NextAuth (you can generate it with the following command)
  ```bash
  openssl rand -base64 32
  ```
- `GITHUB_ID`: GitHub OAuth application ID
- `GITHUB_SECRET`: GitHub OAuth application secret
- `SENTRY_DSN`: Sentry error tracking DSN URL
