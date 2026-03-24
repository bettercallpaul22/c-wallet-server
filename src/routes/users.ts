import { Router } from "express";
import { z } from "zod";
import { userStore } from "../store.js";

const router = Router();

const userInput = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(3).optional(),
  status: z.enum(["active", "suspended", "pending"]).default("active"),
  metadata: z.record(z.unknown()).optional(),
});

const userPatch = userInput.partial();

router.get("/", (_req, res) => {
  res.json(userStore.list());
});

router.get("/:id", (req, res) => {
  const user = userStore.get(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
});

router.post("/", (req, res) => {
  const parsed = userInput.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid payload", details: parsed.error.flatten() });
  }
  const user = userStore.create(parsed.data);
  res.status(201).json(user);
});

router.patch("/:id", (req, res) => {
  const parsed = userPatch.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid payload", details: parsed.error.flatten() });
  }
  const updated = userStore.update(req.params.id, parsed.data);
  if (!updated) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(updated);
});

router.delete("/:id", (req, res) => {
  const removed = userStore.remove(req.params.id);
  if (!removed) {
    return res.status(404).json({ error: "User not found" });
  }
  res.status(204).send();
});

export default router;
