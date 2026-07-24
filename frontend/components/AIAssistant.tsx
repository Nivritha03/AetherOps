"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { MessageSquare, X, Send } from "lucide-react";
import { chatAssistant } from "@/lib/api";

export default function AIAssistant() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: "user"|"assistant", text: string}[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  if (pathname === "/") return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await chatAssistant(userMsg);
      setMessages(prev => [...prev, { role: "assistant", text: res.reply }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: "assistant", text: "Error communicating with AI assistant." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 900,
          width: 56, height: 56, borderRadius: "50%",
          background: "var(--blue-bright)", color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 16px rgba(56, 189, 248, 0.4)",
          border: "none", cursor: "pointer", transition: "transform 0.2s"
        }}
        className="ai-fab hover-scale"
      >
        <MessageSquare size={24} />
      </button>

      {isOpen && (
        <div style={{
          position: "fixed", bottom: 90, right: 24, zIndex: 1000,
          width: 380, height: 500, background: "var(--surface-0)",
          border: "1px solid var(--border)", borderRadius: 12,
          display: "flex", flexDirection: "column",
          boxShadow: "0 12px 32px rgba(0, 0, 0, 0.6)"
        }}>
          {/* Header */}
          <div style={{
            padding: "16px", borderBottom: "1px solid var(--border)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            background: "var(--surface-1)", borderRadius: "12px 12px 0 0"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--blue-dim)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <MessageSquare size={16} color="var(--blue-bright)" />
              </div>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>Aether AI</h3>
                <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>Cluster optimization assistant</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
              <X size={20} />
            </button>
          </div>

          {/* Chat History */}
          <div style={{ flex: 1, padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
            {messages.length === 0 && (
              <div style={{ textAlign: "center", marginTop: 40, color: "var(--text-muted)" }}>
                <MessageSquare size={32} style={{ opacity: 0.3, marginBottom: 12 }} />
                <p style={{ fontSize: 13 }}>Ask Aether AI about your cluster costs, recommendations, or optimization strategies.</p>
              </div>
            )}
            
            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "85%",
                background: msg.role === "user" ? "var(--blue-mid)" : "var(--surface-2)",
                border: msg.role === "user" ? "none" : "1px solid var(--border)",
                color: msg.role === "user" ? "#fff" : "var(--text-primary)",
                padding: "10px 14px", borderRadius: 12,
                fontSize: 13, lineHeight: 1.5
              }}>
                {msg.text}
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: "flex-start", padding: "10px 14px", borderRadius: 12, background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-muted)", fontSize: 13 }}>
                Thinking...
              </div>
            )}
          </div>

          {/* Input Area */}
          <div style={{ padding: "12px", borderTop: "1px solid var(--border)", background: "var(--surface-1)", borderRadius: "0 0 12px 12px" }}>
            <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask anything..."
                style={{
                  flex: 1, background: "var(--surface-hover)", border: "1px solid var(--border)",
                  borderRadius: 20, padding: "8px 16px", color: "var(--text-primary)", outline: "none", fontSize: 13
                }}
              />
              <button type="submit" disabled={!input.trim() || loading} style={{
                background: "var(--blue-bright)", border: "none", borderRadius: "50%",
                width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", cursor: "pointer", opacity: input.trim() && !loading ? 1 : 0.5
              }}>
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
