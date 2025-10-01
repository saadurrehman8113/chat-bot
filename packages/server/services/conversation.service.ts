import OpenAI from "openai";

import { conversationRepository } from "../repositories/conversation.repository";

const client = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
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
    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: message,
      temperature: 0.2,
      max_output_tokens: 100,
      previous_response_id:
        conversationRepository.getLastResponseId(conversationId),
    });

    conversationRepository.setLastResponseId(conversationId, response.id);

    return {
      id: response.id,
      message: response.output_text,
    };
  },
};
