"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

type Message = {
  id: number;
  text: string;
  sender: "user" | "ai";
};

const predefinedResponses: { [key: string]: string } = {
  hello: "Hello! How can I assist you today?",
  help: "I'm here to help. What do you need assistance with?",
  weather:
    "I'm sorry, I don't have access to real-time weather information. You might want to check a weather app or website for the most up-to-date forecast.",
  time: "I'm an AI assistant and don't have access to the current time. You can check the time on your device.",
  bye: "Goodbye! If you need any more help, don't hesitate to ask.",
};

const suggestedQuestions = [
  "What can you help me with?",
  "How do I create a new task?",
  "Can you explain the financial calculator?",
  "How do I make a payment?",
];

export default function AIAssistant() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSubmit = () => {
    if (input.trim()) {
      const newUserMessage: Message = {
        id: Date.now(),
        text: input,
        sender: "user",
      };
      setMessages([...messages, newUserMessage]);

      const lowercaseInput = input.toLowerCase();
      const matchedResponse = Object.entries(predefinedResponses).find(
        ([key]) => lowercaseInput.includes(key)
      );

      const aiResponse = matchedResponse
        ? matchedResponse[1]
        : "I'm sorry, I don't understand that query. Can you please rephrase or ask something else?";

      const newAiMessage: Message = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: "ai",
      };
      setMessages((prevMessages) => [...prevMessages, newAiMessage]);

      setInput("");
    }
  };

  return (
    <Card className="flex h-[600px]">
      <div className="w-1/4 border-r">
        <CardHeader>
          <CardTitle>Conversation History</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            {messages
              .filter((m) => m.sender === "user")
              .map((message) => (
                <div
                  key={message.id}
                  className="mb-2 p-2 bg-sidebar rounded-full"
                >
                  {message.text}
                </div>
              ))}
          </ScrollArea>
        </CardContent>
      </div>
      <div className="w-3/4 flex flex-col">
        <CardHeader>
          <CardTitle>AI Assistant</CardTitle>
        </CardHeader>
        <CardContent className="grow flex flex-col">
          <ScrollArea className="grow mb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-2 p-2 rounded-2xl ${
                  message.sender === "user"
                    ? "bg-muted text-foreground text-right"
                    : "border"
                }`}
              >
                {message.text}
              </div>
            ))}
          </ScrollArea>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInput(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button onClick={handleSubmit}>Send</Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
