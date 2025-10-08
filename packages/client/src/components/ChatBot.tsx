// Import axios for making HTTP requests to the chat API
import axios from "axios";
// Import the arrow up icon for the submit button
import { FaArrowUp } from "react-icons/fa";
// Import react-hook-form for form management and validation
import { useForm } from "react-hook-form";
// Import useRef hook to persist conversation ID across renders
import { useRef } from "react";

// Import custom Button component
import { Button } from "./ui/button";

// Define the shape of the form data
type formData = {
  message: string;
};

/**
 * ChatBot component - A form interface for users to send messages to the chat API
 * Features:
 * - Text input with validation
 * - Submit on Enter key (Shift+Enter for new lines)
 * - Auto-reset after submission
 * - Maintains conversation context using a persistent conversation ID
 * - Sends messages to /api/chat endpoint
 */
const ChatBot = () => {
  // Initialize form with react-hook-form
  // register: connects input fields to the form
  // handleSubmit: form submission handler
  // reset: clears the form after submission
  // formState: contains form validation state
  const { register, handleSubmit, reset, formState } = useForm<formData>();

  // Generate and persist a unique conversation ID for this chat session
  // Using useRef ensures the ID remains constant across re-renders
  const conversationId = useRef<string>(crypto.randomUUID());

  /**
   * Handle form submission
   * Sends the user's message to the chat API and processes the response
   * @param message - The user's message from the form
   */
  const onSubmit = async ({ message }: formData) => {
    // Clear the form immediately after submission for better UX
    reset();

    // Send the message to the chat API endpoint
    // Include the conversationId to maintain conversation context
    const { data } = await axios.post("/api/chat", {
      message,
      conversationId: conversationId.current,
    });

    // Log the API response (will be used to display chat messages)
    console.log("response", data);
  };

  /**
   * Handle keyboard events on the form
   * Allows submitting with Enter key (without Shift)
   * Shift+Enter allows multi-line input
   */
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
      {/* Message input textarea */}
      <textarea
        {...register("message", {
          required: true, // Field is required
          validate: (value) => value.trim().length > 0, // Must not be empty/whitespace only
        })}
        maxLength={1000} // Limit message length to 1000 characters
        placeholder="Ask anything"
        className="w-full border-0 focus:outline-none resize-none"
      ></textarea>

      {/* Submit button - disabled when form is invalid */}
      <Button disabled={!formState.isValid} className="rounded-full w-9 h-9">
        <FaArrowUp />
      </Button>
    </form>
  );
};

export default ChatBot;
