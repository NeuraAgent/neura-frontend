import { z } from 'zod';

// Define the environment variables schema
const envSchema = z.object({
  // Authentication API Configuration
  VITE_API_URL: z
    .string()
    .min(1, 'VITE_API_URL cannot be empty')
    .describe('API base URL'),

  // WebSocket Configuration
  VITE_WEBSOCKET_URL: z
    .string()
    .min(1, 'VITE_WEBSOCKET_URL cannot be empty')
    .describe('WebSocket server URL'),

  // Application Configuration
  VITE_APP_NAME: z
    .string()
    .min(1, 'VITE_APP_NAME cannot be empty')
    .describe('Application name'),
  VITE_MINIO_ACCESS_KEY: z
    .string()
    .min(1, 'VITE_MINIO_ACCESS_KEY cannot be empty')
    .describe('MinIO access key'),
  VITE_MINIO_SECRET_KEY: z
    .string()
    .min(1, 'VITE_MINIO_SECRET_KEY cannot be empty')
    .describe('MinIO secret key'),

  VITE_MINIO_BUCKET_NAME: z
    .string()
    .min(1, 'VITE_MINIO_BUCKET_NAME cannot be empty')
    .describe('MinIO bucket name'),
  VITE_MINIO_ENDPOINT: z
    .string()
    .min(1, 'VITE_MINIO_ENDPOINT cannot be empty')
    .describe('MinIO endpoint'),
  VITE_SESSION_TTL: z
    .string()
    .min(1, 'VITE_SESSION_TTL cannot be empty')
    .describe('Vite session ttl'),

  VITE_APP_VERSION: z
    .string()
    .regex(
      /^\d+\.\d+\.\d+$/,
      'VITE_APP_VERSION must follow semantic versioning (x.y.z)'
    )
    .describe('Application version'),

  // Development Configuration
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development')
    .describe('Node environment'),
});

// Type for validated environment variables
export type Env = z.infer<typeof envSchema>;

// Validation function
export function validateEnv(): Env {
  try {
    // Parse and validate environment variables
    const env = envSchema.parse(import.meta.env);

    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment validation failed:');
      console.error('');

      // Group errors by field
      const errorsByField = error.issues.reduce(
        (acc: Record<string, string[]>, err) => {
          const field = err.path.join('.');
          if (!acc[field]) {
            acc[field] = [];
          }
          acc[field].push(err.message);
          return acc;
        },
        {} as Record<string, string[]>
      );

      // Display errors in a user-friendly format
      Object.entries(errorsByField).forEach(([field, messages]) => {
        console.error(`  ${field}:`);
        messages.forEach((message: string) => {
          console.error(`    - ${message}`);
        });
        console.error('');
      });

      console.error(
        'Please check your .env file and ensure all required environment variables are set correctly.'
      );
      console.error('');
      console.error('Required environment variables:');
      console.error('  - VITE_API_URL: API base URL');
      console.error('  - VITE_WEBSOCKET_URL: WebSocket server URL');
      console.error('  - VITE_APP_NAME: Application name');
      console.error('  - VITE_MINIO_ACCESS_KEY: MinIO access key');
      console.error('  - VITE_MINIO_SECRET_KEY: MinIO secret key');

      console.error('  - VITE_MINIO_BUCKET_NAME: MinIO bucket name');
      console.error('  - VITE_MINIO_ENDPOINT: MinIO endpoint');
      console.error('  - VITE_SESSION_TTL: Vite session ttl');

      console.error(
        '  - VITE_APP_VERSION: Application version (semantic versioning)'
      );
      console.error(
        '  - NODE_ENV: Node environment (development, production, test)'
      );

      // Throw error instead of process.exit (which doesn't exist in browser)
      throw new Error(
        'Environment validation failed. Check console for details.'
      );
    }

    console.error('❌ Unexpected error during environment validation:', error);
    throw error;
  }
}

// Export the validated environment variables
export const env = validateEnv();
