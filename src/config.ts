import { z } from 'zod'

export default z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']),
    PORT: z.coerce.number(),
    HOST: z.string().optional(),
    DATABASE_URL: z.string(),
    TOKEN_SECRET: z.string(),
    TOKEN_EXPIRES_IN: z.string(),
    AWS_ACCESS_KEY_ID: z.string(),
    AWS_SECRET_ACCESS_KEY: z.string(),
    AWS_S3_ENDPOINT: z.string(),
    AWS_S3_NAME: z.string(),
    SENTRY_DSN: z.string().optional(),
  })
  .parse(process.env)
