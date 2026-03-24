import "dotenv/config";
import express from "express";
import morgan from "morgan";
import connectionsRouter from "./routes/connections.js";
import usersRouter from "./routes/users.js";
import userIpsRouter from "./routes/userIps.js";
import { walletHubClient } from "./walletHubClient.js";

const app = express();
const port = Number(process.env.PORT ?? 4000);
app.set("trust proxy", true);
app.use((req, res, next) => {
  const origin = req.headers.origin ?? "*";
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Vary", "Origin");
  res.header("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/", (_req, res) => {
  res.json({
    message: "Welcome to the Wallet Hub server.",
    docs: {
      health: "/health",
      users: "/api/users",
      connections: "/api/connections",
      userIps: "/api/user-ips",
      walletHub: {
        health: "/wallet-hub/health",
        connections: "/wallet-hub/connections",
        userIps: "/wallet-hub/user-ips",
      },
    },
  });
});

app.get("/wallet-hub/health", async (_req, res) => {
  try {
    const payload = await walletHubClient.ping();
    res.json({ status: "ok", walletHub: payload });
  } catch (error) {
    res.status(502).json({ status: "error", message: (error as Error).message });
  }
});

app.get("/wallet-hub/connections", async (_req, res) => {
  try {
    const connections = await walletHubClient.listConnections();
    res.json(connections);
  } catch (error) {
    res.status(502).json({ error: (error as Error).message });
  }
});

app.get("/wallet-hub/user-ips", async (_req, res) => {
  try {
    const ips = await walletHubClient.listUserIps();
    res.json(ips);
  } catch (error) {
    res.status(502).json({ error: (error as Error).message });
  }
});

app.use("/api/connections", connectionsRouter);
app.use("/api/users", usersRouter);
app.use("/api/user-ips", userIpsRouter);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Wallet Hub server listening on http://localhost:${port}`);
});
