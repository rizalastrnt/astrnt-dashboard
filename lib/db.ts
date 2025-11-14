import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

export function getDatabase() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'astrnt_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}

export interface User {
  id: number;
  email: string;
  password: string;
  created_at?: Date;
  updated_at?: Date;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const db = getDatabase();
  const [rows] = await db.query<mysql.RowDataPacket[]>(
    'SELECT id, email, password FROM cwa_users WHERE email = ?',
    [email]
  );
  
  if (rows.length === 0) {
    return null;
  }
  
  return rows[0] as User;
}
