# Astrnt Dashboard - Setup Guide

This is a Next.js application with authentication that connects to a MySQL/MariaDB database using the Laravel `cwa_users` table with bcrypt password hashing.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (version 18.x or higher)
- **npm** (comes with Node.js)
- **MySQL** or **MariaDB** database server
- Access to a database with the `cwa_users` table

## Database Setup

### 1. Create the Database (if not exists)

```sql
CREATE DATABASE IF NOT EXISTS astrnt_db;
USE astrnt_db;
```

### 2. Verify or Create the `cwa_users` Table

The application expects a table named `cwa_users` with at least the following columns:

```sql
CREATE TABLE IF NOT EXISTS cwa_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 3. Create a Test User

The password in this table should be hashed using Laravel's bcrypt (which is compatible with bcryptjs). If you're creating users manually for testing:

**Using Node.js (with this project):**

You can use the following Node.js script to generate a bcrypt hash:

```javascript
const bcrypt = require('bcryptjs');

async function hashPassword(password) {
  const hash = await bcrypt.hash(password, 10);
  console.log('Hashed password:', hash);
}

hashPassword('your_password_here');
```

Then insert the user:

```sql
INSERT INTO cwa_users (email, password) 
VALUES ('admin@example.com', '$2a$10$hashed_password_here');
```

**Using Laravel/PHP:**

```php
$password = Hash::make('your_password');
// Use this $password in your INSERT statement
```

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd astrnt-dashboard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit the `.env` file with your database credentials:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_database_password
DB_NAME=astrnt_db

# Application Configuration
NODE_ENV=development
```

**Important Configuration Notes:**

- `DB_HOST`: Your MySQL server host (usually `localhost` for local development)
- `DB_PORT`: MySQL port (default is `3306`)
- `DB_USER`: Your database username
- `DB_PASSWORD`: Your database password
- `DB_NAME`: The database name containing the `cwa_users` table

### 4. Test Database Connection

Before running the application, ensure your database is accessible. You can test the connection using:

```bash
mysql -h localhost -u root -p astrnt_db
```

## Running the Application

### Development Mode

Start the development server:

```bash
npm run dev
```

The application will be available at: `http://localhost:3000`

### Production Build

Build the application for production:

```bash
npm run build
```

Run the production server:

```bash
npm start
```

## Using the Application

### Login Page

1. Navigate to `http://localhost:3000` (automatically redirects to `/login`)
2. Enter your email and password from the `cwa_users` table
3. Click "Sign in"

**Note:** The password verification uses bcryptjs which is compatible with Laravel's bcrypt hashing.

### After Login

Upon successful login:
- You'll be redirected to `/dashboard`
- A session cookie is created (valid for 7 days)
- You can logout using the "Logout" button in the dashboard

## Project Structure

```
astrnt-dashboard/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── login/
│   │       │   └── route.ts       # Login API endpoint
│   │       └── logout/
│   │           └── route.ts       # Logout API endpoint
│   ├── dashboard/
│   │   └── page.tsx               # Dashboard page (protected)
│   ├── login/
│   │   └── page.tsx               # Login page UI
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Home page (redirects to login)
├── lib/
│   ├── auth.ts                    # Authentication utilities (bcrypt)
│   └── db.ts                      # Database connection and queries
├── .env.example                   # Environment variables template
├── .gitignore                     # Git ignore rules
├── next.config.js                 # Next.js configuration
├── package.json                   # Dependencies and scripts
├── postcss.config.mjs             # PostCSS configuration
├── tailwind.config.ts             # Tailwind CSS configuration
└── tsconfig.json                  # TypeScript configuration
```

## Key Components

### Authentication Flow

1. **Login Page** (`app/login/page.tsx`):
   - User enters email and password
   - Form submits to `/api/auth/login`

2. **Login API** (`app/api/auth/login/route.ts`):
   - Validates input
   - Queries `cwa_users` table for user by email
   - Verifies password using bcryptjs (compatible with Laravel bcrypt)
   - Creates session cookie on success

3. **Database Layer** (`lib/db.ts`):
   - MySQL connection pool
   - User query functions
   - Compatible with `cwa_users` table structure

4. **Auth Utilities** (`lib/auth.ts`):
   - Password verification with bcryptjs
   - Compatible with Laravel's bcrypt hashing

### Session Management

- Sessions are stored in HTTP-only cookies
- Cookie name: `session`
- Default expiration: 7 days
- Secure flag enabled in production
- SameSite: Lax

## Security Considerations

1. **Passwords**: Never store plain text passwords. The application expects bcrypt hashed passwords.
2. **Environment Variables**: Never commit `.env` file to version control.
3. **HTTPS**: Use HTTPS in production (cookies are set as secure in production mode).
4. **Database Credentials**: Use strong passwords and restrict database user permissions.

## Troubleshooting

### Database Connection Issues

If you get database connection errors:

1. Verify MySQL is running: `systemctl status mysql` or `mysqladmin ping`
2. Check credentials in `.env` file
3. Ensure the database exists: `mysql -u root -p -e "SHOW DATABASES;"`
4. Verify the user has permissions: `GRANT ALL PRIVILEGES ON astrnt_db.* TO 'your_user'@'localhost';`

### Login Fails with Correct Credentials

1. Verify the password in database is bcrypt hashed (starts with `$2a$`, `$2b$`, or `$2y$`)
2. Check the bcrypt cost factor (should be 10 for Laravel compatibility)
3. Verify email is exact match (case-sensitive)

### Build Errors

If you encounter build errors:

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Port Already in Use

If port 3000 is already in use:

```bash
# Run on a different port
PORT=3001 npm run dev
```

## Production Deployment

### Environment Variables

Set these in your production environment:

```env
DB_HOST=your-production-db-host
DB_PORT=3306
DB_USER=your-production-db-user
DB_PASSWORD=your-production-db-password
DB_NAME=astrnt_db
NODE_ENV=production
```

### Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use HTTPS
- [ ] Set strong database passwords
- [ ] Restrict database access to application server only
- [ ] Enable database connection pooling
- [ ] Set up database backups
- [ ] Monitor application logs
- [ ] Set up rate limiting for login endpoint

## Additional Features to Consider

For production use, consider adding:

1. **Rate Limiting**: Prevent brute force attacks on login
2. **CSRF Protection**: Add CSRF tokens to forms
3. **Password Reset**: Implement forgot password functionality
4. **Email Verification**: Verify user emails
5. **2FA**: Add two-factor authentication
6. **Session Management**: Add ability to view/revoke active sessions
7. **Logging**: Implement comprehensive logging
8. **Monitoring**: Set up application monitoring

## Support

For issues or questions:
- Check the troubleshooting section above
- Review Next.js documentation: https://nextjs.org/docs
- Check MySQL connection pooling: https://github.com/sidorares/node-mysql2

## License

[Your License Here]
