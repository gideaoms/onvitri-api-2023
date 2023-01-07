export const NODE_ENV = process.env.NODE_ENV as 'development' | 'test' | 'production'

export const APP_PORT = Number(process.env.APP_PORT)

export const APP_HOST = process.env.APP_HOST

export const DATABASE_NAME = process.env.DATABASE_NAME

export const DATABASE_USER = process.env.DATABASE_USER

export const DATABASE_PASS = process.env.DATABASE_PASS

export const DATABASE_PORT = process.env.DATABASE_PORT

export const DATABASE_URL = process.env.DATABASE_URL

export const TOKEN_SECRET = process.env.TOKEN_SECRET as string

export const TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN

export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID as string

export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY as string

export const AWS_S3_ENDPOINT = process.env.AWS_S3_ENDPOINT

export const AWS_S3_NAME = process.env.AWS_S3_NAME

export const SENTRY_DSN = process.env.SENTRY_DSN
