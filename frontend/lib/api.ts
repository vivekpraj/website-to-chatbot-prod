import { API_BASE_URL } from "./constants";

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem("access_token");

  // Remove leading slash from endpoint if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  // Ensure API_BASE_URL doesn't end with slash and endpoint doesn't start with slash
  const url = `${API_BASE_URL}/${cleanEndpoint}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "API request failed");
  }

  return res.json();
}