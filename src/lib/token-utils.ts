import { authApi } from "./auth-api";

const TOKEN_EXPIRATION_KEY = "token_expiration";
const REFRESH_BUFFER_SECONDS = 300; // Refresh 5 minutes before expiration

/**
 * Store tokens in cookies and expiration time in localStorage
 */
export function setTokens(
  accessToken: string,
  refreshToken: string,
  expiresIn: number = 43200 // Default 12 hours
): void {
  // Store tokens in cookies
  const maxAge = expiresIn; // in seconds
  document.cookie = `accessToken=${accessToken}; path=/; max-age=${maxAge}; SameSite=Lax`;
  document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${maxAge}; SameSite=Lax`;

  // Store expiration timestamp in localStorage
  const expirationTime = Date.now() + expiresIn * 1000;
  localStorage.setItem(TOKEN_EXPIRATION_KEY, expirationTime.toString());
}

/**
 * Get access token from cookies
 */
export function getAccessToken(): string | null {
  const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
  return match ? match[2] : null;
}

/**
 * Get refresh token from cookies
 */
export function getRefreshToken(): string | null {
  const match = document.cookie.match(new RegExp("(^| )refreshToken=([^;]+)"));
  return match ? match[2] : null;
}

/**
 * Get token expiration timestamp from localStorage
 */
export function getTokenExpiration(): number | null {
  const expiration = localStorage.getItem(TOKEN_EXPIRATION_KEY);
  return expiration ? parseInt(expiration, 10) : null;
}

/**
 * Clear all tokens and expiration data
 */
export function clearTokens(): void {
  document.cookie = "accessToken=; path=/; max-age=0";
  document.cookie = "refreshToken=; path=/; max-age=0";
  localStorage.removeItem(TOKEN_EXPIRATION_KEY);
  localStorage.removeItem("user_data");
  localStorage.removeItem("user_role");
}

/**
 * Check if token will expire within buffer time
 */
export function isTokenExpiringSoon(
  bufferSeconds: number = REFRESH_BUFFER_SECONDS
): boolean {
  const expiration = getTokenExpiration();
  if (!expiration) return true;

  const now = Date.now();
  const timeUntilExpiration = expiration - now;
  return timeUntilExpiration <= bufferSeconds * 1000;
}

/**
 * Refresh the access token using the refresh token
 */
export async function refreshAccessToken(): Promise<boolean> {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      console.error("No refresh token available");
      return false;
    }

    const response = await authApi.refreshToken(refreshToken);

    if (response.success && response.data) {
      const {
        accessToken,
        refreshToken: newRefreshToken,
        expiresIn,
      } = response.data;

      // Update tokens with new values
      setTokens(accessToken, newRefreshToken, expiresIn || 43200);

      console.log("Token refreshed successfully");
      return true;
    } else {
      console.error("Token refresh failed:", response.error);
      return false;
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    return false;
  }
}

/**
 * Schedule automatic token refresh
 * Returns a cleanup function to clear the interval
 */
export function scheduleTokenRefresh(
  onRefreshFailure?: () => void
): () => void {
  const checkAndRefresh = async () => {
    if (isTokenExpiringSoon()) {
      console.log("Token expiring soon, attempting refresh...");
      const success = await refreshAccessToken();

      if (!success && onRefreshFailure) {
        onRefreshFailure();
      }
    }
  };

  // Check immediately
  checkAndRefresh();

  // Check every minute
  const intervalId = setInterval(checkAndRefresh, 60 * 1000);

  // Return cleanup function
  return () => clearInterval(intervalId);
}
