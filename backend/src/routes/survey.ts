import { Router } from "express";
import { prisma } from "../prisma.js";

const router = Router();

router.get("/", async (_req, res) => {
  const surveys = await prisma.survey.findMany({
    select: { id: true, title: true, description: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  res.json({ surveys });
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  const survey = await prisma.survey.findUnique({
    where: { id },
    include: { questions: { orderBy: { order: "asc" } } },
  });
  if (!survey) return res.status(404).json({ error: "Survey not found" });
  res.json({ survey });
});

export default router;