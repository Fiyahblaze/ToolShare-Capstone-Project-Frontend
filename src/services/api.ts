const API_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");

interface ApiOptions extends RequestInit {
  token?: string;
}

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiRequest<T>(
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  if (!API_URL) {
    throw new Error("VITE_API_URL is missing. Check your frontend .env file.");
  }

  const { token, ...requestOptions } = options;
  const headers = new Headers(requestOptions.headers);

  if (requestOptions.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...requestOptions,
    headers,
  });

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
        ? data.message
        : `Request failed (${response.status})`;

    throw new ApiError(message, response.status);
  }

  return data as T;
}