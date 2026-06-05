import { useState } from "react";
import { useLocation } from "wouter";
import { useCreateOpenaiConversation } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Send, 
  FileText, 
  Briefcase, 
  ShieldCheck, 
  HelpCircle, 
  Clock, 
  Gavel, 
  ChevronRight,
  Zap,
  MapPin,
  Scale
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

const STATS = [
  { label: "50 States", value: "Covered", icon: MapPin },
  { label: "Legal Areas", value: "12+", icon: Scale },
  { label: "Federal Laws", value: "Tracked", icon: FileText },
  { label: "24/7", value: "Available", icon: Zap },
];

export default function AskPage() {
  const [content, setContent] = useState("");
  const [, setLocation] = useLocation();
  const createConversation = useCreateOpenaiConversation();
  const { toast } = useToast();

  const handleSubmit = async (text: string) => {
    if (!text.trim()) return;
    try {
      const title = text.trim().split(/\s+/).slice(0, 6).join(" ") || "New Conversation";
      const conv = await createConversation.mutateAsync({ data: { title } });
      setLocation(`/chat/${conv.id}`, { state: { initialMessage: text } });
    } catch (err) {
      toast({
        title: "Error starting conversation",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="relative">
      {/* Dark gradient hero section */}
      <div className="bg-[#0f172a] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#1e3a5f] rounded-full blur-[100px] opacity-40" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-[#c9a227] rounded-full blur-[120px] opacity-10" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium border border-white/10 mb-6">
            <Zap className="w-4 h-4" />
            AI-Powered Legal Intelligence
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6">
            Legal Rights
            <span className="block text-[#c9a227]">Made Simple</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            Expert guidance on Kentucky DOC programs, federal BOP rules, constitutional rights, OSHA safety, Earned Time Credits, and all 50 state reentry laws.
          </p>
        </div>
      </div>

      {/* White content area */}
      <div className="bg-white max-w-5xl mx-auto px-6 -mt-8 relative z-20">
        {/* Input Card */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="bg-white rounded-3xl shadow-2xl shadow-black/10 border border-[#e2e8f0] overflow-hidden">
            <div className="p-6">
              <Textarea
                placeholder="Describe your situation or ask a legal question..."
                className="min-h-[140px] bg-transparent text-[#0f172a] placeholder-[#94a3b8] text-base resize-none border-0 focus-visible:ring-0 p-0"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(content);
                  }
                }}
              />
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#f1f5f9]">
              <span className="text-xs text-[#94a3b8]">
                Press Enter to send, Shift+Enter for new line
              </span>
              <Button
                onClick={() => handleSubmit(content)}
                disabled={!content.trim() || createConversation.isPending}
                className="gap-2 px-6 py-3 bg-[#0f172a] hover:bg-[#1e293b] text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Start Consultation
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Prompts */}
        <div className="space-y-8 mb-20">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-[#0f172a] mb-2">Common Questions</h2>
            <p className="text-[#64748b]">Click any question to start</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <div
                key={idx}
                onClick={() => handleSubmit(prompt.description)}
                className="group cursor-pointer bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#cbd5e1]"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#f8fafc] flex items-center justify-center shrink-0">
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {STATS.map((stat, i) => (
            <div key={i} className="text-center p-6 bg-[#f8fafc] rounded-2xl border border-[#e2e8f0]">
              <stat.icon className="w-6 h-6 text-[#0f172a] mx-auto mb-3" />
              <div className="text-2xl font-bold text-[#0f172a]">{stat.value}</div>
              <div className="text-sm text-[#64748b]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
