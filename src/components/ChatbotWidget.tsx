import { useState } from "react";
import { MessageCircle, X, Send, Sprout } from "lucide-react";
import { Input } from "@/components/ui/input";

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 w-[340px] bg-card rounded-2xl shadow-2xl border border-border overflow-hidden" style={{ animation: 'scaleIn 0.3s ease-out' }}>
          <div className="gradient-hero p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary-foreground/10 flex items-center justify-center">
                <Sprout className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <span className="font-semibold text-sm text-primary-foreground">AgriSense AI</span>
                <p className="text-[10px] text-primary-foreground/60">Online · Ready to help</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-primary-foreground/60 hover:text-primary-foreground p-1 rounded-lg hover:bg-primary-foreground/10 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="h-72 p-4 flex flex-col justify-end gap-3">
            <div className="bg-primary/8 rounded-2xl rounded-bl-sm p-3.5 text-sm text-foreground max-w-[85%] leading-relaxed">
              Hello! 🌱 I'm your AI farming assistant. Ask me about crop diseases, soil care, weather tips, or anything farming-related.
            </div>
          </div>
          <div className="p-3 border-t border-border flex gap-2">
            <Input placeholder="Type your question…" className="text-sm h-10 rounded-xl" />
            <button className="w-10 h-10 rounded-xl gradient-earth flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity">
              <Send className="w-4 h-4 text-primary-foreground" />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-2xl gradient-earth shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
      >
        {open ? <X className="w-5 h-5 text-primary-foreground" /> : <MessageCircle className="w-5 h-5 text-primary-foreground" />}
      </button>
    </div>
  );
}
