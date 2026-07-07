# Super Admin System Implementation Plan (Sa2yanti)

We will introduce a complete Super Admin System to the **Sa2yanti** project. The implementation includes backend changes (seed script, new models, custom auth middleware, REST endpoints) and frontend changes (a completely isolated `/admin` portal containing pages for Dashboard, User Management, Technician Management, Order Management, Service CRUD, Category CRUD, Statistics, and System Settings).

All additions will be isolated where possible, ensuring no existing functionality is broken.

---

## User Review Required

> [!IMPORTANT]
> - We will extend the `User` model to allow the role `super_admin` in the `role` enum.
> - We will add `isBlocked` (for users) and `isSuspended` (for technicians) fields to the `User` model, and block login attempts for blocked/suspended accounts.
> - We will register a dedicated router prefix `/api/admin` for all admin endpoints.
> - We will create a seed script that runs automatically on server start to initialize the Super Admin account and the site configuration.

---

## Proposed Changes

### Backend Components

We will implement the following changes in the backend directory:

#### 1. Models & Schemas

##### [MODIFY] [User.model.ts](file:///d:/Fainal Project/Sa2yanti/backend/src/models/User.model.ts)
- Extend the `role` enum to include `super_admin`.
- Add `isBlocked` (boolean, default: false).
- Add `isSuspended` (boolean, default: false).

##### [NEW] [Category.model.ts](file:///d:/Fainal Project/Sa2yanti/backend/src/models/Category.model.ts)
- Category schema containing:
  - `name`: string (unique, required)
  - `description`: string
  - `isActive`: boolean (default: true)

##### [NEW] [Service.model.ts](file:///d:/Fainal Project/Sa2yanti/backend/src/models/Service.model.ts)
- Service schema containing:
  - `name`: string (unique, required)
  - `description`: string (required)
  - `category`: ObjectId ref 'Category' (required)
  - `price`: number (required)
  - `image`: string (default empty, image path / base64)
  - `isActive`: boolean (default: true)

##### [NEW] [Settings.model.ts](file:///d:/Fainal Project/Sa2yanti/backend/src/models/Settings.model.ts)
- System settings schema:
  - `websiteName`: string
  - `logo`: string
  - `supportEmail`: string
  - `phone`: string
  - `socialMedia`: Object (facebook, twitter, instagram)
  - `maintenanceMode`: boolean

#### 2. Seed Script

##### [NEW] [seed.ts](file:///d:/Fainal Project/Sa2yanti/backend/src/utils/seed.ts)
- Creates `super_admin` account if it does not exist:
  - Email: `admin@sa2yanti.com`
  - Password: `Admin@123` (hashed using bcrypt)
  - Name: `Super Admin`
  - Phone: `0000000000`
  - Role: `super_admin`
- Creates initial system settings entry if none exists.
- Injects seed run on database connection in [server.ts](file:///d:/Fainal Project/Sa2yanti/backend/src/server.ts).

#### 3. Middleware

##### [NEW] [adminAuth.middleware.ts](file:///d:/Fainal Project/Sa2yanti/backend/src/middleware/adminAuth.middleware.ts)
- Decodes and verifies the JWT token stored in HTTP-Only cookies.
- Ensures the user exists and has the role `super_admin`. If not, returns `403 Forbidden` / `401 Unauthorized`.

#### 4. Controllers & Routes

##### [NEW] [admin.controller.ts](file:///d:/Fainal Project/Sa2yanti/backend/src/controllers/admin.controller.ts)
Contains all administrative functions:
- `login`: Validates `super_admin` credentials, signs a JWT, sets cookie `token` (same cookie or custom name, let's use `token` or `admin_token`, prompt says HTTP Only cookie).
- `logout`: Clears the HTTP-only cookie.
- `me`: Returns current logged-in super admin details.
- `getDashboardStats`: Aggregates:
  - Total users, technicians, orders (pending, completed, total), services.
  - Recent orders list (latest 5 orders).
- `getUsers`: Paginated list of users (filtered by search query, matching role `user`).
- `blockUser` / `unblockUser` / `deleteUser`: Actions on users.
- `getTechnicians`: Paginated list of technicians (filtered by search query, matching role `technician`).
- `suspendTechnician` / `activateTechnician` / `deleteTechnician`: Actions on technicians.
- `getOrders`: Paginated list of orders, with search/status filters.
- `assignTechnician`: Assigns a technician to a pending order.
- `updateOrderStatus` / `deleteOrder`: Actions on orders.
- `getCategories` / `createCategory` / `updateCategory` / `deleteCategory`: CRUD endpoints.
- `getServices` / `createService` / `updateService` / `deleteService`: CRUD endpoints.
- `getStatistics`: Dynamic analytics data (orders per month, completion rate, top requested services, growth trends).
- `getSettings` / `updateSettings`: Website settings.

##### [NEW] [admin.routes.ts](file:///d:/Fainal Project/Sa2yanti/backend/src/routes/admin.routes.ts)
- Map admin controller functions to REST paths under `/api/admin`.
- Protected by `adminAuth` middleware (except `/login`).

##### [MODIFY] [app.ts](file:///d:/Fainal Project/Sa2yanti/backend/src/app.ts)
- Register `adminRouter` at `/api/admin`.

##### [MODIFY] [user.controller.ts](file:///d:/Fainal Project/Sa2yanti/backend/src/controllers/user.controller.ts)
- Modify local user login to prevent blocked users (`isBlocked`) and suspended technicians (`isSuspended`) from logging in.
- Prevent user registration endpoint from accepting `super_admin` role.

---

### Frontend Components

We will construct the admin portal in isolation within `frontend/src/admin`.

#### 1. Context, Routing & Hooks

##### [NEW] [adminApi.ts](file:///d:/Fainal Project/Sa2yanti/frontend/src/admin/services/adminApi.ts)
- Isolated Axios instance pointing to `http://localhost:5000/api/admin` with standard response handling and cookie inclusion.
- Redirects to `/admin/login` on 401.

##### [NEW] [AdminAuthContext.tsx](file:///d:/Fainal Project/Sa2yanti/frontend/src/admin/context/AdminAuthContext.tsx)
- Manages super admin login state, `/admin/me` polling, and loading status.

##### [NEW] [AdminProtectedRoute.tsx](file:///d:/Fainal Project/Sa2yanti/frontend/src/admin/routes/AdminProtectedRoute.tsx)
- Protects pages under `/admin` path. If not authenticated, redirects to `/admin/login`.

##### [NEW] [AdminRoutes.tsx](file:///d:/Fainal Project/Sa2yanti/frontend/src/admin/routes/AdminRoutes.tsx)
- Contains all routing definitions for the admin portal:
  - `/admin/login` -> Dedicated Admin Login page.
  - `/admin/dashboard` -> Admin Dashboard.
  - `/admin/users` -> User list, search, pagination, block/unblock.
  - `/admin/technicians` -> Technician list, search, pagination, suspend/activate.
  - `/admin/orders` -> Order details, assignment, status adjustment.
  - `/admin/services` -> Services list and creation/editing modals.
  - `/admin/categories` -> Categories list and CRUD.
  - `/admin/statistics` -> Rich charts and analytics.
  - `/admin/settings` -> System configuration.

##### [MODIFY] [App.tsx](file:///d:/Fainal Project/Sa2yanti/frontend/src/App.tsx) & [AppRouter.tsx](file:///d:/Fainal Project/Sa2yanti/frontend/src/routes/AppRouter.tsx)
- Integrate admin router under `/admin` prefix.
- Update `UserRole` type definition to include `super_admin`.

#### 2. Layout & Theme

##### [NEW] [AdminLayout.tsx](file:///d:/Fainal Project/Sa2yanti/frontend/src/admin/layout/AdminLayout.tsx)
- Sidebar navigation containing links to all admin pages.
- Header with dashboard title, logged admin info, profile quick view, and Logout button.
- Responsive container with sidebar toggle for mobile.
- Sleek dark/light theme options using CSS variables or Tailwind standard colors (slate, indigo, etc.).

#### 3. Pages

##### [NEW] [Login.tsx](file:///d:/Fainal Project/Sa2yanti/frontend/src/admin/pages/Login/Login.tsx)
- Dedicated, modern dark/blue themed login page, with email & password fields, showing clear error messages.

##### [NEW] [Dashboard.tsx](file:///d:/Fainal Project/Sa2yanti/frontend/src/admin/pages/Dashboard/Dashboard.tsx)
- Summary statistics grid (KPI cards: Users, Technicians, Orders, Pending, Completed, Services) with progress indicator rings.
- "Recent Orders" table showing latest orders, status colors, and "View Details" action.

##### [NEW] [Users.tsx](file:///d:/Fainal Project/Sa2yanti/frontend/src/admin/pages/Users/Users.tsx)
- Table listing registered clients. Search input, pagination controllers.
- Actions: "Block/Unblock" toggle and "Delete" with confirmation dialog.

##### [NEW] [Technicians.tsx](file:///d:/Fainal Project/Sa2yanti/frontend/src/admin/pages/Technicians/Technicians.tsx)
- Table listing technicians. Search input, pagination.
- Actions: "Suspend/Activate" toggle and "Delete" with confirmation.

##### [NEW] [Orders.tsx](file:///d:/Fainal Project/Sa2yanti/frontend/src/admin/pages/Orders/Orders.tsx)
- Table listing orders. Search (by customer or service name), filters (pending, in-progress, completed, etc.).
- Modal for "Assign Technician" (populates available technicians list) and "Change Status".
- Delete button with confirmation.

##### [NEW] [Services.tsx](file:///d:/Fainal Project/Sa2yanti/frontend/src/admin/pages/Services/Services.tsx)
- List of services with grid view.
- Add/Edit Service modal (handles name, description, price, category select, image upload ready, active toggle).
- Activate/Deactivate toggles.

##### [NEW] [Categories.tsx](file:///d:/Fainal Project/Sa2yanti/frontend/src/admin/pages/Categories/Categories.tsx)
- Table listing categories (Engine, Brakes, Electrical, etc.).
- Modal for Add/Edit Category.
- Delete option.

##### [NEW] [Statistics.tsx](file:///d:/Fainal Project/Sa2yanti/frontend/src/admin/pages/Statistics/Statistics.tsx)
- Responsive charts built using pure Tailwind/CSS (animated bars, comparison pillars, percentages, growth lines).
- KPIs: Orders growth, top requested services, user signup growth.

##### [NEW] [Settings.tsx](file:///d:/Fainal Project/Sa2yanti/frontend/src/admin/pages/Settings/Settings.tsx)
- Single-page form to configure website parameters: Website Name, Logo, Support Email, Phone, Social Media links (Facebook, Twitter, Instagram), Maintenance Mode toggle.
- "Save Changes" triggers API update.

---

## Verification Plan

### Automated Tests
- Validate compilation on both backend and frontend:
  ```bash
  npm run build (in backend and frontend)
  ```

### Manual Verification
1. **Database Seed Verify**:
   - Start the backend and verify that the console logs show database connection and "Super Admin Seeded". Check user collections in database to confirm `super_admin` exists.
2. **Access Security Verify**:
   - Try registering a user with the role `super_admin` using postman/client, assert rejection.
   - Access `/admin/dashboard` while logged out, assert redirect to `/admin/login`.
   - Access admin routes while logged in as a normal user/technician, assert 403 / redirect to unauthorized page.
3. **Admin Actions Verify**:
   - Log in using `admin@sa2yanti.com` / `Admin@123`.
   - Perform full CRUD actions on Categories and Services.
   - Block/Unblock a user and verify that they can no longer log in.
   - Assign a technician to a pending order and verify the status changes.
   - Modify site settings (e.g. website name) and verify it is preserved.
