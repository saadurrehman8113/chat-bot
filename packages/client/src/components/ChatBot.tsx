import { Button } from "./ui/button";
import { FaArrowUp } from "react-icons/fa";

const ChatBot = () => {
  return (
    <div className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl">
      <textarea
        maxLength={1000}
        placeholder="Ask anything"
        className="w-full border-0 focus:outline-none resize-none"
      ></textarea>
      <Button className="rounded-full w-9 h-9">
        <FaArrowUp />
      </Button>
    </div>
  );
};

export default ChatBot;
