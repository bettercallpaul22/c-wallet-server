import { randomUUID } from "crypto";
import type { User, UserIp, WalletConnection } from "./types.js";

const now = () => new Date().toISOString();

const connections = new Map<string, WalletConnection>();
const users = new Map<string, User>();
const userIps = new Map<string, UserIp>();

export const userStore = {
  list() {
    return Array.from(users.values());
  },
  get(id: string) {
    return users.get(id) ?? null;
  },
  create(input: Omit<User, "id" | "createdAt" | "updatedAt">) {
    const id = randomUUID();
    const timestamp = now();
    const user: User = {
      id,
      createdAt: timestamp,
      updatedAt: timestamp,
      ...input,
    };
    users.set(id, user);
    return user;
  },
  update(id: string, patch: Partial<User>) {
    const existing = users.get(id);
    if (!existing) return null;
    const updated: User = {
      ...existing,
      ...patch,
      id,
      updatedAt: now(),
    };
    users.set(id, updated);
    return updated;
  },
  remove(id: string) {
    return users.delete(id);
  },
};

export const connectionStore = {
  list() {
    return Array.from(connections.values());
  },
  get(id: string) {
    return connections.get(id) ?? null;
  },
  create(input: Omit<WalletConnection, "id" | "createdAt" | "updatedAt">) {
    const id = randomUUID();
    const timestamp = now();
    const connection: WalletConnection = {
      id,
      createdAt: timestamp,
      updatedAt: timestamp,
      ...input,
    };
    connections.set(id, connection);
    return connection;
  },
  update(id: string, patch: Partial<WalletConnection>) {
    const existing = connections.get(id);
    if (!existing) return null;
    const updated: WalletConnection = {
      ...existing,
      ...patch,
      id,
      updatedAt: now(),
    };
    connections.set(id, updated);
    return updated;
  },
  remove(id: string) {
    return connections.delete(id);
  },
};

export const userIpStore = {
  list() {
    return Array.from(userIps.values());
  },
  get(id: string) {
    return userIps.get(id) ?? null;
  },
  create(input: Omit<UserIp, "id" | "createdAt" | "updatedAt">) {
    const id = randomUUID();
    const timestamp = now();
    const entry: UserIp = {
      id,
      createdAt: timestamp,
      updatedAt: timestamp,
      ...input,
    };
    userIps.set(id, entry);
    return entry;
  },
  update(id: string, patch: Partial<UserIp>) {
    const existing = userIps.get(id);
    if (!existing) return null;
    const updated: UserIp = {
      ...existing,
      ...patch,
      id,
      updatedAt: now(),
    };
    userIps.set(id, updated);
    return updated;
  },
  remove(id: string) {
    return userIps.delete(id);
  },
};
