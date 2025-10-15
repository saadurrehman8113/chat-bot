import { useEffect, useRef } from "react";
import ReactMarkDown from "react-markdown";

const onCopyMessage = (e: React.ClipboardEvent) => {
  const selection = window.getSelection()?.toString().trim();
  if (selection) {
    e.preventDefault();
    e.clipboardData.setData("text/plain", selection);
  }
};

export type Message = {
  content: string;
  role: "user" | "bot";
};

type Props = {
  messages: Message[];
};

const ChatMessage = ({ messages }: Props) => {
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView();
  }, [messages]);

  return (
    <div className="flex flex-col gap-3">
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
    </div>
  );
};

export default ChatMessage;
