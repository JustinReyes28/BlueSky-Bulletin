"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, Bot, Loader2, Sparkles, X } from "lucide-react";
import { WeatherData } from "@/lib/weather/types";

interface Message {
    role: "user" | "assistant";
    content: string;
}

interface InsightChatProps {
    weatherContext: WeatherData | null;
    locationName: string;
}

export default function InsightChat({ weatherContext, locationName }: InsightChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage: Message = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const response = await fetch("/api/insights/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [...messages, userMessage],
                    weatherContext,
                    locationName,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Chat API Error:', errorData);
                throw new Error(errorData.details || "Chat failed");
            }

            const data = await response.json();
            setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
        } catch (error: any) {
            console.error('InsightChat error:', error);
            setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I couldn't process that. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[400px] border rounded-xl bg-card overflow-hidden shadow-sm">
            <div className="p-4 border-b bg-muted/50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-accent" />
                    <h2 className="text-sm font-bold uppercase tracking-widest">Weather Assistant</h2>
                </div>
                <button
                    onClick={() => setMessages([])}
                    className="text-[10px] text-muted-foreground uppercase font-bold hover:text-foreground transition-colors"
                >
                    Clear Chat
                </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30 px-8">
                        <Bot className="w-12 h-12" />
                        <p className="text-sm">Ask me anything about the weather in {locationName}!</p>
                    </div>
                )}
                {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-accent text-white" : "bg-muted"
                            }`}>
                            {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>
                        <div className={`p-3 rounded-lg text-sm max-w-[80%] ${msg.role === "user" ? "bg-accent text-white" : "bg-muted"
                            }`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center animate-pulse">
                            <Bot className="w-4 h-4" />
                        </div>
                        <div className="p-3 rounded-lg bg-muted animate-pulse">
                            <Loader2 className="w-4 h-4 animate-spin" />
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 border-t bg-muted/20">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Type your question..."
                        className="w-full pl-4 pr-12 py-2.5 bg-background border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || loading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-accent text-white rounded-md disabled:opacity-50 hover:bg-accent/90 transition-colors"
                    >
                        <Send className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
