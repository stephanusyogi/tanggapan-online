import mysql from "mysql2/promise";

const globalForDb = globalThis as unknown as {
  dbPool: mysql.Pool | undefined;
};

export const pool =
  globalForDb.dbPool ??
  mysql.createPool({
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3307),
    user: process.env.DB_USER || "tangmas",
    password: process.env.DB_PASSWORD || "tangmaspassword",
    database: process.env.DB_NAME || "tangmas",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    decimalNumbers: true,
    connectTimeout: 10000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.dbPool = pool;
}

export default pool;
