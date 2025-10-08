import { Chatbot } from "@/components/chatbot";

export default function ChatbotPage() {
  return (
    <div className="container mx-auto p-6 h-full flex flex-col">
      <Chatbot className="flex-1 max-w-2xl mx-auto w-full" />
    </div>
  );
}
