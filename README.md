# Online Store Frontend

A modern e-commerce platform built with Next.js 14, TypeScript, Tailwind CSS, and GraphQL.

## Features

### Customer Features

- 🏠 **Home Page** - Featured products and search functionality
- 🛍️ **Product Catalog** - Browse products with search and category filters
- 📦 **Product Details** - View product information, images, and stock availability
- 🛒 **Shopping Cart** - Add/remove items, update quantities
- 💳 **Checkout** - Guest checkout with multiple payment options
- 📧 **Order Confirmation** - View order details and status
- 👤 **User Accounts** (Optional) - Register and login to track orders

### Admin Features

- 📊 **Dashboard** - Overview of orders, revenue, and inventory alerts
- ✏️ **Product Management** - Create, update, and delete products
- 📋 **Order Management** - View orders, update status, confirm payments
- ⚙️ **Store Settings** - Customize store name, colors, and bank account details

### Payment Methods

- 💵 **Cash on Delivery (COD)** - Pay when you receive your order
- 🏦 **Bank Transfer** - Transfer to store's bank account with details displayed

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **GraphQL Client**: Apollo Client
- **Backend**: Rails GraphQL API (http://localhost:3000/graphql)

## Project Structure

````
online-store-frontend/
├── app/
│   ├── page.tsx                  # Home page
│   ├── products/
│   │   ├── page.tsx              # Products listing
│   │   └── [id]/page.tsx         # Product detail
│   ├── cart/page.tsx             # Shopping cart
│   ├── checkout/page.tsx         # Checkout flow
│   ├── orders/[id]/page.tsx      # Order confirmation
│   └── admin/
│       ├── layout.tsx            # Admin layout with sidebar
│       ├── page.tsx              # Admin dashboard
│       ├── login/page.tsx        # Admin login
│       ├── products/page.tsx     # Product management
│       ├── orders/page.tsx       # Order management
│       └── settings/page.tsx     # Store settings
├── components/
│   ├── ui/
│   │   └── Navbar.tsx            # Navigation bar with cart
│   └── products/
│       ├── ProductCard.tsx       # Product card component
│       └── ProductGrid.tsx       # Products grid layout
├── lib/
│   ├── graphql/
│   │   ├── client.ts             # Apollo Client setup
│   │   ├── queries.ts            # GraphQL queries
│   │   └── mutations.ts          # GraphQL mutations
│   ├── zustand/
│   │   ├── cartStore.ts          # Cart state management
│   │   ├── authStore.ts          # Authentication state
│   │   └── storeSettingsStore.ts # Store settings state
│   ├── hooks/
│   │   ├── useProducts.ts        # Products hooks
│   │   ├── useAuth.ts            # Authentication hooks
│   │   └── useCheckout.ts        # Checkout hooks
│   ├── providers/
│   │   └── ApolloProvider.tsx    # Apollo Provider wrapper
│   └── types.ts                  # TypeScript interfaces
└── public/                       # Static assets

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Rails backend running on http://localhost:3000
- PostgreSQL database set up

### Installation

1. Install dependencies:
```bash
npm install
````

2. Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/graphql
NEXT_PUBLIC_STORE_NAME=My Online Store
```

3. Start the development server:

```bash
npm run dev
```

4. Open http://localhost:3001 in your browser

### Admin Access

- URL: http://localhost:3001/admin/login
- Email: admin@mystore.com
- Password: password123

## Available Scripts

- `npm run dev` - Start development server on port 3001
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Key Features Implementation

### State Management (Zustand)

**Cart Store** (`lib/zustand/cartStore.ts`):

- Add/remove items
- Update quantities
- Calculate totals
- Persist to localStorage

**Auth Store** (`lib/zustand/authStore.ts`):

- User/admin authentication
- JWT token management
- Login/logout functionality

### GraphQL Integration

**Queries** (`lib/graphql/queries.ts`):

- Get products (with search and category filter)
- Get single product
- Get categories
- Get orders
- Get store settings

**Mutations** (`lib/graphql/mutations.ts`):

- Create order
- User login/register
- Admin login
- Product CRUD operations
- Update order/payment status
- Update store settings

### Custom Hooks

- `useProducts(categoryId, search)` - Fetch and filter products
- `useProduct(id)` - Get single product details
- `useAuth()` - Authentication operations
- `useCheckout()` - Handle checkout process

## Customization

The platform is designed to be easily customizable:

1. **Store Name & Logo**: Update via Admin Settings
2. **Theme Colors**: Change primary/secondary colors in Admin Settings
3. **Bank Account**: Configure payment details in Admin Settings
4. **Contact Info**: Set email and phone in Admin Settings

## Payment Flow

### Cash on Delivery (COD)

1. Customer places order
2. Order status: "pending"
3. Payment recorded as "cash_on_delivery"
4. Admin confirms order
5. Payment confirmed upon delivery

### Bank Transfer

1. Customer places order
2. Bank account details displayed
3. Customer transfers money
4. Admin verifies payment
5. Admin marks payment as "confirmed"

## Future Enhancements

- [ ] Product categories and advanced filtering
- [ ] Product variants (sizes, colors)
- [ ] Multiple product images with gallery
- [ ] Related products
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Discount codes and promotions
- [ ] Email notifications
- [ ] Credit card payment integration (Abhipay)

## API Endpoints

The frontend communicates with the Rails backend through GraphQL:

- **Endpoint**: http://localhost:3000/graphql
- **Authentication**: JWT tokens in Authorization header
- **Format**: `Authorization: Bearer <token>`

## Contributing

This is a customizable e-commerce platform. To customize for a specific client:

1. Update store settings via admin panel
2. Modify theme colors and branding
3. Configure payment details
4. Add products and categories

## License

Private project for client customization.
