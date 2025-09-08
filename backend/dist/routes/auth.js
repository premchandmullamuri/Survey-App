import { Router } from "express";
import { prisma } from "../prisma.js";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { signToken, authMiddleware } from "../middleware/auth.js";
const router = Router();
const credsSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});
router.post("/register", async (req, res) => {
    const parsed = credsSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const { email, password } = parsed.data;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
        return res.status(409).json({ error: "Email already in use" });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, passwordHash } });
    const token = signToken({ id: user.id, email: user.email });
    res.json({ token, user: { id: user.id, email: user.email } });
});
router.post("/login", async (req, res) => {
    const parsed = credsSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const { email, password } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
        return res.status(401).json({ error: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok)
        return res.status(401).json({ error: "Invalid credentials" });
    const token = signToken({ id: user.id, email: user.email });
    res.json({ token, user: { id: user.id, email: user.email } });
});
router.get("/me", authMiddleware, async (req, res) => {
    res.json({ user: req.user });
});
export default router;
