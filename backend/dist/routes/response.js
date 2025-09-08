import { Router } from "express";
import { prisma } from "../prisma.js";
import { z } from "zod";
import { authMiddleware } from "../middleware/auth.js";
const router = Router();
const AnswerSchema = z.object({
    questionId: z.number(),
    answer: z.string().min(1),
});
const SubmitSchema = z.object({
    surveyId: z.number(),
    answers: z.array(AnswerSchema).min(1),
});
router.post("/", authMiddleware, async (req, res) => {
    const parsed = SubmitSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const { surveyId, answers } = parsed.data;
    // Validate question set belongs to survey and required are present
    const questions = await prisma.question.findMany({ where: { surveyId } });
    const qMap = new Map(questions.map(q => [q.id, q]));
    for (const q of questions) {
        if (q.required && !answers.find(a => a.questionId === q.id && a.answer.trim().length > 0)) {
            return res.status(400).json({ error: `Missing required answer for question ${q.title}` });
        }
    }
    for (const a of answers) {
        const q = qMap.get(a.questionId);
        if (!q)
            return res.status(400).json({ error: `Question ${a.questionId} not in survey` });
        if (q.type === "NUMBER" && isNaN(Number(a.answer))) {
            return res.status(400).json({ error: `Question "${q.title}" requires a number` });
        }
        if (q.type === "SELECT" && q.options.length && !q.options.includes(a.answer)) {
            return res.status(400).json({ error: `Invalid option for "${q.title}"` });
        }
    }
    const response = await prisma.response.create({
        data: {
            userId: req.user.id,
            surveyId,
            items: {
                create: answers.map(a => ({ questionId: a.questionId, answer: a.answer })),
            },
        },
        include: { items: true },
    });
    res.json({ response });
});
router.get("/me", authMiddleware, async (req, res) => {
    const surveyId = req.query.surveyId ? Number(req.query.surveyId) : undefined;
    const where = { userId: req.user.id, ...(surveyId ? { surveyId } : {}) };
    const responses = await prisma.response.findMany({
        where,
        include: { items: true, survey: true },
        orderBy: { createdAt: "desc" },
    });
    res.json({ responses });
});
export default router;
