# Restaurant Cashier Module (FER202)

## Overview
This is the cashier module for the Dookki restaurant management system. It handles payment processing for pending orders (ready for checkout).

## Features
- View all pending orders ready for payment
- Support for both Buffet and À la carte orders
- Display buffet packages and add-ons
- Process payments with discount support (VND/Percent)
- Multiple payment methods (Cash, Card, Other)
- Real-time order updates
- Itemized bill display with buffet details
- Role-based access (Staff/Admin only)
- Print invoice functionality

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Backend (json-server)
```bash
npx json-server --watch db.json --port 9999
```

### 3. Start Frontend (in new terminal)
```bash
npm start
```

### 4. Access Cashier Module
Navigate to: `http://localhost:3000/cashier`

### 5. Login (for testing)
Use these credentials:
- Staff: username: `staff`, password: `123456`
- Admin: username: `admin`, password: `admin123`

## Database Schema

### Orders Flow
- `ordering` → `pending` → `completed`

### Key Tables
- **orders**: Main order data with buffet/à la carte support
- **orderItems**: Individual items with type (buffet/alacarte)
- **buffets**: Buffet packages (Standard/Premium)
- **buffetAddons**: Add-on items for buffets
- **menuItems**: À la carte menu items
- **menuCategories**: Menu categorization
- **tables**: Restaurant tables with capacity
- **users**: Staff and admin accounts

## Order Status Flow
1. **ordering**: Customer is ordering/adding items
2. **pending**: Order ready for payment (cashier view)
3. **completed**: Payment processed successfully

## File Structure
```
src/
├── pages/
│   └── CashierDashboard.jsx    # Main cashier page
├── features/
│   └── cashier/
│       ├── PaymentModal.jsx    # Payment processing modal
│       └── OrderBill.jsx       # Bill display component
├── context/
│   └── AuthContext.js          # Authentication context
├── api/
│   └── http.js                 # API client
└── App.js                      # Main app with routing
```

## Usage
1. Orders with status "served" will appear in the cashier dashboard
2. Click "Thanh toán" to open payment modal
3. Review itemized bill
4. Enter discount (optional)
5. Select payment method
6. Confirm payment - order status changes to "completed"

## Integration with Main Project
To integrate with your main restaurant project:
1. Copy the `src/features/cashier/` folder
2. Copy `src/pages/CashierDashboard.jsx`
3. Add the cashier route to your main App.js
4. Update your backend schema with the new order fields
5. Ensure AuthContext and http client are available