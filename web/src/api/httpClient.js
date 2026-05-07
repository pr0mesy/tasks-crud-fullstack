const DEFAULT_API_BASE_URL = "/api";

const trimSlashes = (value) => value.replace(/^\/+|\/+$/g, "");

const getApiBaseUrl = () => {
  const configuredUrl = import.meta.env.VITE_API_BASE_URL?.trim();
  return configuredUrl || DEFAULT_API_BASE_URL;
};

const buildUrl = (path) => {
  const baseUrl = getApiBaseUrl();
  const normalizedPath = trimSlashes(path);

  if (!normalizedPath) {
    return baseUrl;
  }

  return `${baseUrl.replace(/\/+$/g, "")}/${normalizedPath}`;
};

const getAuthToken = () =>
  localStorage.getItem("access_token") || localStorage.getItem("auth_token");

export async function apiRequest(path, options = {}) {
  const { body, headers, ...requestOptions } = options;
  const token = getAuthToken();

  const response = await fetch(buildUrl(path), {
    ...requestOptions,
    headers: {
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = response.headers.get("content-type") || "";
  const hasJson = contentType.includes("application/json");
  const data = hasJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null
        ? data.message || data.error
        : data;

    throw new Error(message || "Erro ao se comunicar com a API.");
  }

  return data || null;
}
