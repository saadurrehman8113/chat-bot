import zod from "zod";
import type { Response, Request } from "express";

import { conversationService } from "../services/conversation.service";

const chatSchema = zod.object({
  message: zod
    .string()
    .min(1, "Message is required")
    .max(1000, "Message is too long, max allowed is 1000 characters"),
  conversationId: zod.string().uuid(),
});

export const chatController = {
  sendMessage: async (req: Request, res: Response) => {
    // console.log("req.body", req.body);
    // setTimeout(() => {
    //   return res
    //     .status(200)
    //     .json({ message: "Message Received **Successfully**" });
    // }, 2000);

    const parsedSchema = chatSchema.safeParse(req.body);

    if (!parsedSchema.success) {
      res.status(400).json({ error: parsedSchema.error.message });
    }

    try {
      const { message, conversationId } = req.body;

      const response = await conversationService.sendMessage(
        message,
        conversationId
      );

      res.status(200).json({ message: response.message });
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
