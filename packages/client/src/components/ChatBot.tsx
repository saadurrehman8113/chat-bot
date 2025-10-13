import axios from "axios";
import { FaArrowUp } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import ReactMarkDown from "react-markdown";

import { Button } from "./ui/button";

type formData = {
  message: string;
};

type responseData = {
  message: string;
};

type responseMessage = {
  content: string;
  role: "user" | "bot";
};

const ChatBot = () => {
  const [messages, setMessages] = useState<responseMessage[]>([]);
  const [isLoading, setIsLoading] = useState<true | false>(false);
  const [error, setError] = useState<string>("");

  // Initialize form with react-hook-form
  // register: connects input fields to the form
  // handleSubmit: form submission handler
  // reset: clears the form after submission
  // formState: contains form validation state
  const { register, handleSubmit, reset, formState } = useForm<formData>();

  // Generate and persist a unique conversation ID for this chat session
  // Using useRef ensures the ID remains constant across re-renders
  const conversationId = useRef<string>(crypto.randomUUID());

  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView();
  }, [messages]);

  const onSubmit = async ({ message }: formData) => {
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

  const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    // Check if Enter is pressed without Shift key
    if (e.key === "Enter" && !e.shiftKey) {
      // Prevent default behavior (adding new line)
      e.preventDefault();
      // Manually trigger form submission
      handleSubmit(onSubmit)();
    }
  };

  const onCopyMessage = (e: React.ClipboardEvent) => {
    const selection = window.getSelection()?.toString().trim();
    if (selection) {
      e.preventDefault();
      e.clipboardData.setData("text/plain", selection);
    }
  };
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-1 flex-col gap-3 mb-10 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            onCopy={onCopyMessage}
            ref={lastMessageRef}
            className={`px-3 py-1 rounded-xl ${
              message.role === "user"
                ? "self-end bg-blue-600 text-white"
                : "self-start bg-gray-200 text-black"
            }`}
            key={index}
          >
            <ReactMarkDown>{message.content}</ReactMarkDown>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-1 bg-gray-200 px-3 py-3 rounded-full self-start ">
            <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse "></div>
            <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay:0.2s]"></div>
            <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay:0.2s]"></div>
          </div>
        )}

        {error && <div className="text-red-500">{error}</div>}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={onKeyDown}
        className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
      >
        <textarea
          {...register("message", {
            required: true, // Field is required
            validate: (value) => value.trim().length > 0, // Must not be empty/whitespace only
          })}
          maxLength={1000} // Limit message length to 1000 characters
          placeholder="Ask anything"
          className="w-full border-0 focus:outline-none resize-none"
          autoFocus
        ></textarea>

        <Button disabled={!formState.isValid} className="rounded-full w-9 h-9">
          <FaArrowUp />
        </Button>
      </form>
    </div>
  );
};

export default ChatBot;
