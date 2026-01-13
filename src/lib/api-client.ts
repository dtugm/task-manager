import { ApiResponse } from "@/types/auth";

export const BASE_URL =
  "https://internal-service-production.up.railway.app/api/v1";

interface RefreshResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

function setCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export async function fetcher<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (process.env.NEXT_PUBLIC_REGISTER_APIKEY) {
    headers["x-api-key"] = process.env.NEXT_PUBLIC_REGISTER_APIKEY;
  }

  const makeRequest = async (overrideHeaders?: Record<string, string>) => {
    return fetch(`${BASE_URL}${url}`, {
      ...options,
      headers: { ...headers, ...overrideHeaders },
    });
  };

  let response = await makeRequest();

  if (response.status === 401) {
    if (typeof window !== "undefined") {
      const refreshToken = getCookie("refreshToken");

      if (!refreshToken) {
      } else {
        if (!isRefreshing) {
          isRefreshing = true;

          try {
            const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...(process.env.NEXT_PUBLIC_REGISTER_APIKEY
                  ? { "x-api-key": process.env.NEXT_PUBLIC_REGISTER_APIKEY }
                  : {}),
              },
              body: JSON.stringify({ refresh_token: refreshToken }),
            });

            if (refreshRes.ok) {
              const data = await refreshRes.json();
              if (data.success && data.data && data.data.accessToken) {
                const newAccessToken = data.data.accessToken;
                const newRefreshToken = data.data.refreshToken; // If rotated

                // Update Cookies
                setCookie("accessToken", newAccessToken, 604800); // 7 days
                if (newRefreshToken) {
                  setCookie("refreshToken", newRefreshToken, 604800);
                }

                onRefreshed(newAccessToken);
                isRefreshing = false;

                // Retry original request
                return makeRequest({
                  ...headers,
                  Authorization: `Bearer ${newAccessToken}`,
                }).then(async (retryRes) => {
                  const text = await retryRes.text();
                  const retryData = text ? JSON.parse(text) : {};
                  if (!retryRes.ok) {
                    throw new Error(
                      retryData.error?.message || "An error occurred"
                    );
                  }
                  return retryData;
                });
              }
            } else {
              isRefreshing = false;
              document.cookie = "accessToken=; Max-Age=0; path=/;";
              document.cookie = "refreshToken=; Max-Age=0; path=/;";
              window.location.href = "/login";
            }
          } catch (error) {
            isRefreshing = false;
            console.error("Token refresh error", error);
            document.cookie = "accessToken=; Max-Age=0; path=/;";
            document.cookie = "refreshToken=; Max-Age=0; path=/;";
            window.location.href = "/login";
          }
        }

        // If refreshing is already in progress, wait for it
        return new Promise<T>((resolve, reject) => {
          addRefreshSubscriber((newToken) => {
            makeRequest({
              ...headers,
              Authorization: `Bearer ${newToken}`,
            })
              .then(async (retryRes) => {
                const text = await retryRes.text();
                const retryData = text ? JSON.parse(text) : {};
                if (!retryRes.ok) {
                  reject(
                    new Error(retryData.error?.message || "An error occurred")
                  );
                } else {
                  resolve(retryData);
                }
              })
              .catch(reject);
          });
        });
      }
    }
  }

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(data.error?.message || "An error occurred");
  }

  return data;
}
