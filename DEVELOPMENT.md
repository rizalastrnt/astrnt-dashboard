# Development Guide

This guide is for developers who want to contribute to or extend the Astrnt Dashboard project.

## Development Environment Setup

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- MySQL or MariaDB 8.0+
- Git
- A code editor (VS Code recommended)

### Initial Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd astrnt-dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up the database:**
   ```bash
   mysql -u root -p < database/schema.sql
   ```

4. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your local database credentials
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

## Project Structure

```
astrnt-dashboard/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   └── auth/                 # Authentication endpoints
│   │       ├── login/
│   │       │   └── route.ts      # Login API
│   │       └── logout/
│   │           └── route.ts      # Logout API
│   ├── dashboard/                # Dashboard page
│   │   └── page.tsx
│   ├── login/                    # Login page
│   │   └── page.tsx
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── lib/                          # Utility functions
│   ├── auth.ts                   # Auth utilities (bcrypt)
│   └── db.ts                     # Database utilities
├── database/                     # Database files
│   ├── schema.sql                # Database schema
│   └── generate-hash.js          # Password hash generator
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
├── next.config.js                # Next.js config
├── package.json                  # Dependencies
├── postcss.config.mjs            # PostCSS config
├── tailwind.config.ts            # Tailwind config
├── tsconfig.json                 # TypeScript config
├── API.md                        # API documentation
├── SETUP.md                      # Setup guide
└── README.md                     # Project overview
```

## Development Workflow

### Running the Application

```bash
# Development mode (with hot reload)
npm run dev

# Production build
npm run build

# Production mode
npm start
```

### Code Style

This project uses:
- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** (recommended) for code formatting

### Making Changes

1. **Create a new branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**

3. **Test your changes:**
   - Test in browser at http://localhost:3000
   - Test login/logout flow
   - Test with different users

4. **Build the project:**
   ```bash
   npm run build
   ```

5. **Commit your changes:**
   ```bash
   git add .
   git commit -m "Description of changes"
   ```

## Key Components

### Authentication Flow

1. **User submits login form** → `app/login/page.tsx`
2. **POST to /api/auth/login** → `app/api/auth/login/route.ts`
3. **Query database** → `lib/db.ts` → `getUserByEmail()`
4. **Verify password** → `lib/auth.ts` → `verifyPassword()`
5. **Create session** → Set cookie with user data
6. **Redirect to dashboard** → `app/dashboard/page.tsx`

### Database Connection

The `lib/db.ts` file manages database connections:
- Uses connection pooling for efficiency
- Environment-based configuration
- Parameterized queries for security

```typescript
// Example: Adding a new database query
export async function getUserById(id: number): Promise<User | null> {
  const db = getDatabase();
  const [rows] = await db.query<mysql.RowDataPacket[]>(
    'SELECT id, email FROM cwa_users WHERE id = ?',
    [id]
  );
  return rows.length > 0 ? (rows[0] as User) : null;
}
```

### Adding New Pages

1. Create a new folder in `app/` directory
2. Add a `page.tsx` file
3. Export a default React component

Example:
```typescript
// app/profile/page.tsx
export default function ProfilePage() {
  return (
    <div>
      <h1>User Profile</h1>
      {/* Your component code */}
    </div>
  );
}
```

### Adding New API Routes

1. Create a folder in `app/api/` directory
2. Add a `route.ts` file
3. Export HTTP method handlers (GET, POST, etc.)

Example:
```typescript
// app/api/users/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  // Your logic here
  return NextResponse.json({ data: [] });
}

export async function POST(request: Request) {
  const body = await request.json();
  // Your logic here
  return NextResponse.json({ success: true });
}
```

## Database Development

### Adding New Tables

1. Update `database/schema.sql`:
   ```sql
   CREATE TABLE new_table (
     id INT AUTO_INCREMENT PRIMARY KEY,
     -- your columns
   );
   ```

2. Create TypeScript interface in `lib/db.ts`:
   ```typescript
   export interface NewTable {
     id: number;
     // your fields
   }
   ```

3. Add query functions:
   ```typescript
   export async function getNewTableById(id: number): Promise<NewTable | null> {
     // implementation
   }
   ```

### Database Migrations

For production, consider using a migration tool like:
- [Knex.js](https://knexjs.org/)
- [TypeORM](https://typeorm.io/)
- [Prisma](https://www.prisma.io/)

## Testing

### Manual Testing Checklist

- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Logout functionality
- [ ] Session persistence (refresh page while logged in)
- [ ] Protected routes (try accessing /dashboard without login)
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Form validation
- [ ] Error messages display correctly

### Testing Database Connection

```typescript
// test-db-connection.ts
import { getDatabase } from './lib/db';

async function testConnection() {
  try {
    const db = getDatabase();
    const [rows] = await db.query('SELECT 1 as test');
    console.log('Database connection successful:', rows);
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

testConnection();
```

## Common Tasks

### Adding a New User via CLI

```bash
# Generate password hash
node database/generate-hash.js newpassword123

# Connect to MySQL
mysql -u root -p astrnt_db

# Insert user
INSERT INTO cwa_users (email, password) 
VALUES ('newuser@example.com', '$2b$10$...');
```

### Updating User Password

```sql
-- First, generate hash using: node database/generate-hash.js newpassword
UPDATE cwa_users 
SET password = '$2b$10$...' 
WHERE email = 'user@example.com';
```

### Viewing Active Sessions

Currently, sessions are stored in cookies. To implement server-side session storage:

1. Add a `sessions` table
2. Store session ID in cookie
3. Store session data in database
4. Add session cleanup cron job

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or run on different port
PORT=3001 npm run dev
```

### Database Connection Issues

1. Check MySQL is running:
   ```bash
   systemctl status mysql
   ```

2. Verify credentials in `.env`

3. Test connection:
   ```bash
   mysql -h localhost -u root -p -e "SHOW DATABASES;"
   ```

### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

## Best Practices

### Security

- ✅ Never commit `.env` file
- ✅ Use parameterized queries
- ✅ Validate all user input
- ✅ Use HTTP-only cookies
- ✅ Enable HTTPS in production
- ✅ Hash passwords with bcrypt
- ✅ Set secure cookie flags in production

### Code Quality

- ✅ Use TypeScript types
- ✅ Handle errors gracefully
- ✅ Add meaningful error messages
- ✅ Keep functions small and focused
- ✅ Comment complex logic
- ✅ Use async/await consistently

### Performance

- ✅ Use database connection pooling
- ✅ Minimize database queries
- ✅ Use Next.js image optimization
- ✅ Enable caching where appropriate
- ✅ Lazy load components when possible

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [bcrypt.js Documentation](https://github.com/dcodeIO/bcrypt.js)

## Support

If you need help:
1. Check existing documentation
2. Search for similar issues
3. Create a detailed issue report
4. Include error messages and steps to reproduce
