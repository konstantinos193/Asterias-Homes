# Asterias Homes: Your Modern Apartment Rental Solution

![Asterias Homes](https://i.imgur.com/mQuYaP7.jpeg) 

Welcome to **Asterias Homes**, a sleek and responsive apartment rental platform built with the latest web technologies. This project provides a seamless user experience for browsing apartments, making reservations, and managing bookings, complete with a powerful admin dashboard for staff.

## ✨ Key Features

- **Intuitive Apartment Booking**: A multi-step booking wizard guides users through the reservation process.
- **Secure Payments**: Integrated with Stripe for reliable and secure payment processing.
- **Multi-Language Support**: Easily switch between English and Greek.
- **Powerful Admin Dashboard**: Manage apartments, bookings, special offers, and view reports.
- **Modern Tech Stack**: Built with Next.js, TypeScript, and Tailwind CSS for a fast, reliable, and scalable application.
- **Responsive Design**: A beautiful and functional interface on any device, from desktops to mobile phones.

## 🚀 Getting Started

Follow these steps to get the Asterias Homes frontend up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [pnpm](https://pnpm.io/) package manager
- A [Stripe](https://stripe.com/) account for payment processing

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/asterias-homes.git
cd asterias-homes
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root of the project and add the following environment variables. You can get your Stripe keys from your [Stripe Dashboard](https://dashboard.stripe.com/apikeys).

```env
# Stripe API Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# Backend API URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api 
```

### 4. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application in action.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Payments**: [Stripe](https://stripe.com/)
- **Package Manager**: [pnpm](https://pnpm.io/)

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements or want to report a bug, please open an issue or submit a pull request.

---

*This README provides instructions for setting up the frontend application. For details on the backend API, please refer to the `backend/README.md` file.*
