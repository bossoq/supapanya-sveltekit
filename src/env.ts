import { defineEnvVars } from '@sveltejs/kit/env'

export const variables = defineEnvVars({
  PUBLIC_GOOGLE_ANALYTICS: { public: true, static: true },
  SERVICE_CLIENT_EMAIL: { static: true },
  SERVICE_PRIVATE_KEY: { static: true },
  SERVICE_SUBJECT: { static: true },
  PUBSUB_TOPIC: { static: true },
  DATABASE_URL: { schema: (input) => input ?? '' },
  JWT_SECRET: { static: true }
})
