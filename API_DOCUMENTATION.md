# 📖 Sapru Restaurant Management Platform — API Specification (v1.2.0)

Welcome to the **Sapru Multi-Tenant Restaurant SaaS Platform API** documentation. This document covers authentication, tenant isolation headers, role permissions, REST endpoints, and WebSocket events.

---

## 🌐 Base URL & Interactive Docs

- **Base REST URL**: `/api/v1` (e.g., `http://your-domain.com/api/v1` or `http://localhost/api/v1`)
- **Interactive Swagger UI**: `/api/v1/swagger-ui.html`
- **OpenAPI 3.0 JSON Spec**: `/api/v1/v3/api-docs`
- **WebSocket STOMP Broker**: `/api/v1/ws` (SockJS fallback) or `/api/v1/ws-direct`

---

## 🛡️ Multi-Tenant Headers & Security

All authenticated API requests require standard HTTP headers:

| Header Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `Authorization` | String | Yes (Protected routes) | Standard JWT Bearer token: `Bearer <jwt_token>` |
| `X-Tenant-ID` | UUID | Yes (Tenant routes) | UUID of the active restaurant tenant |
| `X-Branch-ID` | UUID | Optional / Branch routes | UUID of the active restaurant branch |
| `Content-Type` | String | Yes (POST/PUT/PATCH) | `application/json` |

---

## 📦 Standard Response Envelope

All API endpoints return responses in a standardized `ApiResponse<T>` wrapper:

### Success Response (`200 OK`, `201 Created`):
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2026-11-15T14:00:00Z"
}
```

### Error Response (`400`, `401`, `403`, `404`, `409`, `500`):
```json
{
  "success": false,
  "error": "Bad Request",
  "message": "Validation failed: tableNumber cannot be blank",
  "timestamp": "2026-11-15T14:00:00Z"
}
```

---

## 👥 Role-Based Access Control (RBAC) Matrix

The platform enforces strict role-based authorization:

| Role Name | Description | Scope / Permissions |
| :--- | :--- | :--- |
| `PLATFORM_ADMIN` | Platform Superuser | Global system access, tenant management, diagnostics |
| `RESTAURANT_OWNER` | Restaurant Tenant Owner | Full tenant control: billing, staff, catalog, analytics |
| `BRANCH_MANAGER` | Branch General Manager | All operations within assigned branch(es) |
| `CASHIER` | Billing & POS Operator | Order creation, payments, table occupancy |
| `CHEF` | Kitchen Line Chef | KDS view, ticket lifecycle transitions, ingredient alerts |
| `WAITER` | Dining Floor Captain | Table floorplan, taking guest orders, sending KOTs |

---

## 🔐 1. Authentication & Onboarding (`/auth`)

### `POST /auth/login`
Authenticates a user and issues a JWT token.
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "owner@royalbistro.com",
    "password": "Password123!"
  }
  ```
- **Response `data`**:
  ```json
  {
    "token": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi...",
    "user": {
      "id": "9ca85f64-5717-4562-b3fc-2c963f66afa9",
      "email": "owner@royalbistro.com",
      "fullName": "Alex Mercer",
      "role": "RESTAURANT_OWNER",
      "tenantId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "branchId": "7ca85f64-5717-4562-b3fc-2c963f66afa7"
    }
  }
  ```

### `POST /auth/register-restaurant`
Self-service onboarding that creates a new Restaurant Tenant, default Flagship Branch, Admin User, and immediately starts a **14-day free trial**.
- **Access**: Public
- **Request Body**:
  ```json
  {
    "restaurantName": "The Golden Spoon",
    "slug": "golden-spoon",
    "ownerName": "John Doe",
    "email": "john@goldenspoon.com",
    "password": "SecurePassword123!",
    "phoneNumber": "+91 98765 00000",
    "city": "Bengaluru",
    "state": "Karnataka",
    "plan": "GROWTH"
  }
  ```

### `POST /auth/refresh`
Refreshes an expired access token using a valid refresh token.
- **Access**: Public

### `GET /auth/me`
Fetches authenticated user identity and tenant context.
- **Access**: Authenticated

---

## 💳 2. Subscriptions & Billing (`/billing`)

### `GET /billing/subscription`
Retrieves tenant subscription status, active plan code, trial days remaining, and operational lock status.
- **Access**: Authenticated (Requires `X-Tenant-ID`)
- **Response `data`**:
  ```json
  {
    "tenantId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "planCode": "growth",
    "planName": "Growth",
    "status": "TRIALING",
    "trialStartAt": "2026-11-01T00:00:00Z",
    "trialEndAt": "2026-11-15T00:00:00Z",
    "daysRemainingInTrial": 5,
    "isTrialActive": true,
    "hasOperationalAccess": true,
    "currentPeriodEnd": "2026-11-15T00:00:00Z",
    "features": [
      { "key": "kds", "name": "Kitchen Display System", "included": true },
      { "key": "qr_ordering", "name": "QR Ordering", "included": true }
    ]
  }
  ```

### `GET /billing/plans`
Lists available commercial subscription plans and feature matrices.
- **Access**: Public
- **Response `data`**:
  ```json
  [
    {
      "code": "starter",
      "name": "Starter",
      "monthlyPrice": 999.00,
      "annualPrice": 9990.00,
      "currency": "INR",
      "maxOutlets": 1
    },
    {
      "code": "growth",
      "name": "Growth",
      "monthlyPrice": 1999.00,
      "annualPrice": 19990.00,
      "currency": "INR",
      "maxOutlets": 1,
      "isPopular": true
    },
    {
      "code": "multi_outlet",
      "name": "Multi-Outlet",
      "monthlyPrice": 3999.00,
      "annualPrice": 39990.00,
      "currency": "INR",
      "maxOutlets": 5
    }
  ]
  ```

### `POST /billing/upgrade`
Upgrades or activates a paid subscription tier.
- **Access**: `RESTAURANT_OWNER`, `PLATFORM_ADMIN`
- **Request Body**:
  ```json
  {
    "planCode": "growth",
    "billingInterval": "MONTHLY",
    "paymentProvider": "RAZORPAY",
    "paymentReference": "pay_O7d8f9g0h1j2"
  }
  ```

### `GET /billing/invoices`
Returns historical tax invoices, amounts, status, and PDF download URLs.
- **Access**: Authenticated

### `POST /billing/webhook/{provider}`
Idempotent payment gateway webhook endpoint (Razorpay/Stripe) with HMAC-SHA256 signature verification.
- **Access**: Public (Cryptographically validated via header signatures)

---

## 🍽️ 3. Floorplan & Dining Tables (`/tables`)

### `GET /tables`
Retrieves all tables for the active tenant branch.
- **Access**: Authenticated

### `POST /tables`
Creates a new dining table with auto-generated unique QR token.
- **Access**: `RESTAURANT_OWNER`, `BRANCH_MANAGER`
- **Request Body**:
  ```json
  {
    "tableNumber": "T-12",
    "section": "Terrace",
    "capacity": 4
  }
  ```

### `PATCH /tables/{id}/status`
Updates occupancy status (`AVAILABLE`, `OCCUPIED`, `RESERVED`, `DIRTY`).
- **Access**: `RESTAURANT_OWNER`, `BRANCH_MANAGER`, `CASHIER`, `WAITER`

### `POST /tables/{id}/regenerate-qr`
Regenerates a table's QR token, invalidating previously printed QR codes.
- **Access**: `RESTAURANT_OWNER`, `BRANCH_MANAGER`

---

## 📋 4. Menu & Categories (`/menu`)

### `GET /menu/categories`
Lists all menu categories (e.g., Starters, Main Course, Beverages).

### `POST /menu/categories`
Creates a category. (`RESTAURANT_OWNER`, `BRANCH_MANAGER`)

### `GET /menu/items`
Retrieves all food and beverage items with pricing, tax rate, veg/non-veg status, and live availability.

### `POST /menu/items`
Creates a menu item.
- **Request Body**:
  ```json
  {
    "categoryId": "22222222-1111-0000-0000-000000000000",
    "name": "Paneer Butter Masala",
    "description": "Rich cottage cheese gravy in buttery tomato sauce",
    "price": 340.00,
    "costPrice": 120.00,
    "taxRate": 5.00,
    "isVeg": true,
    "preparationTimeMinutes": 15
  }
  ```

### `PATCH /menu/items/{id}/availability`
Instantly toggles an item's in-stock / out-of-stock availability across POS, KDS, and QR ordering.

---

## 🛎️ 5. Orders & Kitchen Display System (`/orders`, `/kitchen`)

### `POST /orders`
Creates an order, reserves inventory, changes table status to `OCCUPIED`, and automatically generates a Kitchen Order Ticket (KOT).
> **Note**: This endpoint enforces subscription operational access checks; expired trials will receive HTTP `403 Forbidden`.
- **Request Body**:
  ```json
  {
    "orderType": "DINE_IN",
    "tableId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "items": [
      {
        "menuItemId": "4fa85f64-5717-4562-b3fc-2c963f66afa7",
        "quantity": 2,
        "notes": "Extra spicy"
      }
    ]
  }
  ```

### `GET /orders`
Paginated and filterable list of orders (by status, date, payment status).

### `GET /kitchen/tickets`
Fetches real-time kitchen order tickets for the KDS Kanban board.

### `PATCH /kitchen/tickets/{id}/status`
Transitions a ticket through the KOT lifecycle:
`PENDING` ➔ `IN_PROGRESS` ➔ `READY` ➔ `COMPLETED`.
- Broadcasts real-time WebSocket events and triggers procedural dual-tone chime (E5 ➔ A5) on kitchen tablets.

---

## 📱 6. Contactless QR Self-Service (`/qr`)

### `GET /qr/menu/{tableId}`
Public endpoint for dining guests scanning table QR codes. Returns restaurant profile, table details, and active menu items.
- **Access**: Public

### `POST /qr/orders`
Public endpoint allowing dining guests to dispatch food orders directly to the kitchen from their smartphones.
- **Access**: Public

---

## 💰 7. Payments & Settlements (`/payments`)

### `POST /payments/settle`
Settles an open order bill via `CASH`, `CARD`, or `UPI`, updates payment status to `PAID`, and automatically frees the table status back to `AVAILABLE`.
- **Request Body**:
  ```json
  {
    "orderId": "7fa85f64-5717-4562-b3fc-2c963f66afa8",
    "amount": 714.00,
    "paymentMethod": "UPI",
    "transactionReference": "UPI9823412349"
  }
  ```

---

## 📦 8. Inventory & Stock (`/inventory`)

### `GET /inventory`
Lists ingredient stock, minimum safety thresholds, and unit measurements.

### `GET /inventory/low-stock`
Returns items currently below their threshold warning levels.

### `POST /inventory/{id}/adjust`
Adjusts inventory count (restock shipment or wastage correction).
- **Request Body**:
  ```json
  {
    "adjustmentQuantity": 25.5,
    "reason": "Restock delivery from vendor"
  }
  ```

---

## 👥 9. Staff & Team (`/staff`)

### `GET /staff`
Roster of employees, assigned roles, and branch locations.

### `POST /staff`
Onboards an employee and generates user credentials. (`RESTAURANT_OWNER`, `BRANCH_MANAGER`)

---

## 📈 10. Analytics & Health (`/analytics`, `/health`)

### `GET /analytics/summary`
Executive performance report: Today's Revenue, Average Order Value (AOV), Table Occupancy Rate, Top 5 Best Sellers.

### `GET /health`
Liveness probe verifying database connectivity, active tenant context, and memory health.

---

## ⚡ 11. WebSocket / STOMP Real-Time Gateway

Connect to `/api/v1/ws` using STOMP client:

### Subscribable Topic Channels:
- `/topic/tenant/{tenantId}/branch/{branchId}/orders`: Live order events (`ORDER_CREATED`, `ORDER_CANCELLED`)
- `/topic/tenant/{tenantId}/branch/{branchId}/kot`: Kitchen display board updates (`KOT_STATUS_CHANGED`, `KOT_READY`)
- `/topic/tenant/{tenantId}/branch/{branchId}/payments`: Bill settlement notifications
- `/topic/tenant/{tenantId}/notifications`: Platform notifications & alerts
