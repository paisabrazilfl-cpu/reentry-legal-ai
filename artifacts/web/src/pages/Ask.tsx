import { useState } from "react";
import { useLocation } from "wouter";
import { useCreateOpenaiConversation } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Send, FileText, Briefcase, Scale, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const QUICK_PROMPTS = [
  {
    title: "Rights Violation",
    description: "I believe my constitutional rights are being violated. What can I do?",
    icon: Scale,
  },
  {
    title: "Program Credit",
    description: "How do I get sentence credit for completing programs in Kentucky DOC?",
    icon: FileText,
  },
  {
    title: "Halfway House",
    description: "What are my rights at a residential reentry center / halfway house?",
    icon: Briefcase,
  },
  {
    title: "Expose an Issue",
    description: "I want to describe a situation and get a full legal analysis of my options.",
    icon: HelpCircle,
  },
];

export default function AskPage() {
  const [content, setContent] = useState("");
  const [, setLocation] = useLocation();
  const createConversation = useCreateOpenaiConversation();
  const { toast } = useToast();

  const handleSubmit = async (text: string) => {
    if (!text.trim()) return;

    try {
      // Derive title from first 6 words
      const title = text.trim().split(/\s+/).slice(0, 6).join(" ") || "New Conversation";
      
      const conv = await createConversation.mutateAsync({
        data: { title }
      });

      // Pass the initial message via state
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
    <div className="max-w-3xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary tracking-tight">
          Understand Your Legal Rights
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A legal advisor providing guidance on Kentucky DOC programs, federal BOP rules, constitutional rights, and halfway-house policies.
        </p>
      </div>

      <Card className="border-2 border-primary/20 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <Textarea 
              placeholder="Describe your situation or ask a question..."
              className="min-h-[150px] text-base resize-none border-0 focus-visible:ring-0 p-0 bg-transparent"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(content);
                }
              }}
            />
            <div className="flex justify-between items-center border-t pt-4">
              <span className="text-sm text-muted-foreground">
                Press Enter to send, Shift+Enter for new line
              </span>
              <Button 
                onClick={() => handleSubmit(content)}
                disabled={!content.trim() || createConversation.isPending}
                className="gap-2"
                size="lg"
              >
                Start Consultation
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-center text-muted-foreground">Or start with a common question</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {QUICK_PROMPTS.map((prompt) => (
            <Card 
              key={prompt.title}
              className="cursor-pointer hover:border-primary/50 transition-colors hover:shadow-md group"
              onClick={() => handleSubmit(prompt.description)}
            >
              <CardHeader className="p-5">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <prompt.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base mb-1">{prompt.title}</CardTitle>
                    <CardDescription className="text-sm line-clamp-2">
                      "{prompt.description}"
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
