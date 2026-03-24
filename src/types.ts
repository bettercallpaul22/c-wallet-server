export type ConnectionStatus = "active" | "revoked" | "pending";
export type UserStatus = "active" | "suspended" | "pending";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
};

export type WalletConnection = {
  id: string;
  walletId: string;
  userId: string;
  address: string;
  chain: string;
  status: ConnectionStatus;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
};

export type UserIp = {
  id: string;
  userId: string;
  ip: string;
  note?: string;
  location?: {
    latitude?: number;
    longitude?: number;
    city?: string;
    region?: string;
    country?: string;
    timezone?: string;
    locale?: string;
  };
  createdAt: string;
  updatedAt: string;
};
