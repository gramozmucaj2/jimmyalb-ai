"use client";
import { useState, useRef, useEffect } from "react";

const TypingIndicator = () => (
  <div style={{ display: "flex", gap: 5, alignItems: "center", padding: "12px 16px" }}>
    {[0, 1, 2].map((i) => (
      <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366f1", animation: "bounce 1.2s infinite", animationDelay: `${i * 0.2}s` }} />
    ))}
  </div>
);

const CodeBlock = ({ code, lang }) => {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ position: "relative", margin: "10px 0", borderRadius: 10, overflow: "hidden", background: "#0d1117", border: "1px solid #30363d" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 12px", background: "#161b22", borderBottom: "1px solid #30363d" }}>
        <span style={{ color: "#8b949e", fontSize: 12, fontFamily: "monospace" }}>{lang || "code"}</span>
        <button onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{ background: "none", border: "1px solid #30363d", color: copied ? "#3fb950" : "#8b949e", cursor: "pointer", borderRadius: 6, padding: "2px 10px", fontSize: 12 }}>
          {copied ? "✓ Copiato" : "Copia"}
        </button>
      </div>
      <pre style={{ margin: 0, padding: "14px 16px", overflowX: "auto", color: "#e6edf3", fontSize: 13, lineHeight: 1.6, fontFamily: "monospace" }}>{code}</pre>
    </div>
  );
};

const renderMessage = (text) => {
  const parts = [];
  const regex = /```(\w*)\n?([\s\S]*?)```/g;
  let last = 0, match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push({ type: "text", content: text.slice(last, match.index) });
    parts.push({ type: "code", lang: match[1], content: match[2].trim() });
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push({ type: "text", content: text.slice(last) });
  return parts.map((p, i) =>
    p.type === "code" ? <CodeBlock key={i} code={p.content} lang={p.lang} /> :
    <span key={i} style={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: p.content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\*(.*?)\*/g, "<em>$1</em>").replace(/`(.*?)`/g, '<code style="background:#1e1e2e;color:#cba6f7;padding:2px 6px;border-radius:4px;font-family:monospace;font-size:0.9em">$1</code>') }} />
  );
};

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const adjustTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  };

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setTimeout(() => { if (textareaRef.current) textareaRef.current.style.height = "auto"; }, 0);
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: newMessages }) });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply || "⚠️ Errore nella risposta." }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "⚠️ Errore di connessione. Riprova." }]);
    }
    setLoading(false);
  };

  const capabilities = ["💻 Coding", "🌐 Siti Web", "📱 App Mobile", "🤖 AI/ML", "🎨 UI/UX", "🔧 DevOps"];

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-8px)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        body { margin: 0; }
        ::-webkit-scrollbar{width:6px} ::-webkit-scrollbar-thumb{background:#3f3f5a;border-radius:3px}
        textarea { resize: none; outline: none; }
        textarea::placeholder { color: #4a4a6a; }
      `}</style>
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)", display: "flex", flexDirection: "column", fontFamily: "'Inter', system-ui, sans-serif", color: "#e2e8f0" }}>
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #1e1e3a", background: "rgba(15,15,26,0.8)", position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: "linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, boxShadow: "0 0 20px rgba(99,102,241,0.4)" }}>⚡</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 18, background: "linear-gradient(90deg, #6366f1, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>jimmyalb.ai</div>
                <div style={{ fontSize: 11, color: "#6366f1", display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "pulse 2s infinite" }} />
                  Powered by Claude · Nessun limite
                </div>
              </div>
            </div>
            {messages.length > 0 && <button onClick={() => setMessages([])} style={{ background: "rgba(99,102,241,0.1)", border: "1px solid #3f3f6a", color: "#8b8bb0", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 12 }}>Nuova chat</button>}
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 16px" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            {messages.length === 0 ? (
              <div style={{ textAlign: "center", paddingTop: 40, animation: "fadeIn 0.5s ease" }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>⚡</div>
                <h1 style={{ fontSize: 32, fontWeight: 800, background: "linear-gradient(90deg, #6366f1, #a78bfa, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 10 }}>jimmyalb.ai</h1>
                <p style={{ color: "#6b6b8d", fontSize: 16, marginBottom: 32, lineHeight: 1.6 }}>Il tuo assistente AI potenziato.<br />Codice, siti, app, design e molto altro.</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 40 }}>
                  {capabilities.map((c) => <span key={c} style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 20, padding: "6px 16px", fontSize: 13, color: "#a78bfa" }}>{c}</span>)}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, maxWidth: 700, margin: "0 auto" }}>
                  {[{ icon: "🌐", text: "Crea un sito portfolio moderno in React" }, { icon: "🔧", text: "Scrivi un'API REST con autenticazione JWT" }, { icon: "📱", text: "App Flutter per gestire le spese" }, { icon: "🤖", text: "Script Python per analisi dati CSV" }].map((s) => (
                    <button key={s.text} onClick={() => { setInput(s.text); textareaRef.current?.focus(); }} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #2a2a4a", borderRadius: 12, padding: "14px 16px", cursor: "pointer", textAlign: "left", color: "#94a3b8", fontSize: 13, lineHeight: 1.4 }}>
                      <span style={{ marginRight: 8 }}>{s.icon}</span>{s.text}
                    </button>
                  ))}
                </div>
              </div>
            ) : messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 20, animation: "fadeIn 0.3s ease" }}>
                {m.role === "assistant" && <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, marginRight: 10, flexShrink: 0, marginTop: 2 }}>⚡</div>}
                <div style={{ maxWidth: "82%", background: m.role === "user" ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "rgba(255,255,255,0.04)", border: m.role === "user" ? "none" : "1px solid #2a2a4a", borderRadius: m.role === "user" ? "20px 20px 6px 20px" : "20px 20px 20px 6px", padding: "12px 16px", color: "#e2e8f0", fontSize: 14, lineHeight: 1.7, boxShadow: m.role === "user" ? "0 4px 20px rgba(99,102,241,0.3)" : "none" }}>
                  {renderMessage(m.content)}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 20 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, marginRight: 10, flexShrink: 0 }}>⚡</div>
                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid #2a2a4a", borderRadius: "20px 20px 20px 6px" }}><TypingIndicator /></div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        </div>
        <div style={{ padding: "16px", borderTop: "1px solid #1e1e3a", background: "rgba(15,15,26,0.9)" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end", background: "rgba(255,255,255,0.04)", border: "1px solid #2a2a4a", borderRadius: 16, padding: "10px 12px 10px 16px" }}>
              <textarea ref={textareaRef} value={input} onChange={(e) => { setInput(e.target.value); adjustTextarea(); }} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} placeholder="Chiedi qualsiasi cosa — codice, siti, app, idee..." rows={1} style={{ flex: 1, background: "transparent", border: "none", color: "#e2e8f0", fontSize: 14, lineHeight: 1.6, maxHeight: 160, fontFamily: "inherit" }} />
              <button onClick={send} disabled={!input.trim() || loading} style={{ width: 38, height: 38, borderRadius: 10, background: input.trim() && !loading ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "#2a2a4a", border: "none", cursor: input.trim() && !loading ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0, transition: "all 0.2s" }}>
                {loading ? "⏳" : "↑"}
              </button>
            </div>
            <p style={{ textAlign: "center", color: "#3a3a5a", fontSize: 11, marginTop: 8 }}>Premi Enter per inviare · Shift+Enter per andare a capo</p>
          </div>
        </div>
      </div>
    </>
  );
}