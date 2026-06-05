import { useState } from "react";
import { 
  Scale, 
  Send, 
  FileText, 
  Briefcase, 
  ShieldCheck, 
  HelpCircle, 
  Clock, 
  Gavel, 
  MessageSquare,
  History,
  BookOpen,
  MapPin,
  ChevronRight,
  Sparkles
} from "lucide-react";

const QUICK_PROMPTS = [
  {
    title: "Rights Violation",
    description: "I believe my constitutional rights are being violated. What can I do?",
    icon: ShieldCheck,
  },
  {
    title: "Earned Time Credits",
    description: "How do I apply First Step Act Earned Time Credits to reduce my sentence?",
    icon: Clock,
  },
  {
    title: "Program Credit",
    description: "How do I get sentence credit for completing programs in Kentucky DOC?",
    icon: FileText,
  },
  {
    title: "OSHA / Workplace",
    description: "My workplace is unsafe. What are my rights and how do I report violations?",
    icon: Briefcase,
  },
  {
    title: "Halfway House",
    description: "What are my rights at a residential reentry center / halfway house?",
    icon: Gavel,
  },
  {
    title: "Expose an Issue",
    description: "I want to describe a situation and get a full legal analysis of my options.",
    icon: HelpCircle,
  },
];

const NAV_ITEMS = [
  { label: "Ask", icon: MessageSquare },
  { label: "History", icon: History },
  { label: "Resources", icon: BookOpen },
  { label: "50 States", icon: MapPin },
];

export function DarkLegalTech() {
  const [content, setContent] = useState("");
  const [activeNav, setActiveNav] = useState("Ask");
  const [hoveredPrompt, setHoveredPrompt] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-[#e2e8f0] font-sans overflow-x-hidden">
      {/* Background ambient effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#c9a227]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#1e3a5f]/20 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-[#1e2d47]/50 bg-[#0a0f1a]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#c9a227] rounded-lg flex items-center justify-center shadow-lg shadow-[#c9a227]/20">
              <Scale className="w-5 h-5 text-[#0a0f1a]" />
            </div>
            <span className="text-lg font-bold tracking-tight text-[#f8fafc]">ReEntry Legal AI</span>
          </div>
          
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveNav(item.label)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeNav === item.label
                    ? "bg-[#c9a227]/10 text-[#c9a227] shadow-[0_0_20px_rgba(201,162,39,0.1)]"
                    : "text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-[#1e2d47]/50"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="hidden md:inline">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/20 text-[#c9a227] text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            AI-Powered Legal Guidance
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#f8fafc] leading-[1.1]">
            Understand Your
            <span className="block mt-1 bg-[#c9a227] bg-clip-text text-transparent">
              Legal Rights
            </span>
          </h1>
          <p className="text-lg md:text-xl text-[#94a3b8] max-w-2xl mx-auto leading-relaxed">
            Expert guidance on Kentucky DOC programs, federal BOP rules, constitutional rights, OSHA safety, Earned Time Credits, and all 50 state reentry laws.
          </p>
        </div>

        {/* Input Area */}
        <div className="max-w-3xl mx-auto mb-20">
          <div className="relative group">
            <div className="absolute -inset-1 bg-[#c9a227]/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-[#111827] border border-[#1e2d47] rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
              <div className="p-6">
                <textarea 
                  placeholder="Describe your situation or ask a legal question..."
                  className="w-full min-h-[140px] bg-transparent text-[#e2e8f0] placeholder-[#475569] text-base resize-none border-0 outline-none p-0"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between px-6 py-4 border-t border-[#1e2d47]">
                <span className="text-xs text-[#475569]">
                  Press Enter to send, Shift+Enter for new line
                </span>
                <button className="flex items-center gap-2 px-6 py-3 bg-[#c9a227] hover:bg-[#d4af37] text-[#0a0f1a] font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-[#c9a227]/20 hover:shadow-[#c9a227]/40 hover:scale-105">
                  Start Consultation
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Prompts */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-[#f8fafc] mb-2">Common Questions</h2>
            <p className="text-[#64748b]">Start with a pre-built question</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoveredPrompt(idx)}
                onMouseLeave={() => setHoveredPrompt(null)}
                className={`relative group cursor-pointer bg-[#111827] border border-[#1e2d47] rounded-xl p-6 transition-all duration-300 ${
                  hoveredPrompt === idx 
                    ? "border-[#c9a227]/30 shadow-[0_0_30px_rgba(201,162,39,0.08)] -translate-y-1" 
                    : "hover:border-[#1e2d47]/80"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300 ${
                    hoveredPrompt === idx ? "bg-[#c9a227]/20" : "bg-[#1e2d47]/50"
                  }`}>
                    <prompt.icon className={`w-5 h-5 transition-colors duration-300 ${
                      hoveredPrompt === idx ? "text-[#c9a227]" : "text-[#94a3b8]"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[#f8fafc] font-semibold text-sm mb-1">{prompt.title}</h3>
                    <p className="text-[#64748b] text-sm leading-relaxed line-clamp-2">{prompt.description}</p>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-[#475569] transition-all duration-300 shrink-0 mt-1 ${
                    hoveredPrompt === idx ? "text-[#c9a227] translate-x-1" : ""
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "50 States", value: "Covered", icon: MapPin },
            { label: "Legal Areas", value: "12+", icon: Gavel },
            { label: "Federal Laws", value: "Tracked", icon: FileText },
            { label: "24/7", value: "Available", icon: Sparkles },
          ].map((stat, i) => (
            <div key={i} className="text-center p-6 bg-[#111827] border border-[#1e2d47] rounded-xl">
              <stat.icon className="w-6 h-6 text-[#c9a227] mx-auto mb-3" />
              <div className="text-2xl font-bold text-[#f8fafc]">{stat.value}</div>
              <div className="text-sm text-[#64748b]">{stat.label}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#1e2d47]/50 mt-20 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-[#475569] max-w-2xl mx-auto">
            This is legal information, not legal advice. Consult a licensed attorney for representation in your specific case.
          </p>
        </div>
      </footer>
    </div>
  );
}
