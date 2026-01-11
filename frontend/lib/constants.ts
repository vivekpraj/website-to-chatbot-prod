const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Remove trailing slashes
export const API_BASE_URL = baseUrl.replace(/\/+$/, "");