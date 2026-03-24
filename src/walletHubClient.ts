import type { WalletConnection, UserIp } from "./types.js";

const baseUrl = process.env.WALLET_HUB_URL?.replace(/\/$/, "") ?? "";
const apiKey = process.env.WALLET_HUB_API_KEY;

const withAuth = (headers: HeadersInit = {}) => {
  if (!apiKey) return headers;
  return { ...headers, Authorization: `Bearer ${apiKey}` };
};

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  if (!baseUrl) {
    throw new Error("WALLET_HUB_URL is not configured");
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: withAuth({ "Content-Type": "application/json", ...(init?.headers ?? {}) }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Wallet Hub error (${response.status}): ${message}`);
  }

  return (await response.json()) as T;
};

export const walletHubClient = {
  async ping() {
    return request<{ status: string }>("/health");
  },
  async listConnections() {
    return request<WalletConnection[]>("/connections");
  },
  async listUserIps() {
    return request<UserIp[]>("/user-ips");
  },
};
