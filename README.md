# Sa2yanti (صيانتي)

## 📖 Overview
Sa2yanti (My Maintenance) is a comprehensive platform designed to connect users with skilled maintenance technicians. The system streamlines the process of requesting, tracking, and managing maintenance orders, featuring real-time location mapping, secure authentication, and a robust user-technician interface.

## 🚀 Features (Current)
- **User Authentication:** Secure signup and login for both Users and Technicians using JWT and bcrypt.
- **Order Management:** Create, track, and manage maintenance requests.
- **Geolocation & Mapping:** Interactive maps using Leaflet to track service locations.
- **Role-Based Interfaces:** Dedicated dashboards for regular Users and Technicians.
- **Form Validation:** Client-side validation with Zod and React Hook Form, and server-side validation with Joi.

## 🛠️ Tech Stack
### Frontend
- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v7
- **Maps:** Leaflet & React-Leaflet
- **Form Handling:** React Hook Form & Zod
- **Icons & UI:** Lucide React, React Icons, React Hot Toast
- **HTTP Client:** Axios

### Backend
- **Environment:** Node.js + Express + TypeScript
- **Database:** MongoDB with Mongoose
- **Authentication:** JSON Web Tokens (JWT) & Cookies
- **Security:** bcryptjs
- **Validation:** Joi

## 📂 Project Structure
```text
Sa2yanti/
├── backend/          # Node.js Express server
│   ├── src/
│   │   ├── controllers/ # Request handlers (User, Order)
│   │   ├── models/      # Mongoose Database Schemas
│   │   ├── routes/      # Express API routes
│   │   ├── middleware/  # Auth & error handling
│   │   ├── validators/  # Joi validation schemas
│   │   ├── utils/       # Helper functions
│   │   └── config/      # Environment & DB setup
├── frontend/         # React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page views (Auth, Home, Orders, Technician, User)
│   │   ├── hooks/       # Custom React hooks
│   │   ├── routes/      # React Router setup
│   │   ├── services/    # API & Axios integration
│   │   ├── schemas/     # Zod form schemas
│   │   ├── types/       # TypeScript interfaces
│   │   └── assets/      # Static files
├── documentation/    # Project proposals, PPT presentations, Gantt charts
└── README.md         # Project documentation
```

## ⚙️ Setup & Installation
### Prerequisites
- Node.js (v18+ recommended)
- MongoDB instance (local or Atlas)
- NPM or Yarn

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on your environment variables (e.g., `PORT`, `MONGO_URI`, `JWT_SECRET`).
4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## 🔮 Future Improvements & Roadmap
- **Real-Time Chat:** Integrate Socket.io to allow direct communication between users and technicians regarding specific orders.
- **Payment Gateway Integration:** Add support for secure online payments (e.g., Stripe, PayPal, or local payment providers).
- **Admin Dashboard:** A comprehensive control panel for platform administrators to monitor platform activities, verify technicians, and resolve disputes.
- **Push Notifications:** Implement web or mobile push notifications for real-time order status updates.
- **Rating & Review System:** Allow users to rate technicians and leave feedback after a completed maintenance job, ensuring quality control.
- **Mobile Application:** Wrap the frontend using React Native or Capacitor for dedicated iOS and Android applications.
- **Advanced Filtering & Search:** Allow users to filter technicians by specific maintenance skills, availability, and geographic proximity.
