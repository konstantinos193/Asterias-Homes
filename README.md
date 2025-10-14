# Asterias Homes - Modern Apartment Rental Platform

A sophisticated, full-stack apartment rental management system featuring a Next.js 16 frontend with PostgreSQL and a separate Express.js backend with MongoDB. Features real-time booking management, multilingual support, Stripe payments, and a comprehensive admin dashboard for traditional Greek apartments in Koronisia, Arta.

🌐 **Live Website**: [https://asteriashome.gr](https://asteriashome.gr)

## 🏠 About Asterias Homes

Asterias Homes offers traditional apartment rentals in the beautiful coastal village of Koronisia, Arta, near the Amvrakikos Gulf. Our modern platform provides a seamless booking experience for guests and powerful management tools for administrators, combining traditional Greek hospitality with cutting-edge technology.

## ✨ Key Features

### 🌍 Multilingual Support
- **3 Languages**: Greek (ελληνικά), English, German (Deutsch)
- **Smart Language Detection**: Automatically detects customer language from URL paths (`/el/`, `/en/`, `/de/`)
- **Localized Content**: All pages, booking forms, and emails adapt to user's language

### 📧 Automated Email System
- **Customer Emails**: Booking confirmations and arrival reminders in customer's language
- **Admin Alerts**: New booking notifications and low inventory warnings (in Greek)
- **Email Templates**: Professional, responsive HTML emails for all languages
- **Smart Scheduling**: Automated arrival reminders and inventory alerts

### 💳 Payment Processing
- **Stripe Integration**: Secure card payments with EU compliance
- **Flexible Payment**: Support for card payments and cash on arrival
- **Greek Tax Compliance**: Automatic 13% VAT calculation
- **No Deposits Required**: Full payment at booking (προκαταβολή-free)

### 🎛️ Admin Dashboard
- **Booking Management**: Real-time booking status tracking
- **Room Management**: Dynamic room availability and pricing
- **Analytics**: Revenue reports and occupancy statistics
- **Settings**: Configurable booking rules, pricing, and notifications

### 🔧 Booking Features
- **Real-time Availability**: Live room availability checking
- **Flexible Dates**: Advanced date selection with availability calendar
- **Guest Management**: Complete guest information handling
- **Special Requests**: Custom accommodation requests

## 🛠️ Technical Stack

### Frontend (Asterias-Homes)
- **Next.js 16**: React framework with App Router and Turbopack
- **TypeScript**: Type-safe development with strict typing
- **Tailwind CSS**: Utility-first styling with custom design system
- **shadcn/ui**: Modern component library with Radix UI primitives
- **Stripe Elements**: Secure payment forms with React integration
- **React Hook Form**: Form management with Zod validation
- **Next Themes**: Dark/light mode support
- **Lucide React**: Modern icon library

### Backend (Asterias-Backend)
- **Node.js 18+**: Runtime environment
- **Express.js**: Web application framework
- **MongoDB**: Document database with Mongoose ODM
- **JWT Authentication**: Secure token-based authentication
- **Stripe API**: Payment processing and webhooks
- **Nodemailer**: Email delivery system
- **Cloudinary**: Image storage and optimization
- **Express Validator**: Input validation and sanitization

### Database Architecture
- **Frontend Database**: PostgreSQL with Prisma ORM for type safety
- **Backend Database**: MongoDB with Mongoose for flexible document storage
- **Data Synchronization**: API-based communication between frontend and backend

### Development & Build
- **React Compiler**: Automatic optimization (Next.js 16)
- **Turbopack**: Fast development builds
- **ESLint**: Code linting and formatting
- **PostCSS**: CSS processing with Tailwind
- **TypeScript**: Full type safety across the stack

### Deployment
- **Frontend**: Deployed on Vercel at [https://asteriashome.gr](https://asteriashome.gr)
- **Backend**: Deployed on Render (Express.js service)
- **Frontend Database**: PostgreSQL on Vercel Postgres
- **Backend Database**: MongoDB Atlas
- **Email**: Gmail SMTP with app passwords
- **CDN**: Vercel's global CDN for static assets

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- PostgreSQL database (for frontend)
- MongoDB database (for backend)
- Stripe account
- Gmail account for email sending

### Installation

This project consists of two separate repositories that work together:

#### Frontend Setup (Asterias-Homes)

1. **Clone the frontend repository**
```bash
   git clone https://github.com/konstantinos193/Asterias-Homes.git
   cd Asterias-Homes
```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Database Setup**
   ```bash
   # Generate Prisma client
   pnpm prisma generate
   
   # Run database migrations
   pnpm prisma db push
   
   # (Optional) Seed the database
   pnpm prisma db seed
   ```

4. **Environment Configuration**

   Create `.env.local` in the frontend root:
```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/asterias_homes"
   
   # Stripe
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   
   # Backend API
   NEXT_PUBLIC_API_URL=http://localhost:3001
   
   # Authentication
   JWT_SECRET=your_jwt_secret
   
   # Email
   EMAIL_USER=your_gmail_address
   EMAIL_APP_PASSWORD=your_gmail_app_password
   ADMIN_EMAIL=your_admin_email
   ```

5. **Start the frontend development server**
```bash
   pnpm dev
```

#### Backend Setup (Asterias-Backend)

1. **Clone the backend repository**
```bash
   git clone https://github.com/konstantinos193/Asterias-Backend.git
   cd Asterias-Backend
```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**

   Create `.env` in the backend root:
```env
   # Server Configuration
   NODE_ENV=development
   PORT=3001
   FRONTEND_URL=http://localhost:3000
   
   # Database
   MONGODB_URI=mongodb://localhost:27017/asterias-homes
   # OR for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/asterias-homes
   
   # JWT Authentication
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=7d
   
   # Stripe Payment
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   
   # Email Configuration
   EMAIL_USER=your_gmail@gmail.com
   EMAIL_APP_PASSWORD=your_gmail_app_password
   
   # Admin Configuration
   ADMIN_EMAIL=admin@asteriashomes.com
   ADMIN_PASSWORD=secure_admin_password
   ```

4. **Start the backend development server**
```bash
   npm run dev
```

### Running Both Services

1. **Start the backend** (Terminal 1):
```bash
   cd Asterias-Backend
   npm run dev
```

2. **Start the frontend** (Terminal 2):
```bash
   cd Asterias-Homes
   pnpm dev
```

- **Frontend**: Available at `http://localhost:3000`
- **Backend API**: Available at `http://localhost:3001`
- **Live Website**: [https://asteriashome.gr](https://asteriashome.gr)

## 🆕 Recent Updates & Features

### Hybrid Architecture
- **Frontend**: Next.js 16 with PostgreSQL and Prisma ORM for type safety
- **Backend**: Express.js with MongoDB for flexible data management
- **API Integration**: Seamless communication between frontend and backend services
- **Live Deployment**: Frontend deployed on Vercel, backend on Render

### Performance Improvements
- **Next.js 16**: Latest framework with React Compiler optimization
- **Turbopack**: Faster development builds and hot reloading
- **Mobile-First Design**: Comprehensive mobile responsiveness improvements
- **SEO Optimization**: Enhanced meta tags, structured data, and performance
- **Image Optimization**: Cloudinary integration for efficient image handling

### New Components & Features
- **Advanced Booking Wizard**: Multi-step booking process with validation
- **Real-time Admin Dashboard**: Live booking management and analytics
- **Image Upload System**: Secure image handling for rooms and offers
- **Enhanced Security**: JWT authentication with middleware protection
- **Responsive UI**: Mobile-optimized components with touch-friendly interfaces
- **Multilingual Support**: Greek, English, and German language support

## 📧 Email System Setup

### Gmail Configuration

**Choose ONE of these options:**

#### Option 1: App Password (RECOMMENDED)
1. **Use Gmail**: `asterias.apartmentskoronisia@gmail.com`
2. **Enable 2FA**: Go to Google Account → Security → 2-Step Verification
3. **Generate App Password**: 
   - Security → App passwords → Mail → Generate
   - Use 16-character password as `EMAIL_APP_PASSWORD`

#### Option 2: Regular Password (Simpler)
1. **Use Gmail**: `asterias.apartmentskoronisia@gmail.com`
2. **Enable Less Secure Access**: Google Account → Security → Less secure app access → ON
3. **Use Regular Password**: Set `EMAIL_PASSWORD` to your Gmail password

**Environment Setup**: Add to Vercel environment variables or local `.env.local`

### Email Templates
- **3 Languages**: All templates available in Greek, English, German
- **Responsive Design**: Mobile-friendly HTML emails
- **Professional Branding**: Asterias Homes styling and contact info
- **Smart Content**: Dynamic booking details and localized dates

## 🎛️ Admin Settings

Access the admin panel at `/admin` to configure:

### Booking Rules
- Check-in/check-out times
- Advance booking limits (1-365 days)
- Cancellation policies
- Overbooking controls

### Pricing & Payments
- VAT rate (default: 13%)
- Direct booking discounts
- Dynamic pricing toggle

### Notifications
- Email notification controls
- Booking confirmations
- Arrival reminders (24h before check-in)
- Low inventory alerts
- New booking admin alerts

### System Preferences
- Items per page
- Maintenance mode
- Backup settings

### Security
- Session timeouts
- Two-factor authentication
- Audit logging
- Concurrent session limits

## 🌐 Language Detection

The system automatically detects customer language using:
1. **URL Path**: `/en/book/room1` → English emails
2. **Accept-Language Header**: Browser language preference
3. **Default Fallback**: Greek for all undetected cases

## 📊 Analytics & Reports

- **Revenue Tracking**: Daily, weekly, monthly reports
- **Occupancy Rates**: Room utilization statistics
- **Booking Sources**: Direct vs. third-party channels
- **Guest Analytics**: Repeat customers and preferences

## 🔒 Security Features

- **SSL Encryption**: All communications secured
- **JWT Authentication**: Secure admin access
- **Input Validation**: All forms protected against injection
- **CORS Configuration**: Restricted API access
- **Rate Limiting**: Protection against abuse

## 📱 Mobile Optimization

- **Responsive Design**: Mobile-first approach with breakpoint optimization
- **Touch-Friendly**: 44px minimum touch targets for better usability
- **Fast Loading**: Optimized images, code splitting, and lazy loading
- **Progressive Web App**: Offline capabilities and app-like experience
- **Performance**: Core Web Vitals optimization for better SEO

## 📁 Project Structure

This project consists of two separate repositories:

### Frontend Repository (Asterias-Homes)
```
Asterias-Homes/
├── app/                          # Next.js App Router
│   ├── [lang]/                   # Internationalized routes
│   │   ├── about/               # About page
│   │   ├── book/                # Booking pages
│   │   ├── bookings/            # User bookings
│   │   ├── contact/             # Contact page
│   │   ├── gallery/             # Photo gallery
│   │   ├── offers/              # Special offers
│   │   ├── rooms/               # Room listings
│   │   └── success/             # Payment success
│   ├── admin/                   # Admin dashboard
│   │   ├── bookings/            # Booking management
│   │   ├── guests/              # Guest management
│   │   ├── offers/              # Offer management
│   │   ├── reports/             # Analytics & reports
│   │   ├── rooms/               # Room management
│   │   └── settings/            # System settings
│   └── api/                     # API routes
│       ├── admin/               # Admin API endpoints
│       ├── auth/                # Authentication
│       ├── confirm-payment/     # Payment confirmation
│       ├── create-payment-intent/ # Stripe integration
│       └── images/              # Image handling
├── components/                   # React components
│   ├── admin/                   # Admin-specific components
│   ├── booking-steps/           # Booking wizard steps
│   ├── seo/                     # SEO components
│   └── ui/                      # Reusable UI components
├── hooks/                       # Custom React hooks
├── lib/                         # Utility libraries
│   ├── api.ts                   # API service layer
│   ├── database.ts              # Prisma client
│   ├── translations.ts          # i18n translations
│   └── utils.ts                 # Helper functions
├── prisma/                      # Database schema
│   └── schema.prisma            # Prisma schema
├── styles/                      # Global styles
├── types/                       # TypeScript type definitions
└── middleware.ts                # Next.js middleware
```

### Backend Repository (Asterias-Backend)
```
Asterias-Backend/
├── src/
│   ├── controllers/             # Route handlers
│   ├── middleware/              # Authentication & validation
│   ├── models/                  # MongoDB schemas
│   ├── routes/                  # API route definitions
│   ├── services/                # Business logic
│   ├── utils/                   # Helper functions
│   └── index.js                 # Express app setup
├── .env                         # Environment variables
├── package.json                 # Dependencies
└── README.md                    # Backend documentation
```

### Repository Links
- **Frontend**: [Asterias-Homes Repository](https://github.com/konstantinos193/Asterias-Homes)
- **Backend**: [Asterias-Backend Repository](https://github.com/konstantinos193/Asterias-Backend)
- **Live Website**: [https://asteriashome.gr](https://asteriashome.gr)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software developed for Asterias Homes.

## 📞 Support

For technical support or questions:
- **Email**: asterias.apartmentskoronisia@gmail.com
- **Phone**: +30 6972705881
- **Location**: Koronisia, Arta 48100, Greece

---

Built with ❤️ for traditional Greek hospitality in Koronisia, Arta.
