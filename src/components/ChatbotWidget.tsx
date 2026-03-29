import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sprout, User, Bot, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Message = {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
};

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! 🌱 I'm AgriSense AI, your smart farming assistant. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = getAiResponse(input);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const getAiResponse = (query: string) => {
    const q = query.toLowerCase();
    if (q.includes("rice") || q.includes("wheat")) return "For cereal crops like rice and wheat, keep an eye on soil nitrogen levels. Have you checked your N-P-K levels recently in the Soil Lab? 🌱";
    if (q.includes("disease") || q.includes("blight") || q.includes("spot")) return "I recommend using the AI Crop Detection tool. Just upload a photo of the affected leaf, and I'll identify the disease and provide a treatment plan! 📸";
    if (q.includes("weather") || q.includes("rain")) return "The current forecast for your area shows partly cloudy skies. Thursday might bring some rain, so it's a good day to check your drainage! 🌦️";
    if (q.includes("hello") || q.includes("hi")) return "Hi there! I'm ready to help you optimize your farm today. What's on your mind?";
    return "That's a great question. I recommend checking our Farming Tips library for detailed guides on that topic, or I can help you analyze your specific farm data if you provide more details! 🌾";
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-4 w-[360px] bg-card rounded-3xl shadow-2xl border border-border overflow-hidden flex flex-col anim-scale-in">
          <div className="gradient-hero p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-foreground/15 flex items-center justify-center border border-primary-foreground/10 box-glow">
                <Sprout className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <span className="font-heading text-base font-bold text-primary-foreground block">AgriSense AI</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-success anim-pulse" />
                  <p className="text-[10px] text-primary-foreground/70 font-medium tracking-wide">Live Assistant</p>
                </div>
              </div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/10 rounded-xl w-8 h-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div
            ref={scrollRef}
            className="h-[380px] p-5 overflow-y-auto space-y-4 bg-muted/5 no-scrollbar"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border ${m.sender === "user" ? "bg-muted border-muted" : "bg-primary/10 border-primary/10 text-primary"
                  }`}>
                  {m.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${m.sender === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-none font-medium"
                  : "bg-background border border-border rounded-tl-none text-foreground font-body"
                  }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/10 text-primary flex items-center justify-center flex-shrink-0 group">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-background border border-border p-3.5 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40 anim-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60 anim-pulse [animation-delay:200ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40 anim-pulse [animation-delay:400ms]" />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-background border-t border-border/60">
            <div className="flex gap-2.5">
              <Input
                placeholder="Ask me anything..."
                className="text-sm h-11 rounded-2xl bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary shadow-none pl-4"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <Button
                size="icon"
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="w-11 h-11 rounded-2xl gradient-earth shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all flex-shrink-0 group"
              >
                <Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Button>
            </div>
            <p className="text-[9px] text-center text-muted-foreground mt-3 font-medium uppercase tracking-widest opacity-60">
              Powered by AgriSense Intelligence
            </p>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className={`w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 ${open ? "bg-background border border-border text-foreground" : "gradient-earth text-primary-foreground box-glow"
          }`}
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
}
