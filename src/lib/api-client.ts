/**
 * API Client Configuration
 *
 * Configures the generated Hey API client with runtime baseUrl from environment.
 * The generated client (src/client/) provides type-safe API functions and types
 * from the FastAPI OpenAPI schema.
 */

import { createClient, createConfig } from "@/client/client";
import type { ClientOptions } from "@/client/client/types.gen";
import { config } from "@/config";

// Create configured client instance with runtime baseUrl
// Note: OpenAPI schema paths already include /api prefix, so use base URL without /api
const baseUrl = config.apiUrl.replace(/\/api\/?$/, "");

export const apiClient = createClient(
  createConfig<ClientOptions>({
    baseUrl,
    throwOnError: false,
  }),
);

// Re-export all generated SDK functions and types for convenience
export * from "@/client";
