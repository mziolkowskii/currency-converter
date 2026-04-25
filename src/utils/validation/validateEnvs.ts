import z from 'zod';

const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.string(),
  EXPO_PUBLIC_API_KEY: z.string(),
});

export const validateEnvs = () =>
  envSchema.parse({
    EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
    EXPO_PUBLIC_API_KEY: process.env.EXPO_PUBLIC_API_KEY,
  });
