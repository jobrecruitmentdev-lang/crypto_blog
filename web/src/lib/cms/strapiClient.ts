export const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://127.0.0.1:1337";
export const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || "";

export async function fetchFromStrapi(endpoint: string, options: RequestInit = {}) {
  const url = `${STRAPI_URL}/api${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(STRAPI_API_TOKEN ? { Authorization: `Bearer ${STRAPI_API_TOKEN}` } : {}),
    },
    next: { revalidate: 3600, tags: ['strapi'] },
    ...options,
  };

  const response = await fetch(url, defaultOptions);
  
  if (!response.ok) {
    console.error(`Failed to fetch from Strapi: ${response.status} ${response.statusText}`);
    return null;
  }
  
  return response.json();
}
