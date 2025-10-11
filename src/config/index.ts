/**
 * Type-safe configuration module
 *
 * Validates environment variables at startup and provides
 * centralized config access across the application.
 */

class Config {
  // Client-side config (public)
  public readonly apiUrl: string;
  public readonly conversationPollingInterval: number;
  public readonly messagePollingInterval: number;

  constructor() {
    // Direct access to Next.js public env vars (replaced at build time)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      throw new Error(
        "Missing required environment variable: NEXT_PUBLIC_API_URL",
      );
    }

    // Validate format
    if (!apiUrl.startsWith("http")) {
      throw new Error(
        "NEXT_PUBLIC_API_URL must start with http:// or https://",
      );
    }

    this.apiUrl = apiUrl;

    // Optional configs with defaults
    this.conversationPollingInterval = Number.parseInt(
      process.env.NEXT_PUBLIC_CONVERSATION_POLLING_INTERVAL || "10000",
    );
    this.messagePollingInterval = Number.parseInt(
      process.env.NEXT_PUBLIC_MESSAGE_POLLING_INTERVAL || "5000",
    );
  }
}

// Export singleton instance
export const config = new Config();
