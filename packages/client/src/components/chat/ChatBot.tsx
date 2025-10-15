import { useRef, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

import TypingIndicator from "./TypingIndicator";
import type { Message } from "./ChatMessage";
import ChatMessage from "./ChatMessage";
import ChatInput, { type ChatFormData } from "./ChatInput";

type responseData = {
  message: string;
};

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<true | false>(false);
  const [error, setError] = useState<string>("");

  // Initialize form with react-hook-form
  // register: connects input fields to the form
  // handleSubmit: form submission handler
  // reset: clears the form after submission
  // formState: contains form validation state
  const { reset } = useForm<ChatFormData>();

  // Generate and persist a unique conversation ID for this chat session
  // Using useRef ensures the ID remains constant across re-renders
  const conversationId = useRef<string>(crypto.randomUUID());

  const onSubmit = async ({ message }: ChatFormData) => {
    try {
      setMessages((prev: any) => [...prev, { content: message, role: "user" }]);

      reset();

      setIsLoading(true);
      setError("");

      const { data } = await axios.post<responseData>("/api/chat", {
        message,
        conversationId: conversationId.current,
      });

      setMessages((prev: any) => [
        ...prev,
        { content: data.message, role: "bot" },
      ]);
    } catch (error) {
      console.error(error);

      setError("Something went wrong. Please try again!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-1 flex-col gap-3 mb-10 overflow-y-auto">
        <ChatMessage messages={messages} />

        {isLoading && <TypingIndicator />}

        {error && <div className="text-red-500">{error}</div>}
      </div>
      <ChatInput onSubmit={onSubmit} />
    </div>
  );
};

export default ChatBot;
