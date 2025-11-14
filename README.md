# Astrnt Dashboard

A Next.js dashboard application with authentication that connects to a MySQL database using Laravel's bcrypt password hashing.

## Features

- ✨ Modern, responsive login UI
- 🔐 Secure authentication with bcrypt (Laravel compatible)
- 🗄️ MySQL database integration
- 🎨 Tailwind CSS for styling
- 📱 Mobile-friendly design
- 🚀 Built with Next.js 14+ and TypeScript

## Quick Start

```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the login page.

## Documentation

For detailed setup instructions, database configuration, and troubleshooting, see **[SETUP.md](./SETUP.md)**.

## Project Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: MySQL/MariaDB
- **Authentication**: bcryptjs (Laravel compatible)
- **Session**: Cookie-based sessions

## Database Requirements

This application connects to a table named `cwa_users` with the following structure:

```sql
CREATE TABLE cwa_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

Passwords must be hashed using bcrypt (compatible with Laravel's `Hash::make()`).

**Quick Setup:**
```bash
# Create database and table
mysql -u root -p < database/schema.sql

# Generate password hash
node database/generate-hash.js your_password
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

Required environment variables (see `.env.example`):

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=astrnt_db
NODE_ENV=development
```

## License

ISC
