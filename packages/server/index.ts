import express from "express";
import dotenv from "dotenv";
import type { Request, Response } from "express";
import zod from "zod";
import OpenAI from "openai";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.get("/api/message", (req: Request, res: Response) => {
  res.json({ message: "Hello World" });
});

const conversations = new Map<string, string>();

const chatSchema = zod.object({
  message: zod
    .string()
    .min(1, "Message is required")
    .max(1000, "Message is too long, max allowed is 1000 characters"),
  conversationId: zod.string().uuid(),
});

app.post("/api/chat", async (req: Request, res: Response) => {
  const parsedSchema = chatSchema.safeParse(req.body);

  if (!parsedSchema.success) {
    return res.status(400).json({ error: parsedSchema.error.message });
  }

  try {
    const { message, conversationId } = req.body;

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: message,
      temperature: 0.2,
      max_output_tokens: 100,
      previous_response_id: conversations.get(conversationId),
    });

    conversations.set(conversationId, response.id);

    res.json({ message: response.output_text });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
