import { FaArrowUp } from "react-icons/fa";
import { useForm } from "react-hook-form";

import { Button } from "../ui/button";

export type ChatFormData = {
  message: string;
};

const ChatInput = () => {
  const { register, handleSubmit, formState } = useForm<ChatFormData>();

  const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    // Check if Enter is pressed without Shift key
    if (e.key === "Enter" && !e.shiftKey) {
      // Prevent default behavior (adding new line)
      e.preventDefault();
      // Manually trigger form submission
      handleSubmit(onSubmit)();
    }
  };

  return (
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
  );
};

export default ChatInput;
