# Football E-Commerce Store Backend API

A complete professional REST API for a Football E-Commerce Store. Built with Node.js, Express, MongoDB, and Mongoose.

## Features

- Full featured shopping cart & orders
- Product reviews and ratings (scalable)
- Top products carousel (Featured)
- Product pagination & search
- User profile with orders
- Admin product management
- Admin user management
- Admin Order details page
- Mark orders as delivered option
- Checkout process (shipping, payment method, etc)
- Database seeder script
- JWT Authentication

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL Database
- **Mongoose** - Object Data Modeling (ODM)
- **JWT** - Authentication
- **Bcrypt.js** - Password hashing
- **Multer** - File uploading

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- NPM

### Installation

1. Install dependencies

```bash
npm install
```

2. Run the seeder to populate the database with sample data (Note: it will clear existing data)

```bash
npm run data:import
```

3. Start the server

```bash
# Run in development mode (with nodemon)
npm run dev

# Run in production mode
npm start
```

## API Documentation

- Auth: `/api/auth`
- Products: `/api/products`
- Cart: `/api/cart`
- Orders: `/api/orders`
- Admin: `/api/admin`

All responses follow the standard format:
```json
{
  "success": true,
  "message": "Status description",
  "data": {}
}
```

## License

This project is open-source.
