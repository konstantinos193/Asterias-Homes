# Asterias Homes - Apartment Rental System

A modern, multilingual apartment rental management system built for traditional Greek apartments in Koronisia, Arta. Features automated booking management, multilingual email notifications, and a comprehensive admin dashboard.

## 🏠 About Asterias Homes

Asterias Homes offers traditional apartment rentals in the beautiful coastal village of Koronisia, Arta, near the Amvrakikos Gulf. Our system provides a seamless booking experience for guests and powerful management tools for administrators.

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

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Modern component library
- **Stripe Elements**: Secure payment forms

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web application framework
- **MongoDB**: Document database with Mongoose ODM
- **Stripe API**: Payment processing
- **Nodemailer**: Email delivery system

### Deployment
- **Frontend**: Deployed on Vercel
- **Backend**: Deployed on Render
- **Database**: MongoDB Atlas
- **Email**: Gmail SMTP with app passwords

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- MongoDB Atlas account
- Stripe account
- Gmail account for email sending

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Asteriashomes
   ```

2. **Install dependencies**
   ```bash
   # Frontend dependencies
   pnpm install
   
   # Backend dependencies
   cd backend
   pnpm install
   ```

3. **Environment Configuration**
   
   Create `.env.local` in the root:
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   BACKEND_URL=http://localhost:3001
   ```
   
   Create `.env` in the backend folder:
   ```env
   NODE_ENV=development
   PORT=3001
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   EMAIL_USER=your_gmail_address
   EMAIL_APP_PASSWORD=your_gmail_app_password
   ADMIN_EMAIL=your_admin_email
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the development servers**
   ```bash
   # Terminal 1: Frontend
   pnpm dev
   
   # Terminal 2: Backend
   cd backend
   pnpm start
   ```

## 📧 Email System Setup

### Gmail Configuration
1. **Create Gmail Account**: Set up a dedicated business Gmail account
2. **Enable 2FA**: Required for app password generation
3. **Generate App Password**: 
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
4. **Update Environment**: Add credentials to backend `.env`

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

- **Responsive Design**: Works on all device sizes
- **Touch-Friendly**: Optimized for mobile booking
- **Fast Loading**: Optimized images and code splitting
- **Offline Fallbacks**: Graceful degradation

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
- **Email**: info@asteriashome.gr
- **Phone**: +30 26810 XXXXX
- **Location**: Koronisia, Arta 48100, Greece

---

Built with ❤️ for traditional Greek hospitality in Koronisia, Arta.
