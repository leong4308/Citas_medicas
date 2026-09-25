module.exports = {
  development: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || "citas_medicas",
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
  },
  test: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || "citas_medicas_test",
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
  },
  production: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
};
