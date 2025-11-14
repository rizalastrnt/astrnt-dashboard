# API Documentation

This document describes the API endpoints available in the Astrnt Dashboard application.

## Authentication Endpoints

### POST /api/auth/login

Authenticates a user with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

**Error Responses:**

- **400 Bad Request** - Missing email or password
```json
{
  "error": "Email and password are required"
}
```

- **401 Unauthorized** - Invalid credentials
```json
{
  "error": "Invalid email or password"
}
```

- **500 Internal Server Error** - Server error
```json
{
  "error": "An error occurred during login"
}
```

**Session Cookie:**
Upon successful login, a session cookie is set with the following properties:
- Name: `session`
- HTTP-only: `true`
- Secure: `true` (production only)
- SameSite: `lax`
- Max-Age: 604800 seconds (7 days)
- Path: `/`

**Example Usage:**

```javascript
// Using fetch
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'mypassword',
  }),
});

const data = await response.json();

if (response.ok) {
  console.log('Login successful:', data.user);
  // Redirect to dashboard
  window.location.href = '/dashboard';
} else {
  console.error('Login failed:', data.error);
}
```

```bash
# Using curl
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"mypassword"}' \
  -c cookies.txt
```

---

### POST /api/auth/logout

Logs out the current user by clearing the session cookie.

**Request Body:** None required

**Success Response (200):**
```json
{
  "success": true
}
```

**Error Response (500):**
```json
{
  "error": "An error occurred during logout"
}
```

**Example Usage:**

```javascript
// Using fetch
const response = await fetch('/api/auth/logout', {
  method: 'POST',
});

const data = await response.json();

if (data.success) {
  console.log('Logout successful');
  // Redirect to login
  window.location.href = '/login';
}
```

```bash
# Using curl
curl -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt
```

---

## Security Considerations

### Password Hashing
- All passwords are verified using bcryptjs
- Compatible with Laravel's bcrypt hashing (cost factor 10)
- Passwords are never stored or transmitted in plain text

### Session Security
- Sessions use HTTP-only cookies (cannot be accessed via JavaScript)
- Secure flag enabled in production (HTTPS only)
- SameSite=Lax prevents CSRF attacks
- 7-day expiration with automatic cleanup

### SQL Injection Protection
- All database queries use parameterized statements
- User input is properly sanitized

### Rate Limiting
**Note:** Rate limiting is not currently implemented. For production use, consider adding:
- Login attempt rate limiting
- IP-based throttling
- Account lockout after failed attempts

---

## Error Handling

All endpoints follow a consistent error response format:

```json
{
  "error": "Human-readable error message"
}
```

HTTP status codes used:
- `200` - Success
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (authentication failed)
- `500` - Internal Server Error

---

## Database Schema

The API interacts with the following database structure:

### Table: `cwa_users`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique user identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email address |
| password | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Account creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update time |

---

## Future Enhancements

Consider implementing these additional endpoints for a complete authentication system:

1. **POST /api/auth/register** - User registration
2. **POST /api/auth/forgot-password** - Password reset request
3. **POST /api/auth/reset-password** - Password reset confirmation
4. **GET /api/auth/session** - Verify current session
5. **POST /api/auth/refresh** - Refresh session token
6. **GET /api/auth/user** - Get current user details
7. **PUT /api/auth/user** - Update user profile
8. **POST /api/auth/change-password** - Change password
9. **GET /api/auth/sessions** - List active sessions
10. **DELETE /api/auth/sessions/:id** - Revoke specific session

---

## Testing

### Testing Login Endpoint

```javascript
// test-login.js
async function testLogin() {
  const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'admin@example.com',
      password: 'password',
    }),
  });

  const data = await response.json();
  console.log('Status:', response.status);
  console.log('Response:', data);
}

testLogin();
```

### Testing Logout Endpoint

```javascript
// test-logout.js
async function testLogout() {
  // First login
  await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'admin@example.com',
      password: 'password',
    }),
  });

  // Then logout
  const response = await fetch('http://localhost:3000/api/auth/logout', {
    method: 'POST',
  });

  const data = await response.json();
  console.log('Status:', response.status);
  console.log('Response:', data);
}

testLogout();
```

---

## Support

For issues or questions about the API:
1. Check this documentation
2. Review the [SETUP.md](./SETUP.md) file
3. Check the source code in `app/api/auth/`
