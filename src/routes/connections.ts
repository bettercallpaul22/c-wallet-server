import { Router } from "express";
import { z } from "zod";
import { connectionStore } from "../store.js";

const router = Router();

const connectionInput = z.object({
  walletId: z.string().min(1),
  userId: z.string().min(1),
  address: z.string().min(1),
  chain: z.string().min(1),
  status: z.enum(["active", "revoked", "pending"]).default("active"),
  metadata: z.record(z.unknown()).optional(),
});

const connectionPatch = connectionInput.partial();

router.get("/", (_req, res) => {
  res.json(connectionStore.list());
});

router.get("/:id", (req, res) => {
  const connection = connectionStore.get(req.params.id);
  if (!connection) {
    return res.status(404).json({ error: "Connection not found" });
  }
  res.json(connection);
});

router.post("/", (req, res) => {
  const parsed = connectionInput.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid payload", details: parsed.error.flatten() });
  }
  const connection = connectionStore.create(parsed.data);
  res.status(201).json(connection);
});

router.patch("/:id", (req, res) => {
  const parsed = connectionPatch.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid payload", details: parsed.error.flatten() });
  }
  const updated = connectionStore.update(req.params.id, parsed.data);
  if (!updated) {
    return res.status(404).json({ error: "Connection not found" });
  }
  res.json(updated);
});

router.delete("/:id", (req, res) => {
  const removed = connectionStore.remove(req.params.id);
  if (!removed) {
    return res.status(404).json({ error: "Connection not found" });
  }
  res.status(204).send();
});

export default router;
