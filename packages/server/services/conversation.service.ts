import Groq from "groq-sdk";

import { conversationRepository } from "../repositories/conversation.repository";

const client = new Groq({
  apiKey: process.env.LLM_API_KEY,
});

type messageResponse = {
  id: string;
  message: string;
};

export const conversationService = {
  sendMessage: async (
    message: string,
    conversationId: string
  ): Promise<messageResponse> => {
    const response = await client.chat.completions.create({
      model: process.env.LLM_MODEL as string,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
      temperature: Number(process.env.LLM_TEMPERATURE),
      max_tokens: Number(process.env.LLM_MAX_OUTPUT_TOKENS),
    });

    conversationRepository.setLastResponseId(conversationId, response.id);

    return {
      id: response.id,
      message: response.choices?.[0]?.message?.content ?? "",
    };
  },
};
