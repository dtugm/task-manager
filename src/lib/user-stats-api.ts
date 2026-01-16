import { UserStatsFilters, UserStatsResponse } from "@/types/user-stats";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://internal-service-production.up.railway.app/api/v1";

export const userStatsApi = {
  getUserStats: async (
    token: string,
    filters?: UserStatsFilters
  ): Promise<UserStatsResponse> => {
    const queryParams = new URLSearchParams();
    if (filters?.startDate) queryParams.append("startDate", filters.startDate);
    if (filters?.endDate) queryParams.append("endDate", filters.endDate);

    const response = await fetch(
      `${BASE_URL}/tasks/stats/users?${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user stats");
    }

    return response.json();
  },
};
