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
  Sparkles,
  Heart
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

export function WarmAccessible() {
  const [content, setContent] = useState("");
  const [activeNav, setActiveNav] = useState("Ask");

  return (
    <div className="min-h-screen bg-[#faf6f0] text-[#1a1a1a] font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#faf6f0]/90 backdrop-blur-md border-b border-[#e8ddd0]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#8B4513] rounded-lg flex items-center justify-center">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-[#1a1a1a]">ReEntry Legal AI</span>
          </div>
          
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveNav(item.label)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  activeNav === item.label
                    ? "bg-[#8B4513] text-white shadow-md"
                    : "text-[#5a5a5a] hover:text-[#1a1a1a] hover:bg-[#e8ddd0]"
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
      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-12 space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8B4513]/10 text-[#8B4513] text-sm font-medium">
            <Heart className="w-4 h-4" />
            Empowering Your Legal Journey
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-[#1a1a1a] leading-[1.15]">
            Know Your Rights,
            <br />
            <span className="text-[#8B4513]">Reclaim Your Future</span>
          </h1>
          <p className="text-lg text-[#5a5a5a] max-w-2xl mx-auto leading-relaxed">
            Clear, compassionate guidance on Kentucky DOC programs, federal BOP rules, constitutional rights, OSHA safety, Earned Time Credits, and all 50 state reentry laws.
          </p>
        </div>

        {/* Input Area */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="bg-white rounded-3xl shadow-xl shadow-[#8B4513]/5 border border-[#e8ddd0] overflow-hidden">
            <div className="p-6">
              <textarea 
                placeholder="Describe your situation or ask a legal question..."
                className="w-full min-h-[120px] bg-transparent text-[#1a1a1a] placeholder-[#b8b0a6] text-base resize-none border-0 outline-none p-0"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#e8ddd0] bg-[#faf6f0]/50">
              <span className="text-xs text-[#a8a0a0]">
                Press Enter to send, Shift+Enter for new line
              </span>
              <button className="flex items-center gap-2 px-6 py-2.5 bg-[#8B4513] hover:bg-[#6B3410] text-white font-semibold rounded-full transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105">
                Start Consultation
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Prompts */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-[#1a1a1a] mb-1">Common Questions</h2>
            <p className="text-[#5a5a5a] text-sm">Click any question to start</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <div
                key={idx}
                className="group cursor-pointer bg-white rounded-2xl p-5 border border-[#e8ddd0] transition-all duration-200 hover:border-[#8B4513]/30 hover:shadow-lg hover:shadow-[#8B4513]/5 hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#8B4513]/10 flex items-center justify-center shrink-0 group-hover:bg-[#8B4513]/20 transition-colors">
                    <prompt.icon className="w-5 h-5 text-[#8B4513]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[#1a1a1a] font-semibold text-sm mb-0.5">{prompt.title}</h3>
                    <p className="text-[#8a8a8a] text-xs leading-relaxed">{prompt.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#d0c8c0] group-hover:text-[#8B4513] transition-all group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "50 States", value: "Covered", icon: MapPin },
            { label: "Legal Areas", value: "12+", icon: Gavel },
            { label: "Federal Laws", value: "Tracked", icon: FileText },
            { label: "24/7", value: "Available", icon: Sparkles },
          ].map((stat, i) => (
            <div key={i} className="text-center p-5 bg-white rounded-2xl border border-[#e8ddd0]">
              <stat.icon className="w-5 h-5 text-[#8B4513] mx-auto mb-2" />
              <div className="text-lg font-bold text-[#1a1a1a]">{stat.value}</div>
              <div className="text-xs text-[#8a8a8a]">{stat.label}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e8ddd0] mt-16 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-xs text-[#a8a0a0] max-w-2xl mx-auto">
            This is legal information, not legal advice. Consult a licensed attorney for representation in your specific case.
          </p>
        </div>
      </footer>
    </div>
  );
}
