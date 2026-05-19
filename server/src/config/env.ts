import 'dotenv/config'

function required(key: string): string {
  const val = process.env[key]
  if (!val) throw new Error(`Missing required env var: ${key}`)
  return val
}

export const env = {
  port:        parseInt(process.env['PORT'] ?? '4000', 10),
  mongoUri:    required('MONGODB_URI'),
  redisUrl:    required('REDIS_URL'),
  jwtSecret:   required('JWT_SECRET'),
  jwtExpiresIn: process.env['JWT_EXPIRES_IN'] ?? '7d',
  corsOrigins: (process.env['CORS_ORIGINS'] ?? 'http://localhost:3000').split(','),
}
