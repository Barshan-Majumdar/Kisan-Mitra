/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Clerk Publishable Key for user authentication.
   * e.g., pk_test_... or pk_live_...
   */
  readonly VITE_CLERK_PUBLISHABLE_KEY: string;

  /**
   * Base URL for the Kisan-Mitra Express Backend API.
   * Default: http://localhost:3000/api
   */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
