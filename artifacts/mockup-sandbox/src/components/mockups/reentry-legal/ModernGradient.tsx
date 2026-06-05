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
  Zap
} from "lucide-react";

const QUICK_PROMPTS = [
  {
    title: "Rights Violation",
    description: "I believe my constitutional rights are being violated. What can I do?",
    icon: ShieldCheck,
    color: "from-[#ef4444] to-[#f97316]",
  },
  {
    title: "Earned Time Credits",
    description: "How do I apply First Step Act Earned Time Credits to reduce my sentence?",
    icon: Clock,
    color: "from-[#22c55e] to-[#14b8a6]",
  },
  {
    title: "Program Credit",
    description: "How do I get sentence credit for completing programs in Kentucky DOC?",
    icon: FileText,
    color: "from-[#3b82f6] to-[#8b5cf6]",
  },
  {
    title: "OSHA / Workplace",
    description: "My workplace is unsafe. What are my rights and how do I report violations?",
    icon: Briefcase,
    color: "from-[#f59e0b] to-[#ef4444]",
  },
  {
    title: "Halfway House",
    description: "What are my rights at a residential reentry center / halfway house?",
    icon: Gavel,
    color: "from-[#8b5cf6] to-[#ec4899]",
  },
  {
    title: "Expose an Issue",
    description: "I want to describe a situation and get a full legal analysis of my options.",
    icon: HelpCircle,
    color: "from-[#06b6d4] to-[#3b82f6]",
  },
];

const NAV_ITEMS = [
  { label: "Ask", icon: MessageSquare },
  { label: "History", icon: History },
  { label: "Resources", icon: BookOpen },
  { label: "50 States", icon: MapPin },
];

export function ModernGradient() {
  const [content, setContent] = useState("");
  const [activeNav, setActiveNav] = useState("Ask");

  return (
    <div className="min-h-screen bg-white text-[#0f172a] font-sans overflow-x-hidden">
      {/* Gradient header background */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-[#0f172a] overflow-hidden">
        <div className="absolute inset-0 bg-[#0f172a]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#1e3a5f] rounded-full blur-[100px] opacity-40" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-[#c9a227] rounded-full blur-[120px] opacity-10" />
      </div>

      {/* Header */}
      <header className="relative z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <Scale className="w-5 h-5 text-[#0f172a]" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">ReEntry Legal AI</span>
          </div>
          
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveNav(item.label)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  activeNav === item.label
                    ? "bg-white/20 text-white backdrop-blur-sm"
                    : "text-white/60 hover:text-white hover:bg-white/10"
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
      <main className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Hero */}
        <div className="text-center py-16 mb-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium border border-white/10">
            <Zap className="w-4 h-4" />
            AI-Powered Legal Intelligence
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]">
            Legal Rights
            <span className="block mt-1 text-[#c9a227]">Made Simple</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            Expert guidance on Kentucky DOC programs, federal BOP rules, constitutional rights, OSHA safety, Earned Time Credits, and all 50 state reentry laws.
          </p>
        </div>

        {/* Input Area */}
        <div className="max-w-3xl mx-auto mb-20">
          <div className="bg-white rounded-3xl shadow-2xl shadow-black/10 border border-[#e2e8f0] overflow-hidden">
            <div className="p-6">
              <textarea 
                placeholder="Describe your situation or ask a legal question..."
                className="w-full min-h-[140px] bg-transparent text-[#0f172a] placeholder-[#94a3b8] text-base resize-none border-0 outline-none p-0"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#f1f5f9]">
              <span className="text-xs text-[#94a3b8]">
                Press Enter to send, Shift+Enter for new line
              </span>
              <button className="flex items-center gap-2 px-6 py-3 bg-[#0f172a] hover:bg-[#1e293b] text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
                Start Consultation
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Prompts */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-[#0f172a] mb-2">Common Questions</h2>
            <p className="text-[#64748b]">Start with a pre-built question</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <div
                key={idx}
                className="group cursor-pointer bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#cbd5e1]"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-xl bg-[#f8fafc] flex items-center justify-center shrink-0`}>
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${prompt.color} flex items-center justify-center`}>
                      <prompt.icon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[#0f172a] font-semibold text-sm mb-1">{prompt.title}</h3>
                    <p className="text-[#64748b] text-xs leading-relaxed line-clamp-2">{prompt.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#cbd5e1] group-hover:text-[#0f172a] transition-all group-hover:translate-x-1 shrink-0 mt-1" />
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
            { label: "24/7", value: "Available", icon: Zap },
          ].map((stat, i) => (
            <div key={i} className="text-center p-6 bg-[#f8fafc] rounded-2xl border border-[#e2e8f0]">
              <stat.icon className="w-6 h-6 text-[#0f172a] mx-auto mb-3" />
              <div className="text-2xl font-bold text-[#0f172a]">{stat.value}</div>
              <div className="text-sm text-[#64748b]">{stat.label}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#e2e8f0] mt-20 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-[#94a3b8] max-w-2xl mx-auto">
            This is legal information, not legal advice. Consult a licensed attorney for representation in your specific case.
          </p>
        </div>
      </footer>
    </div>
  );
}
