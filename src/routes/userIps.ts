import { Router } from "express";
import { z } from "zod";
import { userIpStore } from "../store.js";

const router = Router();

const locationSchema = z
  .object({
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    city: z.string().min(1).optional(),
    region: z.string().min(1).optional(),
    country: z.string().min(1).optional(),
    timezone: z.string().min(1).optional(),
    locale: z.string().min(1).optional(),
  })
  .partial();

const ipInput = z.object({
  userId: z.string().min(1),
  ip: z.string().min(3),
  note: z.string().min(1).optional(),
  location: locationSchema.optional(),
});

const ipPatch = ipInput.partial();

router.get("/", (_req, res) => {
  res.json(userIpStore.list());
});

router.get("/:id", (req, res) => {
  const entry = userIpStore.get(req.params.id);
  if (!entry) {
    return res.status(404).json({ error: "User IP not found" });
  }
  res.json(entry);
});

router.post("/", (req, res) => {
  const parsed = ipInput.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid payload", details: parsed.error.flatten() });
  }
  const entry = userIpStore.create(parsed.data);
  res.status(201).json(entry);
});

router.post("/record", (req, res) => {
  const parsed = z
    .object({
      userId: z.string().min(1),
      note: z.string().min(1).optional(),
      location: locationSchema.optional(),
    })
    .safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid payload", details: parsed.error.flatten() });
  }

  const ip = (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim() ??
    req.socket.remoteAddress ??
    "";

  if (!ip) {
    return res.status(400).json({ error: "Unable to determine client IP" });
  }

  const entry = userIpStore.create({
    userId: parsed.data.userId,
    ip,
    note: parsed.data.note,
    location: parsed.data.location,
  });

  res.status(201).json(entry);
});

router.patch("/:id", (req, res) => {
  const parsed = ipPatch.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid payload", details: parsed.error.flatten() });
  }
  const updated = userIpStore.update(req.params.id, parsed.data);
  if (!updated) {
    return res.status(404).json({ error: "User IP not found" });
  }
  res.json(updated);
});

router.delete("/:id", (req, res) => {
  const removed = userIpStore.remove(req.params.id);
  if (!removed) {
    return res.status(404).json({ error: "User IP not found" });
  }
  res.status(204).send();
});

export default router;
